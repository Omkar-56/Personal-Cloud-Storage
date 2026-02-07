// utils/storage.js
import { GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../utils/s3client.js"; // your existing s3client.js
import path from "path";
import fs from "fs";

const BUCKET = process.env.MINIO_BUCKET;
const STORAGE_BACKEND = process.env.STORAGE_BACKEND || "minio";

/**
 * Upload a buffer to S3/MinIO.
 * @param {Object} opts
 * @param {Buffer} opts.buffer - file buffer (from multer.memoryStorage)
 * @param {string} opts.key - object key to write in bucket (e.g. users/{userId}/... )
 * @param {string} opts.contentType - mime type
 * @returns {Promise<{key:string}>}
 */
export async function uploadBufferToS3({ buffer, key, contentType }) {
  const Bucket = process.env.MINIO_BUCKET; // ensure set in env
  if (!Bucket) throw new Error("MINIO_BUCKET not configured");

  const cmd = new PutObjectCommand({
    Bucket,
    Key: key,
    Body: buffer,
    ContentType: contentType || "application/octet-stream",
  });

  await s3.send(cmd);
  // return the key so caller can save it in DB
  return { key };
}

export async function getSignedDownloadUrl(key, expires = 60) {
  if (!key) throw new Error("Missing key");
  const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  return await getSignedUrl(s3, cmd, { expiresIn: expires });
}

// streamObjectToResponse should stream local or S3 object into `res`
export async function streamObjectToResponse(key, res) {
  if (!key) throw new Error("Missing key");
  // If key is a local path (we used 'local:' prefix earlier), handle that:
  if (key.startsWith("local:")) {
    const rel = key.replace(/^local:/, "");
    const filepath = path.resolve(process.cwd(), rel);
    const read = fs.createReadStream(filepath);
    read.on("error", () => res.status(404).end("Not found"));
    return read.pipe(res);
  }
  // Otherwise assume S3 key:
  const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  const data = await s3.send(cmd);
  // data.Body is a Node stream
  return data.Body.pipe(res);
}

export async function deleteObject(key, backend = STORAGE_BACKEND) {
  // local backend (file on disk)
  if (backend === "local" || key.startsWith("local:")) {
    const rel = key.replace(/^local:/, "");
    const filepath = path.resolve(process.cwd(), rel);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
    return;
  }

  // minio / s3 backend
  if (!BUCKET) throw new Error("MINIO_BUCKET not configured");
  const cmd = new DeleteObjectCommand({ Bucket: BUCKET, Key: key });
  await s3.send(cmd);
}