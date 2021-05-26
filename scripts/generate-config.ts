import { createHash } from "crypto";
import * as fs from "fs";
import * as path_ from "path";

import {load, dump} from "js-yaml";

import {BotConfig} from "../src/config/configuration";

const yamlConfig = BotConfig();

async function generate(path: string, transformer: (config: string) => Promise<string>|string) {
  const p = path_.parse(path);
  const example = fs.readFileSync(path_.format({
    ...p,
    base: undefined,
    ext: `.example${p.ext}`,
  })).toString();
  const config = await transformer(example);
  fs.writeFileSync(path, config);
}

async function main() {
  await Promise.all([
    generate("./config/AutoLogin.yml", (config_) => {
      const config = load(config_) as any;
      config.accounts[0].account = yamlConfig.qq;
      config.accounts[0].password.kind = "MD5";
      config.accounts[0].password.value = createHash("md5").update(yamlConfig.password).digest("hex");
      return dump(config);
    }),
    generate("./config/setting.yml", (config_) => {
      const config = load(config_) as any;
      config.authKey = yamlConfig.api.authKey;
      config.cacheSize = yamlConfig.api.cacheSize || 4096;
      config.enableWebsocket = !!yamlConfig.api.enableWebsocket;
      return dump(config);
    }),
  ]);
}

main();
