import { BaseMixin } from "./base.mixin";

export class AboutMixin extends BaseMixin {
  about() {
    return this.execute<{ version: string }>("about");
  }
}
