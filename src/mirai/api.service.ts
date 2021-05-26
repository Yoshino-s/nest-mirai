import { EventEmitter } from "events";
import { ReadStream } from "fs";

import { HttpService, Inject, Injectable, OnApplicationShutdown, OnModuleInit } from "@nestjs/common";
import { AxiosRequestConfig } from "axios";
import FormData from "form-data";
import { isUndefined } from "lodash";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { ConfigInterface } from "src/config/config.interface";
import { BotConfig } from "src/config/configuration";
import { Logger } from "winston";
import ws from "ws";

import { MiraiAPIError, MiraiAPIResponse, MiraiSessionConfig, MiraiEventEmitter, GroupConfig, GroupMemberInfo } from "./api.interface";
import { log, processMiraiAPIResponse } from "./api.utils";
import { BotInvitedJoinGroupRequestEvent, BotInvitedJoinGroupRequestEventResponse, MemberJoinRequestEvent, MemberJoinRequestEventResponse, MiraiEvent, NewFriendRequestEvent, NewFriendRequestEventResponse } from "./event.interface";
import { Friend, Group, makeMessage, Member, MessageChain, MiraiChatMessage, Permission } from "./message.interface";

@Injectable()
export class ApiService extends (EventEmitter as { new(): MiraiEventEmitter }) implements OnModuleInit, OnApplicationShutdown {
  eventWsClient!: ws;
  messageWsClient!: ws;
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) protected readonly logger: Logger,
    @Inject(BotConfig.KEY) private readonly config: ConfigInterface,
    private readonly httpService: HttpService,
  ) {
    super();
    this.logger = logger.child({context: this.constructor.name});
  }
  async onModuleInit() {
    this.sessionKey = await this.auth();
    await this.verify();
    this.logger.info(`Session key: ${this.sessionKey}`);
    await this.setConfig({
      enableWebsocket: true,
    });
    this.eventWsClient = new ws(`ws://${this.config.api.host}:${this.config.api.port}/event?sessionKey=${encodeURIComponent(this.sessionKey)}`);
    this.messageWsClient = new ws(`ws://${this.config.api.host}:${this.config.api.port}/message?sessionKey=${encodeURIComponent(this.sessionKey)}`);
    this.eventWsClient.on("message", (data: any) => {
      const event: MiraiEvent = JSON.parse(data);
      this.logger.verbose(`Event: ${event.type}`);
      this.emit(event.type as any, event);
    });
    this.messageWsClient.on("message", (data: any) => {
      const message: MiraiChatMessage = JSON.parse(data);
      if (message.type === "FriendMessage") {
        this.logger.verbose(`${message.type}[ ${message.sender.nickname}(${message.sender.id}) ]: ${log(message.messageChain)}`);
      } else {
        this.logger.verbose(`${message.type}[ ${message.sender.memberName}(${message.sender.id}) ${message.sender.permission} of ${message.sender.group.name}(${message.sender.group.id}) ]: ${log(message.messageChain)}`);
      }
      this.emit(message.type as any, message);
      this.emit("ChatMessage", message);
    });
    this.logger.info("Mirai-api-http client initialized");

  }
  async onApplicationShutdown() {
    this.eventWsClient.close();
    this.messageWsClient.close();
    await Promise.all([
      new Promise((res) => this.eventWsClient.on("close", res)),
      new Promise((res) => this.eventWsClient.on("close", res)),
    ]);
    await this.release();
    this.logger.info("Mirai-api-http client destroyed");
  }
  private _sessionKey?: string;

  get sessionKey(): string {
    if (this._sessionKey) {
      return this._sessionKey;
    } else {
      throw new MiraiAPIError("Must initialize before using sessionKey.");
    }
  }

  set sessionKey(value: string) {
    this._sessionKey = value;
  }
  async get<T>(url: string, config?: AxiosRequestConfig) {
    return await processMiraiAPIResponse(this.httpService.get<MiraiAPIResponse<T>>(url, config).toPromise());
  }
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return await processMiraiAPIResponse(this.httpService.post<MiraiAPIResponse<T>>(url, data, config).toPromise());
  }
  async about() {
    const v = await this.get<{ data: { version: string; }; }>("/about");
    return v.data;
  }
  /**
   * @returns sessionKey
   */
  async auth() {
    const v = await this.post<{ session: string; }>("/auth", {
      authKey: this.config.api.authKey,
    });
    return v.session;
  }
  async verify() {
    const v = await this.post<{ msg: string; }>("/verify", {
      sessionKey: this.sessionKey,
      qq: this.config.qq,
    });
    return v.msg;
  }
  async release() {
    const v = await this.post<{ msg: string; }>("/release", {
      sessionKey: this.sessionKey,
      qq: this.config.qq,
    });
    return v.msg;
  }

  async sendFriendMessage(qq: number, messageChain: MessageChain, quote?: number) {
    const v = await this.post<{ messageId: number; }>("/sendFriendMessage", {
      sessionKey: this.sessionKey,
      qq,
      quote,
      messageChain,
    });
    return v.messageId;
  }

  async sendTempMessage(qq: number, group: number, messageChain: MessageChain, quote?: number) {
    const v = await this.post<{ messageId: number; }>("/sendTempMessage", {
      sessionKey: this.sessionKey,
      qq, group,
      quote,
      messageChain,
    });
    return v.messageId;
  }

  async sendGroupMessage(group: number, messageChain: MessageChain, quote?: number) {
    const v = await this.post<{ messageId: number; }>("/sendGroupMessage", {
      sessionKey: this.sessionKey,
      group,
      quote,
      messageChain,
    });
    return v.messageId;
  }

  async sendNudge(qq: number, group?: number) {
    const v = await this.post<{ msg: string }>("/sendNudge", {
      sessionKey: this.sessionKey,
      target: qq,
      subject: group || qq,
      kind: group ? "Group" : "Friend",
    });
    return v;
  }

  async setEssence(target: number) {
    const v = await this.post<{ msg: string }>("/setEssence", {
      sessionKey: this.sessionKey,
      target: target,
    });
    return v;
  }

  async recall(target: number) {
    const v = await this.post<{ msg: string; }>("/recall", {
      sessionKey: this.sessionKey,
      target,
    });
    return v.msg;
  }

  async mute(qq: number, group: number, time: number) {
    const v = this.post<{ msg: string }>("/mute", {
      sessionKey: this.sessionKey,
      target: group,
      memberId: qq,
      time,
    });
    return v;
  }

  async unmute(qq: number, group: number) {
    const v = this.post<{ msg: string }>("/unmute", {
      sessionKey: this.sessionKey,
      target: group,
      memberId: qq,
    });
    return v;
  }

  async kick(qq: number, group: number, msg: string) {
    const v = this.post<{ msg: string }>("/kick", {
      sessionKey: this.sessionKey,
      target: group,
      memberId: qq,
      msg,
    });
    return v;
  }

  async quit(group: number) {
    const v = this.post<{ msg: string }>("/quit", {
      sessionKey: this.sessionKey,
      target: group,
    });
    return v;
  }

  async muteAll(group: number) {
    const v = this.post<{ msg: string }>("/muteAll", {
      sessionKey: this.sessionKey,
      target: group,
    });
    return v;
  }

  async unmuteAll(group: number) {
    const v = this.post<{ msg: string }>("/muteAll", {
      sessionKey: this.sessionKey,
      target: group,
    });
    return v;
  }

  async getGroupConfig(group: number) {
    const v = this.get<GroupConfig & { code: never }>("/groupConfig", {
      params: {
        sessionKey: this.sessionKey,
        target: group,
      },
    });
    return v;
  }

  async setGroupConfig(group: number, config: GroupConfig) {
    const v = this.post<{ msg: string }>("/groupConfig", {
      sessionKey: this.sessionKey,
      target: group,
      config,
    });
    return v;
  }

  async getMemberInfo(qq: number, group: number) {
    const v = this.get<GroupMemberInfo & { code: never }>("/memberInfo", {
      params: {
        sessionKey: this.sessionKey,
        target: group,
        memberId: qq,
      },
    });
    return v;
  }

  async setMemberInfo(qq: number, group: number, info: GroupMemberInfo & {nickname: never}) {
    const v = this.post<{ msg: string }>("/memberInfo", {
      sessionKey: this.sessionKey,
      target: group,
      memberId: qq,
      info,
    });
    return v;
  }

  async sendImageMessage(urls: string[], qq?: number, group?: number,): Promise<string[]> {
    const v = await this.post<string[] & { code: never }>("/sendImageMessage", {
      sessionKey: this.sessionKey,
      qq, group,
      urls,
    });
    return v;
  }

  async uploadImage(type: "friend" | "group" | "temp", img: Buffer | string | ReadStream): Promise<{ imageId: string, url: string, path: string }> {
    const formData = new FormData();
    formData.append("session", this.sessionKey);
    formData.append("type", type);
    formData.append("img", img);
    const v = await this.post<{ imageId: string, url: string, path: string } & { code: never }>("/uploadImage", formData, {
      headers: formData.getHeaders(),
    });
    return v;
  }

  async uploadFileAndSend(type: "Group", file: Buffer | string | ReadStream, path: string): Promise<{ id: string}> {
    const formData = new FormData();
    formData.append("session", this.sessionKey);
    formData.append("type", type);
    formData.append("path", path);
    formData.append("file", file);
    const v = await this.post<{ id: string, msg: string}>("/uploadFileAndSend", formData, {
      headers: formData.getHeaders(),
    });
    return v;
  }

  async uploadVoice(type: "group", voice: Buffer | string | ReadStream): Promise<{ voiceId: string, url: string, path: string }> {
    const formData = new FormData();
    formData.append("session", this.sessionKey);
    formData.append("type", type);
    formData.append("voice", voice);
    const v = await this.post<{ voiceId: string, url: string, path: string } & { code: never }>("/uploadVoice", formData, {
      headers: formData.getHeaders(),
    });
    return v;
  }

  async friendList() {
    const v = await this.get<Friend[] & { code: never }>("/friendList", {
      params: {
        sessionKet: this.sessionKey,
      },
    });
    return v;
  }

  async groupList() {
    const v = await this.get<Group[] & { code: never }>("/groupList", {
      params: {
        sessionKet: this.sessionKey,
      },
    });
    return v;
  }

  async memberList() {
    const v = await this.get<Member[] & { code: never }>("/memberList", {
      params: {
        sessionKet: this.sessionKey,
      },
    });
    return v;
  }

  async getConfig(): Promise<MiraiSessionConfig> {
    return this.get<MiraiSessionConfig>("/config", {
      params: {
        sessionKey: this.sessionKey,
      },
    });
  }

  async setConfig(config: Partial<MiraiSessionConfig>) {
    await this.post("/config", {
      sessionKey: this.sessionKey,
      ...config,
    });
  }

  async messageFromId(id: number) {
    const v = await this.get<{ data: MiraiChatMessage }>("/messageFromId", {
      params: {
        sessionKey: this.sessionKey,
        id,
      },
    });
    return v;
  }

  async responseNewFriendRequestEvent(event: NewFriendRequestEvent, operate: NewFriendRequestEventResponse, message = "") {
    const v = await this.post<never>("/resp/newFriendRequestEvent", {
      sessionKey: this.sessionKey,
      eventId: event.eventId,
      fromId: event.fromId,
      groupId: event.groupId,
      operate,
      message,
    });
    return v;
  }
  async responseMemberJoinRequestEvent(event: MemberJoinRequestEvent, operate: MemberJoinRequestEventResponse, message = "") {
    const v = await this.post<never>("/resp/memberJoinRequestEvent", {
      sessionKey: this.sessionKey,
      eventId: event.eventId,
      fromId: event.fromId,
      groupId: event.groupId,
      operate,
      message,
    });
    return v;
  }
  async responseBotInvitedJoinGroupRequestEvent(event: BotInvitedJoinGroupRequestEvent, operate: BotInvitedJoinGroupRequestEventResponse, message = "") {
    const v = await this.post<never>("/resp/botInvitedJoinGroupRequestEvent", {
      sessionKey: this.sessionKey,
      eventId: event.eventId,
      fromId: event.fromId,
      groupId: event.groupId,
      operate,
      message,
    });
    return v;
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
    const group = source.type !== "FriendMessage" ? source.sender.group.id : undefined;
    const qq = !group || explicit ? source.sender.id : undefined;
    return this.send(msg, { qq, group });
  }
}
