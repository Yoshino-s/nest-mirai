import { Inject, Injectable } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { makeMessage } from "src/mirai/interface/message.interface";
import { Logger } from "winston";

import { ApiService } from "../mirai/api.service";
import { MiraiCommand, MiraiCommandContext } from "../mirai/command.abstract";
import { Command } from "../mirai/mirai.decorator";



@Injectable()
@Command()
export class SetuCommand extends MiraiCommand {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) protected readonly logger: Logger,
    private readonly apiService: ApiService
  ) {
    super(logger);
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
