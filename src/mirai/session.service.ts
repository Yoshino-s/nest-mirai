import { Inject, Injectable } from "@nestjs/common";
import Redis from "ioredis";
import { merge } from "lodash";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { RedisConfigInterface, SessionConfigInterface } from "src/config/config.interface";
import { RedisConfig, SessionConfig } from "src/config/configuration";
import { Logger } from "winston";

import { MiraiChatMessage } from "./interface/message.interface";

export enum SESSION_MODE {
  CACHE,
  THROUGH,
}

interface MiraiSessionOption {
  readMode: SESSION_MODE;
  writeMode: SESSION_MODE;
  expire: number;
}

export class MiraiSession<M = any> {
  readonly cache: Map<keyof M, M[keyof M]> = new Map();
  constructor(
    readonly _get: (key: string) => Promise<string|null>,
    readonly _set: (key: string, value: string, expire: number) => Promise<any>,
    readonly options: MiraiSessionOption,
  ) {}
  async get<K extends keyof M & string>(key: K, options?:Partial<MiraiSessionOption>): Promise<M[K]|undefined> {
    const {readMode} = merge({}, this.options, options);
    let value: any = this.cache.get(key);
    if(readMode===SESSION_MODE.THROUGH || !value) {
      value = await this._get(key) ?? undefined;
      if(value) {
        value = JSON.parse(value);
        this.cache.set(key, value);
      }
    }
    return value;
  }
  async set<K extends keyof M & string>(key: K, value: M[K], options?:Partial<MiraiSessionOption>) {
    const {writeMode, expire} = merge({}, this.options, options);
    const v = JSON.stringify(value);
    this.cache.set(key, value);
    if(writeMode===SESSION_MODE.THROUGH) {
      await this._set(key, v, expire);
    }
  }
}

@Injectable()
export default class SessionService {
  redis: Redis.Redis;
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @Inject(RedisConfig.KEY) readonly redisConfig: RedisConfigInterface,
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
      case "StrangerMessage":
        return `s${message.sender.id}`;
      case "OtherClientMessage":
        return `o${message.sender.id}`;
    }
  }
  getSession<M = any>(id: string, options?: Partial<MiraiSessionOption>): MiraiSession<M> {
    const _get = (key: string) => this.redis.get(`${id}:${key}`);
    const _set = (key: string, value: string, expire: number) => expire === -1 ? this.redis.set(`${id}:${key}`, value) : this.redis.setex(`${id}:${key}`, expire, value);
    return new MiraiSession<M>(_get, _set, merge({}, {
      readMode: SESSION_MODE.THROUGH,
      writeMode: SESSION_MODE.THROUGH,
      expire: this.sessionConfig.expire,
    }, options));
  }
  async saveSession(id: string, session: MiraiSession) {
    if(session.options.writeMode===SESSION_MODE.CACHE)
      for(const k of session.cache) {
        await session._set(k[0] as any, k[1], session.options.expire);
      }
  }
}
