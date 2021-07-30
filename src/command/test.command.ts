import { HttpService, Inject, Injectable } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";

import { ApiService } from "../mirai/api.service";
import { MiraiCommand, MiraiCommandContext } from "../mirai/command.abstract";
import { Command } from "../mirai/mirai.decorator";

interface Session {
  time: number;
}
@Injectable()
@Command()
export class TestCommand extends MiraiCommand {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) protected readonly logger: Logger,
    private readonly apiService: ApiService,
    private readonly httpService: HttpService,
  ) {
    super(logger);
  }
  async trigger(context: MiraiCommandContext<Session>) {
    const a = context.message.arguments[0];
    let t = await context.session.get("time") ?? 0;
    if(a==="reset")
      t = 0;
    await context.session.set("time", t+1);
    return `count: ${t}`;
  }
}
