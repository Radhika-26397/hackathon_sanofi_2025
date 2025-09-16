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
    if (!filename) return NextResponse.json({ error: "filename required" }, { status: 400 });

    const bucket = "kbr920804837659";
    const region = "us-east-1";

    if (!bucket) return NextResponse.json({ error: "Bucket not configured" }, { status: 500 });

    // Use Amplify role-based credentials (no keys needed)
    const s3 = new S3Client({ region });

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: filename,
      ContentType: type || "application/octet-stream",
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 120 });

    return NextResponse.json({ url, key: filename });
  } catch (e: any) {
    console.error("S3 Presign Error:", e);
    return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 });
  }
}
