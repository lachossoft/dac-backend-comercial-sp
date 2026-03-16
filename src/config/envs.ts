import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  VALID_EMAIL_DOMAINS: string;
  TZ: string;
  FILEDIRECTORY: string;
  PROFILE_PICTURE_DIRECTORY: string;
}

const envVarsSchema = joi
  .object({
    PORT: joi.number().required(),
    VALID_EMAIL_DOMAINS: joi.string().required(),
    TZ: joi.string().required(),
    FILEDIRECTORY: joi.string().required(),
    PROFILE_PICTURE_DIRECTORY: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envVarsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVrs: EnvVars = value;

export const envs = {
  port: envVrs.PORT,
  tz: envVrs.TZ,
  validEmailDomains: envVrs.VALID_EMAIL_DOMAINS.split(',').map((domain) =>
    domain.trim(),
  ),
  filedirectory: envVrs.FILEDIRECTORY,
  profilepicturedirectory: envVrs.PROFILE_PICTURE_DIRECTORY,
};
