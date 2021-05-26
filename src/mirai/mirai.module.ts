import { DynamicModule, Global, HttpModule, Module } from "@nestjs/common";
import { ConfigInterface } from "src/config/config.interface";
import { BotConfig } from "src/config/configuration";

import { ApiService } from "./api.service";
import { MiraiService } from "./mirai.service";

@Global()
@Module({})
export class MiraiModule {
  static register(): DynamicModule {
    return {
      global: true,
      module: MiraiModule,
      imports: [
        HttpModule.registerAsync({
          useFactory: (config: ConfigInterface) => ({
            baseURL: `http://${config.api.host}:${config.api.port}`,
          }),
          inject: [BotConfig.KEY],
        }),
      ],
      providers: [MiraiService, ApiService],
      exports: [
        MiraiService, ApiService,
      ],
    };
  }
}

