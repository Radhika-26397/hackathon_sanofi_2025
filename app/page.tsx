"use client"
import { useState } from 'react'
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Dashboard } from '@/components/Dashboard'
import { PromptManagement } from '@/components/PromptManagement'
import { MappingTool } from '@/components/MappingTool'
import { OutputReview } from '@/components/OutputReview'
import { AdvancedSettings } from '@/components/AdvancedSettings'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { LayoutDashboard, FileText, GitBranch, TableProperties, Settings, Brain, ChevronRight, ChevronLeft, ChevronDown } from 'lucide-react'

type WorkflowStep = 'dashboard' | 'prompts' | 'mapping' | 'output' | 'complete'

interface WorkflowState {
	currentStep: WorkflowStep
	completedSteps: WorkflowStep[]
	filesUploaded: boolean
	promptSelected: boolean
	mappingComplete: boolean
	outputApproved: boolean
}

export default function Page() {
	const [workflowState, setWorkflowState] = useState<WorkflowState>({
		currentStep: 'dashboard',
		completedSteps: [],
		filesUploaded: false,
		promptSelected: false,
		mappingComplete: false,
		outputApproved: false
	})
	const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)

	const workflowSteps = [
		{ id: 'dashboard' as WorkflowStep, label: 'Upload & Setup', icon: LayoutDashboard, description: 'Upload site requirements and core model files' },
		{ id: 'prompts' as WorkflowStep, label: 'Prompt Management', icon: FileText, description: 'Select or customize processing prompts' },
		{ id: 'mapping' as WorkflowStep, label: 'Interactive Mapping', icon: GitBranch, description: 'Map requirements to core model entities' },
		{ id: 'output' as WorkflowStep, label: 'Review & Export', icon: TableProperties, description: 'Review and approve generated output' }
	]

	const currentStepIndex = workflowSteps.findIndex(step => step.id === workflowState.currentStep)
	const progressPercentage = ((currentStepIndex + 1) / workflowSteps.length) * 100

	const navigateToStep = (stepId: WorkflowStep) => setWorkflowState(prev => ({ ...prev, currentStep: stepId }))
	const completeCurrentStep = () => setWorkflowState(prev => {
		const newCompleted = prev.completedSteps.includes(prev.currentStep)
			? prev.completedSteps
			: [...prev.completedSteps, prev.currentStep]
		return { ...prev, completedSteps: newCompleted }
	})
	const goToNextStep = () => {
		completeCurrentStep()
		const nextIndex = currentStepIndex + 1
		if (nextIndex < workflowSteps.length) navigateToStep(workflowSteps[nextIndex].id)
		else setWorkflowState(prev => ({ ...prev, currentStep: 'complete' }))
	}
	const goToPreviousStep = () => {
		const prevIndex = currentStepIndex - 1
		if (prevIndex >= 0) navigateToStep(workflowSteps[prevIndex].id)
	}
	const isStepAccessible = (stepId: WorkflowStep) => {
		const stepIndex = workflowSteps.findIndex(s => s.id === stepId)
		const currentIndex = workflowSteps.findIndex(s => s.id === workflowState.currentStep)
		return stepIndex <= currentIndex + 1
	}
	const isStepCompleted = (stepId: WorkflowStep) => workflowState.completedSteps.includes(stepId)
	const getCurrentStepInfo = () => workflowSteps.find(s => s.id === workflowState.currentStep)

	const stepProps = { onNext: goToNextStep, onPrevious: goToPreviousStep, workflowState, updateWorkflowState: setWorkflowState }
	const renderStepContent = () => {
		switch (workflowState.currentStep) {
			case 'dashboard': return <Dashboard {...stepProps} />
			case 'prompts': return <PromptManagement {...stepProps} />
			case 'mapping': return <MappingTool {...stepProps} />
			case 'output': return <OutputReview {...stepProps} />
			case 'complete':
				return (
					<div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
						<div className="relative">
							<div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg shadow-primary/25">
								<svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
								</svg>
							</div>
							<div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full border-2 border-background flex items-center justify-center">
								<div className="w-2 h-2 bg-primary rounded-full" />
							</div>
						</div>
						<div className="space-y-2">
							<h2 className="text-3xl font-semibold text-primary">Workflow Complete!</h2>
							<div className="w-16 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
						</div>
						<p className="text-muted-foreground max-w-md leading-relaxed">Your AI-powered pharmaceutical workflow has been successfully processed. The generated Excel output with validated mappings is ready for download and implementation.</p>
						<div className="flex gap-4">
							<Button onClick={() => navigateToStep('dashboard')} className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">Start New Workflow</Button>
							<Button variant="outline" onClick={() => navigateToStep('output')} className="border-primary/20 hover:bg-primary/5 hover:border-primary/40">View Results</Button>
						</div>
					</div>
				)
			default: return <Dashboard {...stepProps} />
		}
	}

	return (
		<SidebarProvider>
			<Sidebar className="border-r">
				<SidebarHeader className="p-4 border-b bg-gradient-to-r from-primary/5 to-accent/5">
					<div className="flex items-center gap-3">
						<div className="relative">
							<Brain className="h-7 w-7 text-primary" />
							<div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-background" />
						</div>
						<div>
							<h1 className="font-semibold text-lg">AI Workflow Automation</h1>
							<p className="text-xs text-muted-foreground">Powered by Sanofi Innovation</p>
						</div>
					</div>
				</SidebarHeader>
				<SidebarContent className="p-4">
					<div className="space-y-4 mb-6">
						<div className="space-y-3 p-3 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg border border-primary/10">
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground font-medium">Workflow Progress</span>
								<span className="font-semibold text-primary">{Math.round(progressPercentage)}%</span>
							</div>
							<Progress value={progressPercentage} className="h-3 bg-muted/50" />
							<div className="flex items-center gap-2 text-xs text-muted-foreground">
								<div className="w-1.5 h-1.5 bg-primary rounded-full" />
								<span>Step {currentStepIndex + 1} of {workflowSteps.length}</span>
							</div>
						</div>
					</div>
					<SidebarMenu>
						<div className="space-y-1">
							{workflowSteps.map((step, index) => {
								const isActive = workflowState.currentStep === step.id
								const isCompleted = isStepCompleted(step.id)
								const isAccessible = isStepAccessible(step.id)
								return (
									<SidebarMenuItem key={step.id}>
										<SidebarMenuButton
											onClick={() => isAccessible ? navigateToStep(step.id) : null}
											isActive={isActive}
											className={`w-full justify-start p-3 h-auto transition-all duration-200 ${!isAccessible ? 'opacity-50 cursor-not-allowed' : ''} ${isActive ? 'bg-gradient-to-r from-primary/10 to-accent/5 border-l-2 border-primary' : ''}`}
											disabled={!isAccessible}
										>
											<div className="flex items-start gap-2.5 w-full">
												<div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[11px] transition-all duration-200 ${isCompleted ? 'bg-primary border-primary text-white shadow-md' : isActive ? 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25' : 'border-muted-foreground/40 bg-background'}`}>
													{isCompleted ? (
														<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
													) : (
														<span className="text-xs font-medium">{index + 1}</span>
													)}
												</div>
												<div className="flex-1 text-left">
													<div className="flex items-center gap-2">
														<step.icon className="h-4 w-4" />
														<span className="font-medium text-sm">{step.label}</span>
													</div>
													<p className="text-xs text-muted-foreground mt-1 leading-tight">{step.description}</p>
												</div>
											</div>
										</SidebarMenuButton>
									</SidebarMenuItem>
								)
							})}
						</div>
					</SidebarMenu>
					<div className="mt-6 pt-4 border-t border-primary/10">
						<Collapsible open={showAdvancedSettings} onOpenChange={setShowAdvancedSettings}>
							<CollapsibleTrigger asChild>
								<SidebarMenuButton className="w-full justify-between hover:bg-primary/5 transition-colors">
									<div className="flex items-center gap-2">
										<Settings className="h-4 w-4 text-primary" />
										<span className="font-medium">Advanced Settings</span>
									</div>
									<ChevronDown className={`h-4 w-4 transition-transform text-primary ${showAdvancedSettings ? 'rotate-180' : ''}`} />
								</SidebarMenuButton>
							</CollapsibleTrigger>
							<CollapsibleContent className="mt-2">
								<div className="p-3 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg border border-primary/10">
									<p className="text-xs text-muted-foreground mb-2">Configure AI model parameters, processing options, and export settings for optimized pharmaceutical workflows</p>
									<Badge variant="outline" className="text-xs border-primary/20 text-primary">Optional Configuration</Badge>
								</div>
							</CollapsibleContent>
						</Collapsible>
					</div>
				</SidebarContent>
			</Sidebar>
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-gradient-to-r from-background to-accent/10 relative z-20">
					<SidebarTrigger className="-ml-1" />
					<div className="flex items-center gap-2 flex-1">
						<div className="flex items-center gap-3">
							{(() => {
								const stepInfo = getCurrentStepInfo()
								const IconComponent = stepInfo?.icon
								return IconComponent ? (
									<div className="p-2 bg-primary/10 rounded-lg">
										<IconComponent className="h-5 w-5 text-primary" />
									</div>
								) : null
							})()}
							<div>
								<h2 className="font-semibold text-lg">{workflowState.currentStep === 'complete' ? 'Workflow Complete' : getCurrentStepInfo()?.label || 'AI Workflow Automation'}</h2>
								{workflowState.currentStep !== 'complete' && getCurrentStepInfo() && (
									<p className="text-xs text-muted-foreground">{getCurrentStepInfo()?.description}</p>
								)}
							</div>
						</div>
					</div>
					{workflowState.currentStep !== 'complete' && (
						<div className="flex items-center gap-2">
							<Button variant="outline" size="sm" onClick={goToPreviousStep} disabled={currentStepIndex === 0} className="gap-1 border-primary/20 hover:bg-primary/5 hover:border-primary/40"><ChevronLeft className="h-3 w-3" /> Previous</Button>
							<Button size="sm" onClick={goToNextStep} className="gap-1 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">{currentStepIndex === workflowSteps.length - 1 ? 'Complete' : 'Next'} <ChevronRight className="h-3 w-3" /></Button>
						</div>
					)}
				</header>
				<main className="flex-1 bg-gradient-to-br from-background via-background to-accent/5 p-6">{showAdvancedSettings ? <AdvancedSettings /> : renderStepContent()}</main>
			</SidebarInset>
		</SidebarProvider>
	)
}
