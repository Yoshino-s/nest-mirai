import { HttpService, Inject, Injectable } from "@nestjs/common";
import * as netease from "NeteaseCloudMusicApi";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { makeMessage } from "src/mirai/message.interface";
import { ParsedCommand } from "src/mirai/mirai.service";
import { Logger } from "winston";

import { ApiService } from "../mirai/api.service";
import { MiraiCommand } from "../mirai/command.abstract";
import { Command } from "../mirai/mirai.decorator";


@Injectable()
@Command()
export class NeteaseCommand extends MiraiCommand {
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
    const o = message.arguments[1];
    const offset = parseInt(o) || 0;
    const resp = await netease.search({keywords: keyword});
    let song = (resp.body.result as any).songs[offset].id;
    song = ((await netease.song_detail({ids: song.toString()})).body.songs as any)[0];
    return [makeMessage({
      type: "MusicShare", 
      kind: "NeteaseCloudMusic",
      title: song.name,
      summary: song.ar.map((v: any)=>v.name).join(",") || "",
      jumpUrl: `http://music.163.com/song/${song.id}/`,
      pictureUrl: song.al.picUrl || "",
      musicUrl: `http://music.163.com/song/media/outer/url?id=${song.id}`,
    })];
  }
}
