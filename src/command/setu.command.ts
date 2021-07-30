import { Inject, Injectable } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { makeMessage } from "src/mirai/message.interface";
import { Logger } from "winston";

import { ApiService } from "../mirai/api.service";
import { MiraiCommand, MiraiCommandContext, MiraiCommandOnCommandRegister } from "../mirai/command.abstract";
import { Command } from "../mirai/mirai.decorator";



@Injectable()
@Command()
export class SetuCommand extends MiraiCommand implements MiraiCommandOnCommandRegister {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) protected readonly logger: Logger,
    private readonly apiService: ApiService
  ) {
    super(logger);
  }
  onCommandRegister() {
    this.apiService.on("GroupRecallEvent", async (e) => {
      const msg = await this.apiService.messageFromId(e.messageId);
      this.apiService.reply([
        makeMessage({type: "Plain", text: `${e.operator?.memberName} 撤回了一条消息`}),
        ...msg.data.messageChain,
      ], msg.data);
    });
  }
  async trigger(context: MiraiCommandContext) {
    const key = context.message.arguments[0] || "day";
    return [
      makeMessage({
        type: "Image",
        url: "https://x-pixiv.dokku.yoshino-s.online/random?mode="+key,
      }),
    ];
  }
}
