"use client"
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Upload, FileText, BarChart3, Zap, ArrowRight } from 'lucide-react'

interface DashboardProps {
  onNext?: () => void
  workflowState?: any
  updateWorkflowState?: (state: any) => void
}

export function Dashboard({ onNext, updateWorkflowState }: DashboardProps) {
  const [filesUploaded, setFilesUploaded] = useState(false)
  const [requirementsText, setRequirementsText] = useState('')
  const [coreModelText, setCoreModelText] = useState('')
  const [uploading, setUploading] = useState(false)
  const [reqFiles, setReqFiles] = useState<string[]>([])
  const [coreFiles, setCoreFiles] = useState<string[]>([])
  const [uploadErrors, setUploadErrors] = useState<string[]>([])
  // Simplified uploader: only presign + PUT

  async function uploadFiles(list: FileList | null, bucket: 'req' | 'core') {
    if (!list || list.length === 0) return
    setUploading(true)
    setUploadErrors([])
    try {
      const newKeys: string[] = []
      for (const file of Array.from(list)) {
        let presignRes: Response
        try {
          presignRes = await fetch('/api/s3/presign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, type: file.type || 'application/octet-stream' })
        })
        } catch (e) {
          setUploadErrors(prev => [...prev, `${file.name}: network error requesting presign`])
          console.error('presign network error', e)
          continue
        }
        if (!presignRes.ok) {
          const msg = await presignRes.text()
          setUploadErrors(prev => [...prev, `${file.name}: presign failed (${presignRes.status}) ${msg.slice(0,120)}`])
          continue
        }
        let url: string, key: string
        try {
          ({ url, key } = await presignRes.json())
        } catch (e) {
          setUploadErrors(prev => [...prev, `${file.name}: invalid presign JSON`])
          console.error('presign json parse', e)
          continue
        }
        try {
          const putRes = await fetch(url, { method: 'PUT', body: file })
          if (!putRes.ok) {
            const errText = await putRes.text().catch(()=> '')
            setUploadErrors(prev => [...prev, `${file.name}: upload failed (${putRes.status}) ${errText.slice(0,120)}`])
            continue
          }
          newKeys.push(key)
        } catch (e:any) {
          setUploadErrors(prev => [...prev, `${file.name}: network error ${(e?.message)||e}`])
          continue
        }
      }
  if (bucket === 'req') setReqFiles(prev => [...prev, ...newKeys])
  else setCoreFiles(prev => [...prev, ...newKeys])
    } catch (e) {
      console.error(e)
    } finally {
      setUploading(false)
    }
  }

  const handleProcess = () => {
    setFilesUploaded(true)
    updateWorkflowState?.((prev: any) => ({ ...prev, filesUploaded: true }))
    onNext?.()
  }

  return (
  <div className="space-y-6">
      <Alert>
        <Zap className="h-4 w-4" />
        <AlertDescription><strong>Step 1:</strong> Upload site requirements and core model files to begin processing.</AlertDescription>
      </Alert>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Upload className="h-5 w-5" />Requirements</CardTitle>
              <CardDescription>Provide site-specific requirements text and documents.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label htmlFor="requirements-text">Requirements Text</Label><Textarea id="requirements-text" value={requirementsText} onChange={e => setRequirementsText(e.target.value)} placeholder="Paste or describe the site requirements..." className="min-h-[160px]" /></div>
              <div className="space-y-2"><Label>Upload Files</Label><Input type="file" multiple onChange={e => uploadFiles(e.target.files,'req')} disabled={uploading} /></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Upload className="h-5 w-5" />Core Model</CardTitle>
              <CardDescription>Provide the base core model reference content and files.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label htmlFor="core-model-text">Core Model Text</Label><Textarea id="core-model-text" value={coreModelText} onChange={e => setCoreModelText(e.target.value)} placeholder="Paste or describe the core model..." className="min-h-[160px]" /></div>
              <div className="space-y-2"><Label>Upload Files</Label><Input type="file" multiple onChange={e => uploadFiles(e.target.files,'core')} disabled={uploading} /></div>
            </CardContent>
          </Card>
          <div className="md:col-span-2">
            <Button onClick={handleProcess} disabled={filesUploaded} className="gap-2 w-full md:w-auto">Process Files<ArrowRight className="h-4 w-4" /></Button>
          </div>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Status</CardTitle><CardDescription>Upload progress and validation</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><div className="flex items-center justify-between text-sm"><span>Requirements Files</span><Badge variant={reqFiles.length ? 'secondary' : 'outline'}>{reqFiles.length ? `${reqFiles.length}` : 'Pending'}</Badge></div><Progress value={reqFiles.length ? 100 : 0} /></div>
              <div className="space-y-2"><div className="flex items-center justify-between text-sm"><span>Core Files</span><Badge variant={coreFiles.length ? 'secondary' : 'outline'}>{coreFiles.length ? `${coreFiles.length}` : 'Pending'}</Badge></div><Progress value={coreFiles.length ? 100 : 0} /></div>
              <div className="space-y-2"><div className="flex items-center justify-between text-sm"><span>Total Files</span><Badge variant={(reqFiles.length+coreFiles.length) ? 'secondary' : 'outline'}>{(reqFiles.length+coreFiles.length) ? `${reqFiles.length+coreFiles.length}` : 'Pending'}</Badge></div><Progress value={(reqFiles.length+coreFiles.length) ? 100 : 0} /></div>
              {uploadErrors.length > 0 && (
                <div className="space-y-1 text-xs text-destructive/80 max-h-32 overflow-auto border rounded-md p-2 border-destructive/30 bg-destructive/5">
                  {uploadErrors.map((e,i)=>(<div key={i}>{e}</div>))}
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" />Insights</CardTitle><CardDescription>Summary of provided data</CardDescription></CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>{requirementsText ? `${requirementsText.length} characters of requirements captured.` : 'No requirements text provided yet.'}</p>
              <p>{coreModelText ? `${coreModelText.length} characters of core model captured.` : 'No core model text provided yet.'}</p>
              <p>Files processed: {filesUploaded ? 'Yes' : 'No'}</p>
            </CardContent>
          </Card>
        </div>
      </div>
      {filesUploaded && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800"><CardContent className="p-6 flex items-center justify-between"><div><h3 className="font-semibold text-green-800 dark:text-green-200">Upload Complete</h3><p className="text-sm text-green-600 dark:text-green-300">Documents processed successfully. Proceed to prompt management.</p></div><Button onClick={onNext} className="gap-2">Continue<ArrowRight className="h-4 w-4" /></Button></CardContent></Card>) }
    </div>
  )
}
