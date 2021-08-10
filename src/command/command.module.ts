import { HttpModule, Module } from "@nestjs/common";

import { NeteaseCommand } from "./netease.command";
import { SetuCommand } from "./setu.command";
import { TestCommand } from "./test.command";

@Module({
  providers: [
    NeteaseCommand,
    SetuCommand,
    TestCommand,
  ],
  imports: [
    HttpModule,
  ],
})
export class CommandModule { }
