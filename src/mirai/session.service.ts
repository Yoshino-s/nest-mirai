import { Inject, Injectable } from "@nestjs/common";
import { IsString } from "class-validator";
import Redis from "ioredis";
import { merge } from "lodash";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { RedisConfigInterface, SessionConfigInterface } from "src/config/config.interface";
import { SessionConfig } from "src/config/configuration";
import { Logger } from "winston";

import { MiraiChatMessage } from "./message.interface";

export enum SESSION_MODE {
  CACHE,
  THROUGH,
}

interface MiraiSessionOption {
  readMode: SESSION_MODE;
  writeMode: SESSION_MODE;
  expire: number;
}

export class MiraiSession {
  private cache: Map<string, string> = new Map();
  constructor(
    private readonly _get: (key: string) => Promise<string|null>,
    private readonly _set: (key: string, value: string|null) => Promise<void>,
    private readonly options: MiraiSessionOption,
  ) {}
  async get(key: string, mode?: SESSION_MODE) {
    const m = mode ?? this.options.readMode;
    let value = this.cache.get(key);
    if(m===SESSION_MODE.THROUGH || !value) {
      value = await this._get(key) ?? undefined;
      if(value)
        this.cache.set(key, value);
    }
    return value;
  }
  async set(key: string, value: string, mode?: SESSION_MODE, expire?: number) {

    this.cache.set(key, value);

  }
}

@Injectable()
export default class SessionService {
  redis: Redis.Redis;
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @Inject(SessionConfig.KEY) readonly redisConfig: RedisConfigInterface,
    @Inject(SessionConfig.KEY) readonly sessionConfig: SessionConfigInterface,
  ) {
    this.redis = new Redis({
      ...redisConfig,
      keyPrefix: redisConfig.prefix + sessionConfig.sessionPrefix,
    });
  }
  getSessionId(message: MiraiChatMessage) {
    switch(message.type) {
      case "FriendMessage":
        return `f${message.sender.id}`;
      case "GroupMessage":
        return `g${message.sender.group.id}-${message.sender.id}`;
      case "TempMessage":
        return `t${message.sender.group.id}-${message.sender.id}`;
    }
  }
  async getSession(id: string, readMode: SESSION_MODE = SESSION_MODE.CACHE, writeMode: SESSION_MODE = SESSION_MODE.CACHE): Promise<Record<string, string>> {
    let session = {};
    const sessionStr = await this.redis.get(id) || "";
    try {
      session = JSON.parse(sessionStr);
    } catch(e) {
      //
    }
    return new Proxy<Record<string, string>>({}, {
      get(target, p, receiver) {
        console.log(target, p, receiver);
        return Reflect.get(target, p, receiver);
      },
      set(target, p, v, receiver) {
        console.log(target, p, v, receiver);
        return Reflect.set(target, p, v, receiver);
      },
    });
  }
  async saveSession(session: Record<string, string>, id?: string) {
    //
  }
}
