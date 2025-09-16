import { NextRequest, NextResponse } from 'next/server'
import { s3 } from '@/lib/aws-s3'
import { PutObjectCommand } from '@aws-sdk/client-s3'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const bucket = process.env.S3_UPLOAD_BUCKET
    if (!bucket) return NextResponse.json({ error: 'S3_UPLOAD_BUCKET not configured' }, { status: 500 })

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const originalName = formData.get('filename') as string | undefined
    if (!file) return NextResponse.json({ error: 'file missing' }, { status: 400 })

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
  const key = originalName || file.name

    const encryption = process.env.S3_ENCRYPTION === 'true'

    await s3().send(new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: file.type || 'application/octet-stream',
      ...(encryption ? { ServerSideEncryption: 'AES256' } : {})
    }))

    return NextResponse.json({ key })
  } catch (e: any) {
    console.error('direct upload error', e)
    return NextResponse.json({ error: e?.message || 'upload failed' }, { status: 500 })
  }
}
