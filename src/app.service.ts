import { Injectable, OnModuleInit } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";

import { MiraiService } from "./mirai/mirai.service";

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly miraiService: MiraiService) { }
  onModuleInit() {
    // const container = (this.moduleRef as any).container as NestContainer;
    // console.log(Array.from(container.getModules().values()).map(f=>f.providers));
  }
}
