import { Logger } from "winston";

import { MaybePromise } from "../utils/type.utils";

import { MessageChain } from "./interface/message.interface";
import { MIRAI_COMMAND_METADATA } from "./mirai.decorator";
import { ParsedCommand } from "./mirai.service";
import { MiraiSession } from "./session.service";

export interface MiraiCommandContext<M = any> {
  message: ParsedCommand;
  session: MiraiSession<M>;
}

export abstract class MiraiCommand {
  get command(): string {
    const cmd0 = Reflect.getMetadata(MIRAI_COMMAND_METADATA, this.constructor);
    if(typeof cmd0 === "string")
      return cmd0;
    const cmd1 = /^(\w+)Command$/.exec(this.constructor.name)?.[1];
    if(cmd1)
      return cmd1.toLowerCase();
    throw Error("Specify the command in decorator or use `ExampleCommand` as the class name to set command as `example`");
  }
  constructor(protected readonly logger?: Logger) {
    if(logger) {
      this.logger = this.logger?.child({context: this.constructor.name});
    }
  }
  abstract trigger(context: MiraiCommandContext): MaybePromise<MessageChain | string>;
}

export interface MiraiCommandOnCommandRegister {
  onCommandRegister(): void;
}
