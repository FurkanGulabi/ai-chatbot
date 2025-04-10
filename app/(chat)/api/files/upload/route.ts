import { auth } from "@/auth";
import * as Minio from "minio";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT!,
  port: Number(process.env.MINIO_PORT),
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
});

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME!;

const FileSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "File size should be less than 5MB",
    })
    .refine(
      (file) =>
        ["image/jpeg", "image/png", "application/pdf"].includes(file.type),
      {
        message: "File type should be JPEG, PNG, or PDF",
      }
    ),
});

async function ensureBucketExists() {
  const exists = await minioClient.bucketExists(BUCKET_NAME);
  if (!exists) {
    await minioClient.makeBucket(BUCKET_NAME, "us-east-1");
  }
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (request.body === null) {
    return new Response("Request body is empty", { status: 400 });
  }

  try {
    await ensureBucketExists();
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new Response("File not found", { status: 400 });
    }

    const validatedFile = FileSchema.safeParse({ file });
    if (!validatedFile.success) {
      const errorMessage = validatedFile.error.errors
        .map((error) => error.message)
        .join(", ");
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    const fileName = uuidv4();

    const buffer = Buffer.from(await file.arrayBuffer());

    try {
      await minioClient.putObject(BUCKET_NAME, fileName, buffer, file.size);

      const fileUrl = `${process.env.MINIO_URL}/${BUCKET_NAME}/${fileName}`;

      return NextResponse.json({
        url: fileUrl,
        name: fileName,
        contentType: file.type,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      return NextResponse.json(
        { error: "Failed to upload file" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing file upload:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
