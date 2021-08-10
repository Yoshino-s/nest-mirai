export class BaseMixin {
  execute<R = any>(command: string): Promise<R>;
  execute<R = any>(command: string, subCommand: string): Promise<R>
  execute<R = any, C = any>(command: string, content: C): Promise<R>
  execute<R = any, C = any>(command: string, subCommand: string, content: C): Promise<R>
  async execute<R = any, C = any>(command: string, subCommand?: C|string, content?: C): Promise<R> {
    throw Error("Must implement in mixin classes");
  }
}
