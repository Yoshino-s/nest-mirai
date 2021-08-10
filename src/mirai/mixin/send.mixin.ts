import { ReadStream } from "fs";

import { MessageChain } from "../interface/message.interface";

import { BaseMixin } from "./base.mixin";

export class SendMixin extends BaseMixin {
  async sendFriendMessage(qq: number, messageChain: MessageChain, quote?: number) {
    return (await this.execute<{ messageId: number; }>("sendFriendMessage", {
      qq,
      quote,
      messageChain,
    })).messageId;
  }
  async sendTempMessage(qq: number, group: number, messageChain: MessageChain, quote?: number) {
    return (await this.execute<{ messageId: number; }>("sendTempMessage", {
      qq, group,
      quote,
      messageChain,
    })).messageId;
  }
  async sendGroupMessage(group: number, messageChain: MessageChain, quote?: number) {
    return (await this.execute<{ messageId: number; }>("sendGroupMessage", {
      group,
      quote,
      messageChain,
    })).messageId;
  }
  async sendNudge(qq: number, group?: number) {
    await this.execute("sendNudge", {
      target: qq,
      subject: group || qq,
      kind: group ? "Group" : "Friend",
    });
  }
  async recall(target: number) {
    await this.execute("recall", {
      target,
    });
  }

  sendImageMessage(urls: string[], qq?: number, group?: number,): Promise<string[]> {
    return this.execute<string[]>("sendImageMessage", {
      qq, group,
      urls,
    });
  }

  /**
   * @note: not implemented
   * */
  async uploadImage(type: "friend" | "group" | "temp", img: Buffer | string | ReadStream): Promise<{ imageId: string, url: string, path: string }> {
    throw Error("Not implement.");
  }

  /**
   * @note: not implemented
   * */
  async uploadVoice(type: "group", voice: Buffer | string | ReadStream): Promise<{ voiceId: string, url: string, path: string }> {
    throw Error("Not implement.");
  }
}
