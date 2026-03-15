import { envs } from 'src/config';

export const ValidateEmail = (email: string): boolean => {
  const domainvalid = envs.validEmailDomains;
  const emailDomain = email.split('@')[1];

  if (!domainvalid.includes(emailDomain)) return false;
  return true;
};
