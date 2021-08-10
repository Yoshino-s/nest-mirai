import { UserProfile } from "../interface/api.interface";
import { Friend, Group, Member } from "../interface/contact.interface";

import { BaseMixin } from "./base.mixin";

export class InfoMixin extends BaseMixin {
  

  friendList() {
    return this.execute<Friend[]>("friendList");
  }

  groupList() {
    return this.execute<Group[]>("groupList");
  }

  memberList(target: number) {
    return this.execute<Member[]>("memberList", {
      target,
    });
  }
  botProfile() {
    return this.execute<UserProfile>("botProfile");
  }
  friendProfile(target: number) {
    return this.execute<UserProfile>("botProfile", {
      target,
    });
  }
  memberProfile(target: number, memberId: number) {
    return this.execute<UserProfile>("memberProfile", {
      target,
      memberId,
    });
  }
}
