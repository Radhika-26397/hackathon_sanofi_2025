// app/api/s3/presign/route.ts
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const { filename, type } = await req.json();
    if (!filename) {
      return NextResponse.json(
        { error: "filename required" },
        { status: 400 }
      );
    }

    const bucket = process.env.S3_UPLOAD_BUCKET!;
    const region = process.env.AWS_REGION ?? "us-east-1";
    const accessKeyId = process.env.MY_AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.MY_AWS_SECRET_ACCESS_KEY;

    // 🔎 Debug log (safe)
    console.log("DEBUG AWS CREDS", {
      accessKeyId: accessKeyId
        ? accessKeyId.slice(0, 4) + "...(redacted)"
        : "MISSING",
      secretAccessKey: secretAccessKey ? "SET" : "MISSING",
      region,
      bucket,
    });

    if (!accessKeyId || !secretAccessKey) {
      return NextResponse.json(
        { error: "S3 credentials not configured" },
        { status: 500 }
      );
    }

    // ✅ Create S3 client
    const s3 = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: filename,
      ContentType: type || "application/octet-stream",
    });

    // Generate presigned URL (2 min)
    const url = await getSignedUrl(s3, command, { expiresIn: 120 });

    return NextResponse.json({ url, key: filename });
  } catch (e: any) {
    console.error("S3 Presign Error:", e);
    return NextResponse.json(
      { error: e?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
