import { NextResponse } from 'next/server'
import { s3 } from '@/lib/aws-s3'
import { ListObjectsV2Command } from '@aws-sdk/client-s3'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const bucket = process.env.S3_UPLOAD_BUCKET
    if (!bucket) return NextResponse.json({ error: 'S3_UPLOAD_BUCKET not configured' }, { status: 500 })
    const out = await s3().send(new ListObjectsV2Command({ Bucket: bucket, MaxKeys: 20 }))
    const items = (out.Contents || []).map(o => ({ key: o.Key, size: o.Size, lastModified: o.LastModified }))
    return NextResponse.json({ items })
  } catch (e: any) {
    console.error('list error', e)
    return NextResponse.json({ error: e?.message || 'list failed' }, { status: 500 })
  }
}
