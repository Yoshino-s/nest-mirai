import { File, Directory } from "../interface/file.interface";

import { BaseMixin } from "./base.mixin";

export class FileMixin extends BaseMixin {
  fileList<T extends boolean>(target: number, directory = "", withDownloadInfo?: T) {
    return this.execute<File<T>|Directory>("file_list", {
      target,
      directory,
      withDownloadInfo,
    });
  }
  fileInfo<T extends boolean>(target: number, id: string, withDownloadInfo?: T) {
    return this.execute<File<T>|Directory>("file_info", {
      target,
      id,
      withDownloadInfo,
    });
  }
  fileMkdir(target: number, parentId: string, directoryName: string) {
    return this.execute<Directory>("file_mkdir", {
      id: parentId,
      target,
      directoryName,
    });
  }
  fileDetele(target: number, id: string) {
    return this.execute<void>("file_delete", {
      id,
      target,
    });
  }
  fileMove(target: number, id: string, moveTo: string) {
    return this.execute<void>("file_move", {
      id,
      target,
      moveTo,
    });
  }
  fileRename(target: number, id: string, renameTo: string) {
    return this.execute<void>("file_rename", {
      id,
      target,
      renameTo,
    });
  }
}
