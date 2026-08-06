import { Injectable, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { extname } from "path";
import { randomUUID } from "crypto";

@Injectable()
export class UploadsService {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;

  constructor(private readonly config: ConfigService) {
    const r2 = this.config.get("r2");

    this.bucket = r2.bucket;
    this.publicUrl = r2.publicUrl.replace(/\/$/, ""); // strip trailing slash

    this.client = new S3Client({
      region: "auto",
      endpoint: r2.endpoint,
      credentials: {
        accessKeyId: r2.accessKey,
        secretAccessKey: r2.secretKey,
      },
    });
  }

  /**
   * Upload a single file buffer to R2.
   * Returns the full public URL.
   */
  async uploadFile(
    file: Express.Multer.File,
    folder = "products",
  ): Promise<{ url: string; key: string }> {
    const ext = extname(file.originalname).toLowerCase() || ".jpg";
    const key = `${folder}/${randomUUID()}${ext}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        // R2 public buckets serve objects via the public URL without ACL
      }),
    );

    return {
      key,
      url: `${this.publicUrl}/${key}`,
    };
  }

  /**
   * Delete an object from R2 by its key.
   * Key can be extracted from a public URL or passed directly.
   */
  async deleteFile(key: string): Promise<void> {
    // Support passing a full public URL — extract the key from it
    if (key.startsWith("http")) {
      const url = new URL(key);
      key = url.pathname.replace(/^\//, ""); // remove leading slash
    }

    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }
}
