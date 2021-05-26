import { Inject, Injectable } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { makeMessage } from "src/mirai/message.interface";
import { ParsedCommand } from "src/mirai/mirai.service";
import { Logger } from "winston";

import { ApiService } from "../mirai/api.service";
import { MiraiCommand } from "../mirai/command.abstract";
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
  trigger(message: ParsedCommand) {
    return [
      makeMessage({
        type: "Image",
        url: "https://x-pixiv.dokku.yoshino-s.online/random",
      }),
    ];
  }
}
