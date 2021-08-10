import type { MiraiChatMessage } from "../interface/message.interface";

import { BaseMixin } from "./base.mixin";

export class CacheMixin extends BaseMixin {
  async messageFromId(id: number) {
    const v = await this.execute<{ data: MiraiChatMessage }>("messageFromId", {
      id,
    });
    return v;
  }
}
