import {
  S3Client,
  PutObjectCommand,
  type PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { config } from "./config.js";

const client = new S3Client({
  region: "auto",
  endpoint: `https://${config.r2AccountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: config.r2AccessKeyId,
    secretAccessKey: config.r2SecretAccessKey,
  },
});

export async function uploadVideo(
  key: string,
  body: Buffer
): Promise<string> {
  const input: PutObjectCommandInput = {
    Bucket: config.r2BucketName,
    Key: key,
    Body: body,
    ContentType: "video/mp4",
  };
  await client.send(new PutObjectCommand(input));
  return objectUrl(key);
}

export function objectUrl(key: string): string {
  if (config.publicBaseUrl) {
    const base = config.publicBaseUrl.replace(/\/$/, "");
    return `${base}/${key}`;
  }
  return `https://${config.r2BucketName}.${config.r2AccountId}.r2.dev/${key}`;
}
