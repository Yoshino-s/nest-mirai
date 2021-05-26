import { HttpService, Inject, Injectable } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { makeMessage } from "src/mirai/message.interface";
import { ParsedCommand } from "src/mirai/mirai.service";
import { Logger } from "winston";

import { ApiService } from "../mirai/api.service";
import { MiraiCommand } from "../mirai/command.abstract";
import { Command } from "../mirai/mirai.decorator";


@Injectable()
@Command()
export class XiaoaiCommand extends MiraiCommand {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) protected readonly logger: Logger,
    private readonly apiService: ApiService,
    private readonly httpService: HttpService,
  ) {
    super(logger);
  }
  async trigger(message: ParsedCommand) {
    const question = message.arguments[0];
    if(!question) {
      return `Usage: ${this.command} question`;
    }
    const mp3 = (await this.httpService.get("http://jinapi.52jintia.xyz/api/xatx.php", {
      params: {
        msg: question,
      },
    }).toPromise()).data.mp3;
    if(!mp3) {
      return [
        makeMessage({
          type: "Plain",
          text: "小爱对于这个问题无语了。",
        }),
      ];
    }
    return [makeMessage({
      type: "Voice",
      url: mp3,
    })];
  }
}
