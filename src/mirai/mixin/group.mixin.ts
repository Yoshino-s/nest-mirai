import { GroupConfig, GroupMemberInfo } from "../interface/api.interface";

import { BaseMixin } from "./base.mixin";

export class GroupMixin extends BaseMixin {
  
  async mute(qq: number, group: number, time: number) {
    await this.execute("mute", {
      target: group,
      memberId: qq,
      time,
    });
  }
  async unmute(qq: number, group: number) {
    await this.execute("unmute", {
      target: group,
      memberId: qq,
    });
  }
  async kick(qq: number, group: number, msg: string) {
    await this.execute("kick", {
      target: group,
      memberId: qq,
      msg,
    });
  }
  async quit(group: number) {
    await this.execute("/quit", {
      target: group,
    });
  }
  async muteAll(group: number) {
    await this.execute("muteAll", {
      target: group,
    });
  }
  async unmuteAll(group: number) {
    await this.execute("muteAll", {
      target: group,
    });
  }
  async setEssence(target: number) {
    await this.execute("setEssence", {
      target: target,
    });
  }

  getGroupConfig(group: number) {
    return this.execute<GroupConfig>("groupConfig", "get", {
      params: {
        target: group,
      },
    });
  }

  async setGroupConfig(group: number, config: GroupConfig) {
    await this.execute("groupConfig", "update", {
      target: group,
      config,
    });
  }

  getMemberInfo(qq: number, group: number) {
    return this.execute<GroupMemberInfo>("memberInfo", "get", {
      params: {
        target: group,
        memberId: qq,
      },
    });
  }

  async setMemberInfo(qq: number, group: number, info: GroupMemberInfo & {nickname: never}) {
    await this.execute("memberInfo", "update", {
      target: group,
      memberId: qq,
      info,
    });
  }
}
