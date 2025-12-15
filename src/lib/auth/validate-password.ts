import bcrypt from "bcryptjs";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function validatePassword(password: string): string | null {
  if (!password) return "Password is required";

  const rules = [
    { regex: /.{8,}/, error: "Password must be at least 8 characters long" },
    {
      regex: /[A-Z]/,
      error: "Password must contain at least one uppercase letter",
    },
    {
      regex: /[a-z]/,
      error: "Password must contain at least one lowercase letter",
    },
    { regex: /\d/, error: "Password must contain at least one number" },
    {
      regex: /[!@#$%^&*(),.?":{}|<>]/,
      error: "Password must contain at least one special character",
    },
  ];

  for (const rule of rules) {
    if (!rule.regex.test(password)) return rule.error;
  }

  return null;
}
