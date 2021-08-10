import { Friend, Group, Member, Permission } from "./contact.interface";

export interface BaseEvent {
  type: string;
}
export interface BotOnlineEvent extends BaseEvent {
  type: "BotOnlineEvent";
  qq: number;
}
export interface BotOfflineEventActive extends BaseEvent {
  type: "BotOfflineEventActive";
  qq: number;
}
export interface BotOfflineEventForce extends BaseEvent {
  type: "BotOfflineEventForce";
  qq: number;
}
export interface BotOfflineEventDropped extends BaseEvent {
  type: "BotOfflineEventDropped";
  qq: number;
}
export interface BotReloginEvent extends BaseEvent {
  type: "BotReloginEvent";
  qq: number;
}
export interface FriendInputStatusChangedEvent extends BaseEvent {
  type: "FriendInputStatusChangedEvent";
  friend: Friend;
  inputting: boolean;
}
export interface FriendNickChangedEvent extends BaseEvent {
  type: "FriendNickChangedEvent";
  friend: Friend;
  from: string;
  to: string;
}
export interface BotGroupPermissionChangeEvent extends BaseEvent {
  type: "BotGroupPermissionChangeEvent";
  origin: Permission;
  current: Permission;
  group: Group;
}
export interface BotMuteEvent extends BaseEvent {
  type: "BotMuteEvent";
  durationSeconds: number;
  operator: Member;
}
export interface BotUnmuteEvent extends BaseEvent {
  type: "BotUnmuteEvent";
  operator: Member;
}
export interface BotJoinGroupEvent extends BaseEvent {
  type: "BotJoinGroupEvent";
  group: Group;
}
export interface BotLeaveEventActive extends BaseEvent {
  type: "BotLeaveEventActive";
  group: Group;
}
export interface BotLeaveEventKick extends BaseEvent {
  type: "BotLeaveEventKick";
  group: Group;
}
export interface GroupRecallEvent extends BaseEvent {
  type: "GroupRecallEvent";
  authorId: number;
  messageId: number;
  time: number;
  group: Group;
  operator: Member | null;
}
export interface FriendRecallEvent extends BaseEvent {
  type: "FriendRecallEvent";
  authorId: number;
  messageId: number;
  time: number;
  operator: number;
}
export interface GroupNameChangeEvent extends BaseEvent {
  type: "GroupNameChangeEvent";
  origin: string;
  current: string;
  group: Group;
  operator: Member | null;
}
export interface GroupEntranceAnnouncementChangeEvent extends BaseEvent {
  type: "GroupEntranceAnnouncementChangeEvent";
  origin: string;
  current: string;
  group: Group;
  operator: Member | null;
}
export interface GroupMuteAllEvent extends BaseEvent {
  type: "GroupMuteAllEvent";
  origin: boolean;
  current: boolean;
  group: Group;
  operator: Member | null;
}
export interface GroupAllowAnonymousChatEvent extends BaseEvent {
  type: "GroupAllowAnonymousChatEvent";
  origin: boolean;
  current: boolean;
  group: Group;
  operator: Member | null;
}
export interface GroupAllowConfessTalkEvent extends BaseEvent {
  type: "GroupAllowConfessTalkEvent";
  origin: boolean;
  current: boolean;
  group: Member;
  isByBot: boolean;
}
export interface GroupAllowMemberInviteEvent extends BaseEvent {
  type: "GroupAllowMemberInviteEvent";
  origin: boolean;
  current: boolean;
  group: Group;
  operator: Member | null;
}
export interface MemberJoinEvent extends BaseEvent {
  type: "MemberJoinEvent";
  member: Member;
}
export interface MemberLeaveEventKick extends BaseEvent {
  type: "MemberLeaveEventKick";
  member: Member;
  operator: Member | null;
}
export interface MemberLeaveEventQuit extends BaseEvent {
  type: "MemberLeaveEventQuit";
  member: Member;
}
export interface MemberCardChangeEvent extends BaseEvent {
  type: "MemberCardChangeEvent";
  origin: string;
  current: string;
  member: Member;
  operator: Member | null;
}
export interface MemberSpecialTitleChangeEvent extends BaseEvent {
  type: "MemberSpecialTitleChangeEvent";
  origin: string;
  current: string;
  member: Member;
}export interface MemberPermissionChangeEvent extends BaseEvent {
  type: "MemberPermissionChangeEvent";
  origin: Permission;
  current: Permission;
  member: Member;
}
export interface MemberMuteEvent extends BaseEvent {
  type: "MemberMuteEvent";
  durationSeconds: number;
  member: Member;
  operator: Member | null;
}
export interface MemberUnmuteEvent extends BaseEvent {
  type: "MemberUnmuteEvent";
  member: Member;
  operator: Member | null;
}
export interface MemberHonorChangeEvent extends BaseEvent {
  type: "MemberHonorChangeEvent";
  member: Member;
  action: "achieve" | "lose" | "gain";
  honor: string;
}
export interface NewFriendRequestEvent extends BaseEvent  {
  type: "NewFriendRequestEvent";
  eventId: number;
  fromId: number;
  groupId: number;
  nick: string;
  message: string;
}
export enum NewFriendRequestEventResponse {
  allow = 0,
  deny = 1,
  deny_blacklist = 2,
}
export interface MemberJoinRequestEvent extends BaseEvent {
  type: "MemberJoinRequestEvent";
  eventId: number;
  fromId: number;  groupId: number;
  groupName: string;
  nick: string;
  message: string;
}
export enum MemberJoinRequestEventResponse {
  allow = 0,
  deny = 1,
  ignore = 2,
  deny_blacklist = 3,
  ignore_blacklist = 4,
}
export interface BotInvitedJoinGroupRequestEvent extends BaseEvent {
  type: "BotInvitedJoinGroupRequestEvent";
  eventId: number;
  fromId: number;
  groupId: number;
  groupName: string;
  nick: string;
  message: string;
}
export enum BotInvitedJoinGroupRequestEventResponse {
  allow = 0,
  deny = 1,
}

export interface NudgeEvent extends BaseEvent {
  type: "NudgeEvent";
  fromId: number;
  target: number;
  subject: {
    id: number;
    kind: "Group" | "Friend";
  };
  action: string;
  suffix: string;
}
export type MiraiEvent =
  | BotOnlineEvent
  | BotOfflineEventActive
  | BotOfflineEventForce
  | BotOfflineEventDropped
  | BotReloginEvent
  | FriendInputStatusChangedEvent
  | FriendNickChangedEvent
  | BotGroupPermissionChangeEvent
  | BotMuteEvent
  | BotUnmuteEvent
  | BotJoinGroupEvent
  | BotLeaveEventActive
  | BotLeaveEventKick
  | GroupRecallEvent
  | FriendRecallEvent
  | GroupNameChangeEvent
  | GroupEntranceAnnouncementChangeEvent
  | GroupMuteAllEvent
  | GroupAllowAnonymousChatEvent
  | GroupAllowConfessTalkEvent
  | GroupAllowMemberInviteEvent
  | MemberJoinEvent
  | MemberLeaveEventKick
  | MemberLeaveEventQuit
  | MemberCardChangeEvent
  | MemberSpecialTitleChangeEvent
  | MemberPermissionChangeEvent
  | MemberMuteEvent
  | MemberUnmuteEvent
  | MemberHonorChangeEvent
  | NewFriendRequestEvent
  | MemberJoinRequestEvent
  | BotInvitedJoinGroupRequestEvent
  | NudgeEvent;

export type EventType = MiraiEvent["type"];

export function isMiraiEvent(data: any): data is MiraiEvent {
  return [
    "BotOnlineEvent", 
    "BotOfflineEventActive",
    "BotOfflineEventForce",
    "BotOfflineEventDropped",
    "BotReloginEvent",
    "FriendInputStatusChangedEvent",
    "FriendNickChangedEvent",
    "GroupRecallEvent",
    "FriendRecallEvent",
    "BotGroupPermissionChangeEvent",
    "BotMuteEvent",
    "BotUnmuteEvent",
    "BotJoinGroupEvent",
    "BotLeaveEventActive",
    "BotLeaveEventKick",
    "GroupNameChangeEvent",
    "GroupEntranceAnnouncementChangeEvent",
    "GroupMuteAllEvent",
    "GroupAllowAnonymousChatEvent",
    "GroupAllowConfessTalkEvent",
    "GroupAllowMemberInviteEvent",
    "MemberJoinEvent",
    "MemberLeaveEventKick",
    "MemberLeaveEventQuit",
    "MemberCardChangeEvent",
    "MemberSpecialTitleChangeEvent",
    "MemberPermissionChangeEvent",
    "MemberMuteEvent",
    "MemberUnmuteEvent",
    "MemberHonorChangeEvent",
    "NewFriendRequestEvent",
    "MemberJoinRequestEvent",
    "BotInvitedJoinGroupRequestEvent",
    "NudgeEvent",
  ].includes(data.type);
}
