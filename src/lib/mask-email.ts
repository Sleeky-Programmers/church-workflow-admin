export function maskEmail(email: string) {
  const [name, domain] = email.split('@');

  if (name.length <= 2) {
    return `${name[0]}*@${domain}`;
  }

  const firstChar = name[0];
  const lastChar = name[name.length - 1];
  const masked = '*'.repeat(name.length - 2);

  return `${firstChar}${masked}${lastChar}@${domain}`;
}
