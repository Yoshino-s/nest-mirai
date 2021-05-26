/* eslint-disable @typescript-eslint/no-inferrable-types */
import { IsBoolean, IsNumber, IsOptional, IsString, MinLength, ValidateNested } from "class-validator";


/**
 * redis config
 */
export class RedisConfigInterface {
  /**
   * host of redis server
   */
  @IsString()
  host: string = "localhost";
  /**
   * port of redis server
   */
  @IsNumber()
  port: number = 6379;
  /**
   * password of redis server, empty for no password
   */
  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  prefix: string = "";
}

export class APIConfigInterface {
  @IsString()
  host: string = "localhost";
  @IsNumber()
  port: number = 8080;
  @IsString()
  @MinLength(8)
  authKey: string = "keykeykey";
  @IsNumber()
  @IsOptional()
  cacheSize?: number;
  @IsBoolean()
  @IsOptional()
  enableWebsocket?: boolean;
}

export class SessionConfigInterface {
  /**
   * default expire time in ms, -1 for no expire
   * @default -1
   */
  @IsNumber()
  @IsOptional()
  expire: number = -1;
  /**
   * session redis reocrd prefix
   * @default "session:"
   */
  @IsString()
  sessionPrefix: string = "session:";
}

export class ConfigInterface {
  @ValidateNested()
  redis: RedisConfigInterface = new RedisConfigInterface();
  @ValidateNested()
  api: APIConfigInterface = new APIConfigInterface();
  @ValidateNested()
  @IsOptional()
  session: SessionConfigInterface = new SessionConfigInterface();
  @IsNumber()
  qq: number = 0;
  @IsString()
  password: string = "";
  @IsString({ each: true })
  commandPrefix: string[] = [];
  @IsNumber(undefined, { each: true })
  admin: number[] = [];
}
