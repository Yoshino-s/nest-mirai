import { Global, Module } from "@nestjs/common";
import { ConfigModule as ConfigModule_ } from "@nestjs/config";

import {BotConfig, RedisConfig, SessionConfig, yamlConfig} from "./configuration";

@Global()
@Module({
  imports: [
    ConfigModule_.forRoot({
      load: [BotConfig, SessionConfig, RedisConfig, () => yamlConfig],
      isGlobal: true,
    }),
  ],
})
export class ConfigModule {}
