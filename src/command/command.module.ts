import { HttpModule, Module } from "@nestjs/common";

import { CTFTimeCommand } from "./ctftime.command";
import { MeowCommand } from "./meow.command";
import { NeteaseCommand } from "./netease.command";
import { SetuCommand } from "./setu.command";
import { TestCommand } from "./test.command";
import { XiaoaiCommand } from "./xiaoai.command";
import { ZhihuCommand } from "./zhihu.command";

@Module({
  providers: [
    NeteaseCommand, 
    XiaoaiCommand,
    ZhihuCommand,
    MeowCommand,
    SetuCommand,
    CTFTimeCommand,
    TestCommand,
  ],
  imports: [
    HttpModule,
  ],
})
export class CommandModule { }
