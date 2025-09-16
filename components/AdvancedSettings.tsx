"use client"
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Settings, ChevronDown, Brain, FileSpreadsheet, Zap, Shield, Database } from 'lucide-react'

interface AdvancedConfig {
	llmModel: string
	temperature: number
	maxTokens: number
	relevanceThreshold: number
	enableExtensions: boolean
	autoApprove: boolean
	exportFormat: string
	includeMetadata: boolean
	batchSize: number
	parallelProcessing: boolean
}

export function AdvancedSettings() {
	const [config, setConfig] = useState<AdvancedConfig>({
		llmModel: 'gpt-4',
		temperature: 0.7,
		maxTokens: 4000,
		relevanceThreshold: 75,
		enableExtensions: true,
		autoApprove: false,
		exportFormat: 'excel',
		includeMetadata: true,
		batchSize: 10,
		parallelProcessing: true
	})
	const [isModelConfigOpen, setIsModelConfigOpen] = useState(false)
	const [isProcessingConfigOpen, setIsProcessingConfigOpen] = useState(false)
	const [isExportConfigOpen, setIsExportConfigOpen] = useState(false)

	const llmModels = [
		{ value: 'gpt-4', label: 'GPT-4', description: 'Most capable model, best for complex mappings' },
		{ value: 'gpt-4-turbo', label: 'GPT-4 Turbo', description: 'Faster processing with high quality' },
		{ value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', description: 'Good balance of speed and quality' },
		{ value: 'claude-3', label: 'Claude 3', description: 'Excellent for structured analysis' },
		{ value: 'gemini-pro', label: 'Gemini Pro', description: "Google's advanced language model" }
	]
	const exportFormats = [
		{ value: 'excel', label: 'Excel (.xlsx)', description: 'Rich formatting with multiple sheets' },
		{ value: 'csv', label: 'CSV', description: 'Simple comma-separated values' },
		{ value: 'json', label: 'JSON', description: 'Structured data format' },
		{ value: 'xml', label: 'XML', description: 'Hierarchical markup format' }
	]

	const updateConfig = (key: keyof AdvancedConfig, value: any) => setConfig(prev => ({ ...prev, [key]: value }))
	const resetToDefaults = () => setConfig({ llmModel: 'gpt-4', temperature: 0.7, maxTokens: 4000, relevanceThreshold: 75, enableExtensions: true, autoApprove: false, exportFormat: 'excel', includeMetadata: true, batchSize: 10, parallelProcessing: true })
	const getModelBadge = (model: string) => {
		const badges: any = {
			'gpt-4': { variant: 'default', text: 'Premium' },
			'gpt-4-turbo': { variant: 'secondary', text: 'Fast' },
			'gpt-3.5-turbo': { variant: 'outline', text: 'Standard' },
			'claude-3': { variant: 'secondary', text: 'Advanced' },
			'gemini-pro': { variant: 'outline', text: 'Beta' }
		}
		const badge = badges[model] || badges['gpt-4']
		return <Badge variant={badge.variant}>{badge.text}</Badge>
	}

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5" />Advanced Settings</CardTitle>
					<CardDescription>Configure AI model parameters, processing options, and export settings</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex items-center gap-4"><Button onClick={resetToDefaults} variant="outline">Reset to Defaults</Button><Button>Save Configuration</Button></div>
				</CardContent>
			</Card>
			<Collapsible open={isModelConfigOpen} onOpenChange={setIsModelConfigOpen}>
				<Card>
					<CollapsibleTrigger asChild>
						<CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
							<CardTitle className="flex items-center justify-between"><div className="flex items-center gap-2"><Brain className="h-5 w-5" />AI Model Configuration</div><ChevronDown className={`h-4 w-4 transition-transform ${isModelConfigOpen ? 'rotate-180' : ''}`} /></CardTitle>
							<CardDescription>Select and configure the AI model for processing workflows</CardDescription>
						</CardHeader>
					</CollapsibleTrigger>
					<CollapsibleContent>
						<CardContent className="space-y-6">
							<div className="space-y-3">
								<Label>Language Model</Label>
								<Select value={config.llmModel} onValueChange={v => updateConfig('llmModel', v)}>
									<SelectTrigger><SelectValue placeholder="Select AI model" /></SelectTrigger>
									<SelectContent>
										{llmModels.map(m => <SelectItem key={m.value} value={m.value}><div className="flex items-center gap-2"><span>{m.label}</span>{getModelBadge(m.value)}</div></SelectItem>)}
									</SelectContent>
								</Select>
								<p className="text-sm text-muted-foreground">{llmModels.find(m => m.value === config.llmModel)?.description}</p>
							</div>
							<Separator />
							<div className="space-y-4">
								<h4 className="font-medium">Model Parameters</h4>
								<div className="space-y-3">
									<div className="flex items-center justify-between"><Label>Temperature</Label><span className="text-sm text-muted-foreground">{config.temperature}</span></div>
									<Slider min={0} max={2} step={0.1} value={[config.temperature]} onValueChange={v => updateConfig('temperature', v[0])} />
									<p className="text-xs text-muted-foreground">Higher values increase creativity; lower values increase determinism.</p>
								</div>
								<div className="space-y-3">
									<div className="flex items-center justify-between"><Label>Max Tokens</Label><span className="text-sm text-muted-foreground">{config.maxTokens}</span></div>
									<Slider min={1000} max={8000} step={500} value={[config.maxTokens]} onValueChange={v => updateConfig('maxTokens', v[0])} />
									<p className="text-xs text-muted-foreground">Maximum number of tokens generated per response.</p>
								</div>
							</div>
						</CardContent>
					</CollapsibleContent>
				</Card>
			</Collapsible>
			<Collapsible open={isProcessingConfigOpen} onOpenChange={setIsProcessingConfigOpen}>
				<Card>
					<CollapsibleTrigger asChild>
						<CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
							<CardTitle className="flex items-center justify-between"><div className="flex items-center gap-2"><Zap className="h-5 w-5" />Processing Configuration</div><ChevronDown className={`h-4 w-4 transition-transform ${isProcessingConfigOpen ? 'rotate-180' : ''}`} /></CardTitle>
							<CardDescription>Configure how requirements are processed and mapped</CardDescription>
						</CardHeader>
					</CollapsibleTrigger>
					<CollapsibleContent>
						<CardContent className="space-y-6">
							<div className="space-y-3">
								<div className="flex items-center justify-between"><Label>Relevance Threshold</Label><span className="text-sm text-muted-foreground">{config.relevanceThreshold}%</span></div>
								<Slider min={50} max={95} step={5} value={[config.relevanceThreshold]} onValueChange={v => updateConfig('relevanceThreshold', v[0])} />
								<p className="text-xs text-muted-foreground">Minimum confidence score for automatic approval.</p>
							</div>
							<Separator />
							<div className="space-y-4">
								<h4 className="font-medium">Processing Options</h4>
								<div className="flex items-center justify-between"><div className="space-y-1"><Label>Enable Model Extensions</Label><p className="text-xs text-muted-foreground">Allow AI to extend the model.</p></div><Switch checked={config.enableExtensions} onCheckedChange={v => updateConfig('enableExtensions', v)} /></div>
								<div className="flex items-center justify-between"><div className="space-y-1"><Label>Auto-approve High Confidence</Label><p className="text-xs text-muted-foreground">Auto approve above threshold.</p></div><Switch checked={config.autoApprove} onCheckedChange={v => updateConfig('autoApprove', v)} /></div>
								<div className="flex items-center justify-between"><div className="space-y-1"><Label>Parallel Processing</Label><p className="text-xs text-muted-foreground">Process multiple items at once.</p></div><Switch checked={config.parallelProcessing} onCheckedChange={v => updateConfig('parallelProcessing', v)} /></div>
							</div>
							<Separator />
							<div className="space-y-3">
								<div className="flex items-center justify-between"><Label>Batch Size</Label><span className="text-sm text-muted-foreground">{config.batchSize}</span></div>
								<Slider min={1} max={50} step={1} value={[config.batchSize]} onValueChange={v => updateConfig('batchSize', v[0])} />
							</div>
						</CardContent>
					</CollapsibleContent>
				</Card>
			</Collapsible>
			<Collapsible open={isExportConfigOpen} onOpenChange={setIsExportConfigOpen}>
				<Card>
					<CollapsibleTrigger asChild>
						<CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
							<CardTitle className="flex items-center justify-between"><div className="flex items-center gap-2"><FileSpreadsheet className="h-5 w-5" />Export Configuration</div><ChevronDown className={`h-4 w-4 transition-transform ${isExportConfigOpen ? 'rotate-180' : ''}`} /></CardTitle>
							<CardDescription>Configure output format and export options</CardDescription>
						</CardHeader>
					</CollapsibleTrigger>
					<CollapsibleContent>
						<CardContent className="space-y-6">
							<div className="space-y-3">
								<Label>Export Format</Label>
								<Select value={config.exportFormat} onValueChange={v => updateConfig('exportFormat', v)}>
									<SelectTrigger><SelectValue placeholder="Select export format" /></SelectTrigger>
									<SelectContent>{exportFormats.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}</SelectContent>
								</Select>
							</div>
							<Separator />
							<div className="space-y-4">
								<h4 className="font-medium">Export Options</h4>
								<div className="flex items-center justify-between"><div className="space-y-1"><Label>Include Metadata</Label><p className="text-xs text-muted-foreground">Add metadata & scores.</p></div><Switch checked={config.includeMetadata} onCheckedChange={v => updateConfig('includeMetadata', v)} /></div>
							</div>
						</CardContent>
					</CollapsibleContent>
				</Card>
			</Collapsible>
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Security & Privacy</CardTitle>
					<CardDescription>Data handling and privacy settings</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="p-4 border rounded-lg bg-muted/50">
						<div className="flex items-start gap-3"><Database className="h-5 w-5 text-blue-500 mt-0.5" /><div><h4 className="font-medium">Data Processing</h4><p className="text-sm text-muted-foreground mt-1">Your data is processed securely and not stored permanently.</p></div></div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">{['End-to-end encryption','No permanent data storage','SOC 2 compliant processing','GDPR compliant'].map(item => <div key={item} className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full" /><span>{item}</span></div>)}</div>
				</CardContent>
			</Card>
		</div>
	)
}
