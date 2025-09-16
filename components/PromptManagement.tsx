"use client"
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FileText, Settings2, Sparkles, Save, ArrowRight, Zap } from 'lucide-react'

interface PromptManagementProps {
  onNext?: () => void
  onPrevious?: () => void
  workflowState?: any
  updateWorkflowState?: (state: any) => void
}

interface PromptTemplate {
  id: string
  name: string
  description: string
  content: string
  category: string
  version: string
}

export function PromptManagement({ onNext, updateWorkflowState }: PromptManagementProps) {
  const templates: PromptTemplate[] = [
    { id: 't1', name: 'Standard Mapping', description: 'Standard requirement to entity mapping with confidence scoring', content: 'You are an AI system that maps pharmaceutical site requirements...', category: 'Mapping', version: '1.0.0' },
    { id: 't2', name: 'Extended Entity Detection', description: 'Includes detection of missing entities and proposes additions', content: 'You are an AI that not only maps but identifies missing core entities...', category: 'Extension', version: '1.0.0' },
    { id: 't3', name: 'Compliance Focus', description: 'Emphasizes regulatory and compliance alignment in mapping', content: 'Focus on compliance and regulatory mapping aspects...', category: 'Compliance', version: '1.0.0' }
  ]

  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(templates[0])
  const [customPrompt, setCustomPrompt] = useState(selectedTemplate?.content || '')
  const [promptName, setPromptName] = useState(selectedTemplate?.name || '')
  const [isSaved, setIsSaved] = useState(false)

  const handleTemplateSelect = (tpl: PromptTemplate) => {
    setSelectedTemplate(tpl)
    setCustomPrompt(tpl.content)
    setPromptName(tpl.name)
    setIsSaved(false)
  }

  const handleSave = () => {
    setIsSaved(true)
    updateWorkflowState?.((prev: any) => ({ ...prev, promptSelected: true }))
  }

  const handleContinue = () => {
    if (!isSaved) handleSave()
    onNext?.()
  }

  return (
    <div className="space-y-6">
      <Alert>
        <Zap className="h-4 w-4" />
        <AlertDescription><strong>Step 2:</strong> Select or customize the AI prompt that will process your requirements and core model.</AlertDescription>
      </Alert>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Prompt Templates</CardTitle>
            <CardDescription>Select a base template to begin customization</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[420px] pr-4">
              <div className="space-y-4">
                {templates.map(tpl => (
                  <button key={tpl.id} onClick={() => handleTemplateSelect(tpl)} className={`w-full text-left p-4 rounded-lg border transition-all ${selectedTemplate?.id === tpl.id ? 'border-primary bg-primary/5' : 'hover:border-primary/40'}`}>
                    <div className="flex items-center justify-between mb-1"><span className="font-medium">{tpl.name}</span><Badge variant="outline" className="text-xs">v{tpl.version}</Badge></div>
                    <p className="text-sm text-muted-foreground mb-2 leading-snug">{tpl.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{tpl.category}</Badge>
                      {selectedTemplate?.id === tpl.id && <Badge variant="outline" className="text-xs">Selected</Badge>}
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Settings2 className="h-5 w-5" />Customize Prompt</CardTitle>
            <CardDescription>Modify the selected template or create your own</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label htmlFor="prompt-name">Prompt Name</Label><Input id="prompt-name" value={promptName} onChange={e => setPromptName(e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="prompt-content">Prompt Content</Label><Textarea id="prompt-content" value={customPrompt} onChange={e => setCustomPrompt(e.target.value)} className="min-h-[260px]" /></div>
            <div className="flex gap-3">
              <Button type="button" onClick={handleSave} className="gap-2"><Save className="h-4 w-4" />Save</Button>
              <Button type="button" variant="secondary" className="gap-2" onClick={handleContinue}><Sparkles className="h-4 w-4" />Run Mapping</Button>
            </div>
            {isSaved && <p className="text-xs text-green-600">Prompt saved. You can proceed to mapping.</p>}
          </CardContent>
        </Card>
      </div>
      {isSaved && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800"><CardContent className="p-6 flex items-center justify-between"><div><h3 className="font-semibold text-blue-800 dark:text-blue-200">Prompt Ready</h3><p className="text-sm text-blue-600 dark:text-blue-300">Your prompt configuration is saved. Continue to interactive mapping.</p></div><Button onClick={onNext} className="gap-2">Continue<ArrowRight className="h-4 w-4" /></Button></CardContent></Card>) }
    </div>
  )
}
