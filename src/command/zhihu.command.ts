import { HttpService, Inject, Injectable } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { ParsedCommand } from "src/mirai/mirai.service";
import { Logger } from "winston";

import { ApiService } from "../mirai/api.service";
import { MiraiCommand } from "../mirai/command.abstract";
import { Command } from "../mirai/mirai.decorator";


@Injectable()
@Command()
export class ZhihuCommand extends MiraiCommand {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) protected readonly logger: Logger,
    private readonly apiService: ApiService,
    private readonly httpService: HttpService,
  ) {
    super(logger);
  }
  async trigger(message: ParsedCommand) {
    const keyword = message.arguments[0];
    if(!keyword) {
      return `Usage: ${this.command} keyword`;
    }
    return `https://www.zhihu.com/search?q=${encodeURIComponent(keyword)}`;
  }
}