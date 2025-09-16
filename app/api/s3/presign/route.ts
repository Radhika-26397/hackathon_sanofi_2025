// app/api/s3/presign/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const { filename, type } = await req.json();
    if (!filename) {
      return NextResponse.json({ error: 'filename required' }, { status: 400 });
    }

    const bucket = process.env.MY_BUCKET_NAME ?? 'kbr920804837659'; // use env, fallback to default
    const region = process.env.AWS_REGION ?? 'us-east-1';

    // ⚡ Do NOT pass credentials here — let AWS SDK resolve automatically
    const s3 = new S3Client({ region });

    const cmd = new PutObjectCommand({
      Bucket: bucket,
      Key: filename,
      ContentType: type || 'application/octet-stream',
    });

    const url = await getSignedUrl(s3, cmd, { expiresIn: 120 });
    return NextResponse.json({ url, key: filename });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
