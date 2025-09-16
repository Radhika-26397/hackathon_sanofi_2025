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
    if (!filename) return NextResponse.json({ error: 'filename required' }, { status: 400 });

    const bucket = 'kbr920804837659';
    const region = 'us-east-1';

    const accessKeyId = (process.env.MY_AWS_ACCESS_KEY_ID ?? '').trim();
    const secretAccessKey = (process.env.MY_AWS_SECRET_ACCESS_KEY ?? '').trim();
    if (!accessKeyId || !secretAccessKey) {
      return NextResponse.json({ error: 'S3 credentials not configured' }, { status: 500 });
    }

    const s3 = new S3Client({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });

    const cmd = new PutObjectCommand({
      Bucket: bucket,
      Key: filename,
      ContentType: type || 'application/octet-stream',
    });

    const url = await getSignedUrl(s3, cmd, { expiresIn: 120 });
    return NextResponse.json({ url, key: filename });
  } catch (e: any) {
    // TEMP: surface the real error so we know what failed
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
