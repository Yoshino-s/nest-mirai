export type Permission = "OWNER" | "ADMINISTRATOR" | "MEMBER";
export interface Group {
  id: number;
  name: string;
  permission: Permission;
}
interface BaseUser {
  id: number;
}
export interface Friend extends BaseUser {
  nickname: string;
  remark: string;
}
export interface Member extends BaseUser {
  memberName: string;
  permission: Permission;
  group: Group;
}
export type User = Friend | Member;
interface BaseSingleMessage {
  type: string;
}
export interface Source extends BaseSingleMessage {
  type: "Source";
  id: number;
  time: number;
}
export interface Quote extends BaseSingleMessage {
  type: "Quote";
  id: number;
  groupId?: number;
  senderId?: number;
  targetId?: number;
  origin?: MessageChain;
}
export interface At extends BaseSingleMessage {
  type: "At";
  target: number;
  display: string;
}
export interface AtAll extends BaseSingleMessage {
  type: "AtAll";
}
export interface Face extends BaseSingleMessage {
  type: "Face";
  faceId: number;
  name: string;
}
export interface Plain extends BaseSingleMessage {
  type: "Plain";
  text: string;
}
export interface Image extends BaseSingleMessage {
  type: "Image";
  imageId?: string;
  url?: string;
  path?: string;
}
export interface FlashImage extends BaseSingleMessage {
  type: "FlashImage";
  imageId?: string;
  url?: string;
  path?: string;
}
export interface Voice extends BaseSingleMessage {
  type: "Voice";
  voiceId?: string;
  url?: string;
  path?: string;
}
export interface Xml extends BaseSingleMessage {
  type: "Xml";
  xml: string;
}

export interface Json extends BaseSingleMessage {
  type: "Json";
  json: string;
}
export interface App extends BaseSingleMessage {
  type: "App";
  content: string;
}

export interface MusicShare extends BaseSingleMessage {
  type: "MusicShare";
  kind: "NeteaseCloudMusic" | "QQMusic" | "MiguMusic";
  title: string;
  summary: string;
  jumpUrl: string;
  pictureUrl: string;
  musicUrl: string;
  brief?: string;
}

export enum Pokes {
  Poke = "Poke",
  ShowLove = "ShowLove",
  Like = "Like",
  Heartbroken = "Heartbroken",
  SixSixSix = "SixSixSix",
  FangDaZhao = "FangDaZhao",
}
export interface Poke extends BaseSingleMessage {
  type: "Poke";
  name: Pokes;
}
export interface Forward extends BaseSingleMessage {
  type: "Forward";
  title: string;
  brief: string;
  source: string;
  summary: string;
  nodeList: {
    senderId: number;
    time: number;
    senderName: string;
    messageChain: MessageChain;
  }[];
}
export interface File extends BaseSingleMessage {
  type: "File";
  id: string;
  internalId: number;
  name: string;
  size: number;
}
export type SingleMessage =
  | Source
  | Quote
  | At
  | AtAll
  | Face
  | Plain
  | Image
  | FlashImage
  | Voice
  | Xml
  | Json
  | App
  | MusicShare
  | Forward
  | File;
export type MessageChain = Array<SingleMessage>;

interface BaseChatMessage extends BaseSingleMessage {
  type: "GroupMessage" | "TempMessage" | "FriendMessage";
  messageChain: MessageChain & {
    0: Source;
  };
  sender: User;
}
export interface FriendMessage extends BaseChatMessage {
  type: "FriendMessage";
  sender: Friend;
}
export interface GroupMessage extends BaseChatMessage {
  type: "GroupMessage";
  sender: Member;
}
export interface TempMessage extends BaseChatMessage {
  type: "TempMessage";
  sender: Member;
}
export type MiraiChatMessage = GroupMessage | TempMessage | FriendMessage;

export function makeMessage<T extends SingleMessage>(msg: T): T {
  return msg;
}
