import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const client = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  credentials:
    process.env.S3_ACCESS_KEY_ID && process.env.S3_ACCESS_KEY
      ? {
          accessKeyId: process.env.S3_ACCESS_KEY_ID,
          secretAccessKey: process.env.S3_ACCESS_KEY,
        }
      : undefined,
  forcePathStyle: process.env.S3_PATH_STYLE === "true",
});

const bucket = process.env.S3_BUCKET;
const imagePath = process.env.S3_IMAGE_PATH ?? "observations";

export default client;

/**
 * Generate a new key for observation image.
 *
 * @param ext File extension of the image, e.g. "jpg" or "png"
 */
export function genKey(ext: string) {
  const date = new Date();
  const uuid = crypto.randomUUID();
  return `${imagePath}/${date.valueOf()}_${uuid}.${ext}`;
}

/**
 * Get the observation image by key.
 *
 * @param key The key returned by {@link createObservation}
 *
 * @returns A signed URL that can be used as `src` for an `<img />`
 */
export async function getObservation(key: string) {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  return getSignedUrl(client, command);
}

/**
 * Create a new observation image by storing it in the S3 bucket.
 *
 * @param data Image data as a byte array
 * @param ext File extension of the image, e.g. "jpg" or "png"
 *
 * @returns Key for the newly created image
 */
export async function createObservation(data: Uint8Array, ext: string) {
  const key = genKey(ext);
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: data,
  });
  await client.send(command);
  return key;
}

/**
 * Delete observation with the given key from S3 bucket.
 *
 * @param key The key to the stored picture
 */
export async function deleteObservation(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  await client.send(command);
}
