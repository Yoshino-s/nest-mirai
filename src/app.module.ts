import { Module } from "@nestjs/common";
import { WinstonModule } from "nest-winston";
import { format, transports } from "winston";

import { AppController } from "./app.controller";
import {nestLikeConsoleFormat} from "./app.log";
import { AppService } from "./app.service";
import { BuiltinCommandModule } from "./builtin-command/builtin-command.module";
import { CommandModule } from "./command/command.module";
import { ConfigModule } from "./config/config.module";
import { MiraiModule } from "./mirai/mirai.module";

@Module({
  imports: [
    ConfigModule,
    WinstonModule.forRoot({
      transports: [
        new transports.Console({
          format: format.combine(format.timestamp(),nestLikeConsoleFormat("Nest")),
          level: "debug",
        }),
      ],
    }),
    MiraiModule.register(),
    BuiltinCommandModule, CommandModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
