import { EventEmitter } from "events";

import { HttpService, Inject, Injectable, OnApplicationShutdown, OnModuleInit } from "@nestjs/common";
import { isUndefined } from "lodash";
import { nanoid } from "nanoid";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { ConfigInterface } from "src/config/config.interface";
import { BotConfig } from "src/config/configuration";
import { Mixin } from "ts-mixer";
import { Logger } from "winston";
import ws from "ws";

import { log } from "./api.utils";
import { MiraiAPIResponse, MiraiEventEmitter, WebSocketResponse, MiraiAPIError } from "./interface/api.interface";
import { isMiraiEvent } from "./interface/event.interface";
import { isMiraiMessage, makeMessage, MessageChain, MiraiChatMessage } from "./interface/message.interface";
import { AboutMixin } from "./mixin/about.mixin";
import { AccountMixin } from "./mixin/account.mixin";
import { CacheMixin } from "./mixin/cache.mixin";
import { FileMixin } from "./mixin/file.mixin";
import { GroupMixin } from "./mixin/group.mixin";
import { InfoMixin } from "./mixin/info.mixin";
import { RespondMixin } from "./mixin/respond.mixin";
import { SendMixin } from "./mixin/send.mixin";
@Injectable()
export class ApiService extends Mixin(
  (EventEmitter as { new(): MiraiEventEmitter }),
  AboutMixin,
  AccountMixin,
  CacheMixin,
  FileMixin,
  GroupMixin,
  InfoMixin,
  RespondMixin,
  SendMixin
) implements OnModuleInit, OnApplicationShutdown {
  wsClient!: ws;
  sessionKey!: any;
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) protected readonly logger: Logger,
    @Inject(BotConfig.KEY) private readonly config: ConfigInterface,
    private readonly httpService: HttpService,
  ) {
    super();
    this.logger = logger.child({context: this.constructor.name});
  }
  async onModuleInit() {
    this.wsClient = new ws(`ws://${this.config.api.host}:${this.config.api.port}/all?verifyKey=${this.config.api.authKey}`);
    this.wsClient.on("message", (message: string) => {
      const parsedMessage: WebSocketResponse = JSON.parse(message);
      if(isMiraiMessage(parsedMessage.data)) {
        log(parsedMessage.data.messageChain);
        this.emit("ChatMessage", parsedMessage.data);
        this.emit(parsedMessage.data.type as any, parsedMessage.data);
      }
      else if(isMiraiEvent(parsedMessage.data)) {
        this.emit(parsedMessage.data.type as any, parsedMessage.data);
      } else {
        this.emit(`syncId${parsedMessage.syncId}`, parsedMessage.data);
      }
    });
    await new Promise((res) => this.wsClient.on("open", res));
    console.log(await this.sendFriendMessage(1735439536, [{
      type: "Plain",
      text: "Hello, world!",
    }]));
    this.logger.info("Mirai-api-http client initialized");
  }
  async onApplicationShutdown() {
    this.wsClient.close();
    await new Promise((res) => this.wsClient.on("close", res));
    this.logger.info("Mirai-api-http client destroyed");
  }
  async execute<R = any, C = any>(command: string, content?: C, subCommand?: string): Promise<R> {
    return new Promise((resolve, reject) => {
      const syncId = nanoid();
      this.once(`syncId${syncId}`, (response: MiraiAPIResponse) => {
        if(response.code !== 0) {
          reject(new MiraiAPIError(response));
        } else {
          resolve(response.data|| response);
        }
      });
      this.wsClient.send(JSON.stringify({
        syncId,
        command,
        content: content || {},
        subCommand: subCommand || null,
      }));
    });
  }

  async send(msg: string | MessageChain, target: { group?: number; qq?: number }): Promise<void> {
    if(typeof msg === "string") {
      msg = [makeMessage({
        type: "Plain",
        text: msg,
      })];
    }
    if (isUndefined(target.group)) {
      if (isUndefined(target.qq)) {
        throw Error("Is shouldn't happen");
      } else {
        this.sendFriendMessage(target.qq, msg);
      }
    } else {
      if (isUndefined(target.qq)) {
        this.sendGroupMessage(target.group, msg);
      } else {
        this.sendTempMessage(target.qq, target.group, msg);
      }
    }
  }

  async reply(msg: string | MessageChain, source: MiraiChatMessage, explicit = false): Promise<void> {
    const group = (source.type === "GroupMessage" || source.type === "TempMessage") ? source.sender.group.id : undefined;
    const qq = !group || explicit ? source.sender.id : undefined;
    return this.send(msg, { qq, group });
  }
}
