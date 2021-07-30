import { AxiosResponse } from "axios";
import chalk from "chalk";

import { MiraiAPIError, MiraiAPIResponse, MiraiAPIStatus } from "./api.interface";
import { MessageChain, SingleMessage } from "./message.interface";

export async function processMiraiAPIResponse<T>(resp: Promise<AxiosResponse<MiraiAPIResponse<T>>>) {
  let r: AxiosResponse<MiraiAPIResponse<T>>;
  try {
    r = await resp;
  } catch(e) {
    console.log(e);
    throw new MiraiAPIError(e.response?.data);
  }
  if (!Array.isArray(r.data) && r.data.code !== MiraiAPIStatus.SUCCESS) {
    console.log(r.data);
    throw new MiraiAPIError(r.data.code, r.config.data, JSON.stringify(r.data));
  } else {
    return r.data;
  }
}

export function plain(message: MessageChain) {
  return message.reduce((p, o) => p + (o.type==="Plain" ? o.text : ""), "");
}

const LOG_COLOR_MAP: {
  [K in SingleMessage["type"]]: [chalk.Chalk, (msg: Extract<SingleMessage, {type: K}>) => string]
} = {
  App: [chalk.gray, (msg) => `App(${msg.content})`],
  At: [chalk.yellow, (msg) => `@${msg.display}(${msg.target})`],
  AtAll: [chalk.yellow, () => "@all"],
  Face: [chalk.blue, (msg) => `Face(${msg.faceId})`],
  FlashImage: [chalk.redBright, (msg) => `FlashImage(${msg.imageId})`],
  Image: [chalk.redBright, (msg) => `Image(${msg.imageId})`],
  Json: [chalk.gray, (msg) => `App(${msg.json})`],
  Plain: [chalk.yellow, (msg) => msg.text],
  Quote: [chalk.gray, (msg) => `Quote(${msg.id})`],
  Source: [chalk.grey, (msg) => `(${msg.id};time:${msg.time})`],
  Voice: [chalk.redBright, (msg) => `Image(${msg.voiceId})`],
  Xml: [chalk.gray, (msg) => `Xml(${msg.xml})`],
  MusicShare: [chalk.gray, (msg) => `MusicShare(${msg.kind}:${msg.title},${msg.summary},${msg.musicUrl})`],
  Forward: [chalk.yellow, (msg) => `Forward(${msg.brief})`],
  File: [chalk.redBright, (msg) => `File(${msg.name})`],
};

export function log(message: MessageChain, noColor = false) {
  return message.reduce((res, message) => {
    if (!noColor) {
      res += LOG_COLOR_MAP[message.type][0](LOG_COLOR_MAP[message.type][1](message as any));
    } else {
      res += LOG_COLOR_MAP[message.type][1](message as any);
    }
    return res;
  }, "");
}

export function isAt(message: MessageChain, selfId: number): boolean {
  return message.some(v => v.type==="AtAll" || (v.type==="At" && v.target===selfId));
}
