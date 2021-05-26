import clc from "cli-color";
import bare from "cli-color/bare";
import safeStringify from "fast-safe-stringify";
import { Format } from "logform";
import { format } from "winston";

const nestLikeColorScheme: Record<string, bare.Format> = {
  info: clc.greenBright,
  error: clc.red,
  warn: clc.yellow,
  debug: clc.magentaBright,
  verbose: clc.cyanBright,
};

export const nestLikeConsoleFormat = (appName = "NestWinston"): Format => format.printf(({ context, level, timestamp, message, ...meta }) => {
  if ("undefined" !== typeof timestamp) {
    try {
      if (timestamp === (new Date(timestamp)).toISOString()) {
        timestamp = (new Date(timestamp)).toLocaleString(undefined, {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
      }
    } catch (error) {
      //
    }
  }

  const color = nestLikeColorScheme[level] || ((text: string): string => text);

  return `${color(`[${appName}]`)} ` +
        `${clc.yellow(level.charAt(0).toUpperCase() + level.slice(1))}\t` +
        ("undefined" !== typeof timestamp ? `${timestamp} ` : "") +
        ("undefined" !== typeof context ? `${clc.yellow("[" + context + "]")} ` : "") +
        `${color(message)}` +
        `${Object.keys(meta).length ? " - "+safeStringify(meta) : ""}`;
});
