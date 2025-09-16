"use client"
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { GitBranch, Plus, Link2, Unlink, Edit2, Target, FileText, ArrowRight, Zap } from 'lucide-react'

interface MappingToolProps {
  onNext?: () => void
  onPrevious?: () => void
  workflowState?: any
  updateWorkflowState?: (state: any) => void
}

interface Requirement {
  id: string
  title: string
  description: string
  category: string
  priority: 'high' | 'medium' | 'low'
  mappedTo?: string[]
}

interface CoreEntity {
  id: string
  name: string
  type: string
  description: string
  attributes: string[]
  mappedFrom?: string[]
}

interface Mapping {
  requirementId: string
  entityId: string
  confidence: number
  notes?: string
}

export function MappingTool({ onNext }: MappingToolProps) {
  const [selectedRequirement, setSelectedRequirement] = useState<string | null>(null)
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null)
  const [isAddEntityDialogOpen, setIsAddEntityDialogOpen] = useState(false)

  const mockRequirements: Requirement[] = [
    { id: 'req1', title: 'Load Bearing Capacity', description: 'Structure must support minimum 50 tons distributed load', category: 'Structural', priority: 'high', mappedTo: ['entity1', 'entity2'] },
    { id: 'req2', title: 'Fire Safety Compliance', description: 'Must meet Class A fire rating standards', category: 'Safety', priority: 'high', mappedTo: ['entity3'] },
    { id: 'req3', title: 'Environmental Impact', description: 'Carbon footprint reduction of 25%', category: 'Environmental', priority: 'medium' },
    { id: 'req4', title: 'Accessibility Standards', description: 'ADA compliant access requirements', category: 'Compliance', priority: 'high' }
  ]

  const mockEntities: CoreEntity[] = [
    { id: 'entity1', name: 'Structural Framework', type: 'Component', description: 'Primary load-bearing structure definition', attributes: ['Material Type', 'Load Capacity', 'Dimensions', 'Safety Factor'], mappedFrom: ['req1'] },
    { id: 'entity2', name: 'Foundation System', type: 'Component', description: 'Foundation and ground support structure', attributes: ['Depth', 'Material', 'Load Distribution', 'Soil Type'], mappedFrom: ['req1'] },
    { id: 'entity3', name: 'Safety Systems', type: 'System', description: 'Fire safety and emergency systems', attributes: ['Fire Rating', 'Sprinkler System', 'Exit Routes', 'Alarm System'], mappedFrom: ['req2'] },
    { id: 'entity4', name: 'HVAC System', type: 'System', description: 'Heating, ventilation, and air conditioning', attributes: ['Capacity', 'Energy Efficiency', 'Zone Control', 'Filtration'] }
  ]

  const [requirements, setRequirements] = useState(mockRequirements)
  const [entities, setEntities] = useState(mockEntities)
  const [mappings, setMappings] = useState<Mapping[]>([
    { requirementId: 'req1', entityId: 'entity1', confidence: 95, notes: 'Direct structural requirement mapping' },
    { requirementId: 'req1', entityId: 'entity2', confidence: 85, notes: 'Foundation supports structural load' },
    { requirementId: 'req2', entityId: 'entity3', confidence: 98, notes: 'Perfect match for fire safety systems' }
  ])

  const [newEntityName, setNewEntityName] = useState('')
  const [newEntityType, setNewEntityType] = useState('')
  const [newEntityDescription, setNewEntityDescription] = useState('')

  const createMapping = () => {
    if (selectedRequirement && selectedEntity) {
      const newMapping: Mapping = { requirementId: selectedRequirement, entityId: selectedEntity, confidence: 80, notes: 'Manual mapping created' }
      setMappings([...mappings, newMapping])
      setRequirements(reqs => reqs.map(r => r.id === selectedRequirement ? { ...r, mappedTo: [...(r.mappedTo || []), selectedEntity] } : r))
      setEntities(ents => ents.map(e => e.id === selectedEntity ? { ...e, mappedFrom: [...(e.mappedFrom || []), selectedRequirement] } : e))
      setSelectedRequirement(null)
      setSelectedEntity(null)
    }
  }

  const removeMapping = (reqId: string, entId: string) => {
    setMappings(mappings.filter(m => !(m.requirementId === reqId && m.entityId === entId)))
    setRequirements(reqs => reqs.map(r => r.id === reqId ? { ...r, mappedTo: r.mappedTo?.filter(id => id !== entId) } : r))
    setEntities(ents => ents.map(e => e.id === entId ? { ...e, mappedFrom: e.mappedFrom?.filter(id => id !== reqId) } : e))
  }

  const addNewEntity = () => {
    if (!newEntityName) return
    const newEntity: CoreEntity = { id: `entity${Date.now()}`, name: newEntityName, type: newEntityType, description: newEntityDescription, attributes: [] }
    setEntities([...entities, newEntity])
    setIsAddEntityDialogOpen(false)
    setNewEntityName('')
    setNewEntityType('')
    setNewEntityDescription('')
  }

  const getPriorityColor = (priority: Requirement['priority']) => {
    switch (priority) {
      case 'high': return 'destructive'
      case 'medium': return 'secondary'
      case 'low': return 'outline'
    }
  }

  const mappingProgress = mappings.length > 0

  return (
    <div className="space-y-6">
      <Alert>
        <Zap className="h-4 w-4" />
        <AlertDescription><strong>Step 3:</strong> Create visual mappings between your site requirements and core model entities.</AlertDescription>
      </Alert>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><GitBranch className="h-5 w-5" />Interactive Mapping Tool</CardTitle>
          <CardDescription>Map site-specific requirements to core model entities with visual connections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full" /><span className="text-sm">Requirements ({requirements.length})</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-full" /><span className="text-sm">Core Entities ({entities.length})</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-purple-500 rounded-full" /><span className="text-sm">Mappings ({mappings.length})</span></div>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-blue-500" />Site Requirements</CardTitle>
            <CardDescription>Select requirements to map to core model entities</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {requirements.map(req => (
                  <div key={req.id} className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedRequirement === req.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : 'hover:border-blue-300'}`} onClick={() => setSelectedRequirement(req.id)}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{req.title}</h4>
                      <Badge variant={getPriorityColor(req.priority)} className="text-xs">{req.priority}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{req.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">{req.category}</Badge>
                      {req.mappedTo && req.mappedTo.length > 0 && <div className="flex items-center gap-1"><Link2 className="h-3 w-3 text-green-500" /><span className="text-xs text-green-600">{req.mappedTo.length} mapped</span></div>}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2"><Target className="h-5 w-5 text-green-500" />Core Model Entities</CardTitle>
              <Dialog open={isAddEntityDialogOpen} onOpenChange={setIsAddEntityDialogOpen}>
                <DialogTrigger asChild><Button variant="outline" size="sm" className="gap-1"><Plus className="h-3 w-3" />Add Entity</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Core Entity</DialogTitle>
                    <DialogDescription>Create a new entity in the core model</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2"><Label htmlFor="entity-name">Entity Name</Label><Input id="entity-name" value={newEntityName} onChange={e => setNewEntityName(e.target.value)} placeholder="Enter entity name" /></div>
                    <div className="space-y-2"><Label htmlFor="entity-type">Type</Label><Input id="entity-type" value={newEntityType} onChange={e => setNewEntityType(e.target.value)} placeholder="Component, System, Process, etc." /></div>
                    <div className="space-y-2"><Label htmlFor="entity-description">Description</Label><Textarea id="entity-description" value={newEntityDescription} onChange={e => setNewEntityDescription(e.target.value)} placeholder="Describe the entity's purpose and functionality" /></div>
                  </div>
                  <DialogFooter><Button variant="outline" onClick={() => setIsAddEntityDialogOpen(false)}>Cancel</Button><Button onClick={addNewEntity}>Add Entity</Button></DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <CardDescription>Select entities to map from requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {entities.map(ent => (
                  <div key={ent.id} className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedEntity === ent.id ? 'border-green-500 bg-green-50 dark:bg-green-950' : 'hover:border-green-300'}`} onClick={() => setSelectedEntity(ent.id)}>
                    <div className="flex items-start justify-between mb-2"><h4 className="font-medium">{ent.name}</h4><Badge variant="secondary" className="text-xs">{ent.type}</Badge></div>
                    <p className="text-sm text-muted-foreground mb-2">{ent.description}</p>
                    <div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">{ent.attributes.length} attributes</span>{ent.mappedFrom && ent.mappedFrom.length > 0 && <div className="flex items-center gap-1"><Link2 className="h-3 w-3 text-green-500" /><span className="text-xs text-green-600">{ent.mappedFrom.length} mapped</span></div>}</div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Mapping Actions</CardTitle>
          <CardDescription>Create and manage connections between requirements and entities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Button onClick={createMapping} disabled={!selectedRequirement || !selectedEntity} className="gap-2"><Link2 className="h-4 w-4" />Create Mapping</Button>
            <div className="text-sm text-muted-foreground">{selectedRequirement && selectedEntity ? `Map "${requirements.find(r => r.id === selectedRequirement)?.title}" to "${entities.find(e => e.id === selectedEntity)?.name}"` : 'Select a requirement and entity to create mapping'}</div>
          </div>
          <Separator className="my-4" />
          <div className="space-y-3">
            <h4 className="font-medium">Active Mappings</h4>
            {mappings.map(m => {
              const req = requirements.find(r => r.id === m.requirementId)
              const ent = entities.find(e => e.id === m.entityId)
              return (
                <div key={`${m.requirementId}-${m.entityId}`} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    <div>
                      <p className="font-medium">{req?.title} → {ent?.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground"><span>Confidence: {m.confidence}%</span>{m.notes && <span>• {m.notes}</span>}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm"><Edit2 className="h-3 w-3" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => removeMapping(m.requirementId, m.entityId)}><Unlink className="h-3 w-3" /></Button>
                  </div>
                </div>
              )
            })}
            {mappings.length === 0 && <p className="text-center text-muted-foreground py-8">No mappings created yet.</p>}
          </div>
        </CardContent>
      </Card>
      {mappingProgress && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-green-800 dark:text-green-200">Mapping Complete</h3>
                <p className="text-sm text-green-600 dark:text-green-300">{mappings.length} mapping{mappings.length === 1 ? '' : 's'} created successfully.</p>
              </div>
              <Button onClick={onNext} className="gap-2">Continue to Review<ArrowRight className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
