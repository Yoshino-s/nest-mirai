import { BotInvitedJoinGroupRequestEvent, BotInvitedJoinGroupRequestEventResponse, MemberJoinRequestEvent, MemberJoinRequestEventResponse, NewFriendRequestEvent, NewFriendRequestEventResponse } from "../interface/event.interface";

import { BaseMixin } from "./base.mixin";


export class RespondMixin extends BaseMixin {
  
  async responseNewFriendRequestEvent(event: NewFriendRequestEvent, operate: NewFriendRequestEventResponse, message = "") {
    await this.execute("resp_newFriendRequestEvent", {
      eventId: event.eventId,
      fromId: event.fromId,
      groupId: event.groupId,
      operate,
      message,
    });
  }
  async responseMemberJoinRequestEvent(event: MemberJoinRequestEvent, operate: MemberJoinRequestEventResponse, message = "") {
    await this.execute("resp_memberJoinRequestEvent", {
      eventId: event.eventId,
      fromId: event.fromId,
      groupId: event.groupId,
      operate,
      message,
    });
  }
  async responseBotInvitedJoinGroupRequestEvent(event: BotInvitedJoinGroupRequestEvent, operate: BotInvitedJoinGroupRequestEventResponse, message = "") {
    await this.execute("resp_botInvitedJoinGroupRequestEvent", {
      eventId: event.eventId,
      fromId: event.fromId,
      groupId: event.groupId,
      operate,
      message,
    });
  }
}
