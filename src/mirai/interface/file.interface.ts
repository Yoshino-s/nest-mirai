import { Friend, Group } from "./message.interface";

export interface FileObject {
  name: string;
  id: string;
  path: string;
  parent: Directory | null;
  contact: Group | Friend;
  isFile: boolean;
  isDirectory: boolean;
}

export interface File<WithDownloadInfo extends boolean = false> extends FileObject {
  isFile: true;
  isDirectory: false;
  downloadInfo: WithDownloadInfo extends true ? {
    sha1: string;
    md5: string;
    url: string;
  } : undefined;
}
export interface Directory extends FileObject {
  isFile: false;
  isDirectory: true;
}


