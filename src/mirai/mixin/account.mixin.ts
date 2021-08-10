import { BaseMixin } from "./base.mixin";

export class AccountMixin extends BaseMixin {
  async deleteFriend(target: number) {
    await this.execute("deleteFriend", {
      target,
    });
  }
}
