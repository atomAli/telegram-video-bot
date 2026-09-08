function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function optional(name: string): string | undefined {
  return process.env[name];
}

export const config = {
  botToken: required("BOT_TOKEN"),
  r2AccountId: required("R2_ACCOUNT_ID"),
  r2AccessKeyId: required("R2_ACCESS_KEY_ID"),
  r2SecretAccessKey: required("R2_SECRET_ACCESS_KEY"),
  r2BucketName: required("R2_BUCKET_NAME"),
  allowedUserIds: new Set(
    optional("ALLOWED_USER_IDS")
      ?.split(",")
      .map((id) => id.trim())
      .filter(Boolean)
      .map(Number) ?? []
  ),
  publicBaseUrl: optional("R2_PUBLIC_BASE_URL"),
};
