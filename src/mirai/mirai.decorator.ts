export const MIRAI_COMMAND_METADATA = "MIRAI:COMMAND";

export function Command(): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(MIRAI_COMMAND_METADATA, 1, target);
  };
}
