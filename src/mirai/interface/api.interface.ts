import { EventEmitter } from "events";

import StrictEventEmitter from "strict-event-emitter-types";

import { MiraiEvent } from "./event.interface";
import { MiraiChatMessage } from "./message.interface";

export interface WebSocketResponse<T = any> {
  syncId: string;
  data: T;
}


export type MiraiAPIResponse<T=any> = {
  code: MiraiAPIStatus;
  msg: string;
  data: T;
};

export enum MiraiAPIStatus{
  SUCCESS = 0,
  AUTH_KEY_FAIL = 1,
  NO_BOT = 2,
  ILLEGAL_SESSION = 3,
  NOT_VERIFY_SESSION = 4,
  NO_ELEMENT = 5,
  NO_OPERATION_SUPPORT = 6,
  PERMISSION_DENIED = 10,
  BOT_MUTED = 20,
  MESSAGE_TOO_LONG = 30,
  BAD_REQUEST = 400,
  INTERNAL_ERROR = 500,
}

export function getMessageFromStatusCode(code: MiraiAPIStatus) {
  let msg = "";
  switch (code) {
    case 0:
      msg = "正常";
      break;
    case 1:
      msg = "错误的 auth key";
      break;
    case 2:
      msg = "指定的 Bot 不存在";
      break;
    case 3:
      msg = "Session 失效或不存在";
      break;
    case 4:
      msg = "Session 未认证(未激活)";
      break;
    case 5:
      msg = "发送消息目标不存在(指定对象不存在)";
      break;
    case 6:
      msg = "指定文件不存在，出现于发送本地图片";
      break;
    case 10:
      msg = "无操作权限，指 Bot 没有对应操作的权限";
      break;
    case 20:
      msg = "Bot 被禁言，指 Bot 当前无法向指定群发送消息";
      break;
    case 30:
      msg = "消息过长";
      break;
    case 400:
      msg = "错误的访问，如参数错误等";
      break;
    case 500:
      msg = "服务器端错误的响应（mirai-console/mirai-api-http 背锅）";
      break;
    default:
      break;
  }
  return msg;
}

export class MiraiAPIError extends Error {
  constructor(resp: MiraiAPIResponse) {
    super(`[${resp.code}]${getMessageFromStatusCode(resp.code)}${resp.msg ? `(${resp.msg})` : ""}`);
  }
}

type Events = {
  [Key in MiraiEvent["type"]]: (event: Extract<MiraiEvent, { type: Key }>) => void;
} & {
  [Key in MiraiChatMessage["type"]]: (message: Extract<MiraiChatMessage, { type: Key }>) => void;
} & {
  ChatMessage: (message: MiraiChatMessage) => void;
} & {
  [K: string]: (data: MiraiAPIResponse) => void;
}

export type MiraiEventEmitter = StrictEventEmitter<EventEmitter, Events>;

export type GroupConfig = {
  name: string;
  announcement: string;
  confessTalk: boolean;
  allowMemberInvite: boolean;
  autoApprove: boolean;
  anonymousChat: boolean;
};

export type GroupMemberInfo = {
  name: string;
  nick: string;
  specialTitle: string;
};

export type UserProfile = {
  nickname: string,
  email: string,
  age: number,
  level: number,
  sign: string;
  sex: string;
};
