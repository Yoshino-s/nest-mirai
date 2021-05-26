import { Module } from "@nestjs/common";

import { PermissionCommand } from "./permission.command";

@Module({
  providers: [PermissionCommand],
})
export class BuiltinCommandModule {}
