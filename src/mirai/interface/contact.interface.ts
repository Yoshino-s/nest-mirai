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
export interface OtherClient extends BaseUser {
  platform: string;
}
export type User = Friend | Member | OtherClient;
