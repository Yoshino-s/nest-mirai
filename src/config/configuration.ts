import { readFileSync } from "fs";

import { registerAs } from "@nestjs/config";
import {plainToClass} from "class-transformer";
import {validateSync} from "class-validator";
import {sync} from "find-up";
import * as yaml from "js-yaml";

import { ConfigInterface } from "./config.interface";

const YAML_CONFIG_FILENAME = "config.yml";
export let yamlConfig: ConfigInterface;

const p = sync(YAML_CONFIG_FILENAME);
if (p) {
  yamlConfig = plainToClass(ConfigInterface, yaml.load(
    readFileSync(p, "utf8"),
  ));
} else {
  throw Error(`cannot find ${YAML_CONFIG_FILENAME}.`);
}

const errors = validateSync(yamlConfig);
if (errors.length) {
  throw errors[0];
}

export const BotConfig = registerAs("bot", () => yamlConfig);

export const RedisConfig = registerAs("redis", () => yamlConfig.redis);

export const SessionConfig = registerAs("session", () => yamlConfig.session);
