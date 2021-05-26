import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ModuleRef, NestContainer } from "@nestjs/core";
import { InstanceWrapper } from "@nestjs/core/injector/instance-wrapper";
import { ConfigInterface } from "src/config/config.interface";
import { BotConfig } from "src/config/configuration";
import { parseCmd } from "src/utils/parseCmd.util";

import { ApiService } from "./api.service";
import { isAt, plain } from "./api.utils";
import { MiraiCommand } from "./command.abstract";
import { MiraiChatMessage } from "./message.interface";
import { MIRAI_COMMAND_METADATA } from "./mirai.decorator";

export interface ParsedCommand {
  message: MiraiChatMessage;
  command: string;
  prefix: string;
  arguments: string[];
}



@Injectable()
export class MiraiService implements OnModuleInit {
  private readonly logger = new Logger(ApiService.name);
  private readonly commandMap = new Map<string, MiraiCommand>();
  constructor(
    private readonly apiService: ApiService,
    private readonly moduleRef: ModuleRef,
    @Inject(BotConfig.KEY) private readonly config: ConfigInterface,

  ) { }
  onModuleInit() {
    const container = (this.moduleRef as any).container as NestContainer;
    Array
      .from(container.getModules().values())
      .map(f => Array.from(f.providers.values()))
      .reduce<InstanceWrapper<unknown>[]>((p, v) => p.concat(v), [])
      .filter(v => v.metatype && Reflect.hasMetadata(MIRAI_COMMAND_METADATA, v.metatype))
      .map(v => this.registerCommand(v));
    this.apiService.on("ChatMessage", msg => this.trigger(msg));
  }
  registerCommand(wrapper: InstanceWrapper<any>) {
    if (!(wrapper.instance instanceof MiraiCommand)) {
      this.logger.warn(`${wrapper.name} doesn't extends Command, Skip load it`);
    } else {
      const command = wrapper.instance;
      this.logger.log(`Load command ${command.command}`);
      if (command.onCommandRegister) {
        command.onCommandRegister();
      }
      if (this.commandMap.has(command.command)) {
        this.logger.warn(`Command ${command.command} duplicated`);
      }
      this.commandMap.set(command.command, command);
    }
  }
  async trigger(message: MiraiChatMessage): Promise<void> {
    let text = plain(message.messageChain).trim();
    const { commandPrefix } = this.config;
    let prefix = "";
    const testMessage = (prefix: string) => (prefix === "AT") ? isAt(message.messageChain, this.config.qq) : text.startsWith(prefix);
    if (typeof commandPrefix === "string") {
      if (!testMessage(commandPrefix)) return;
      prefix = commandPrefix;
    } else {
      if (!commandPrefix.some(v => testMessage(v) && (prefix = v))) return;
    }
    text = text.slice(prefix.length);
    const cmd = parseCmd(text);
    const parsed: ParsedCommand = {
      message, prefix,
      command: cmd[0],
      arguments: cmd.slice(1),
    };
    const command = this.commandMap.get(parsed.command);
    if (!command)
      return;
    this.logger.verbose(`Trigger command ${command.command}`);
    try {
      const result = await command.trigger(parsed);
      this.apiService.reply(result, message);
      return;
    } catch(e: unknown) {
      this.apiService.reply("Something wrong happen when process command", message);
      this.logger.error(e);
    }
  }
}
