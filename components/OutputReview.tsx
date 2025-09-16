"use client"
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { TableProperties, Download, Eye, CheckCircle, AlertTriangle, FileSpreadsheet, FileText, ArrowRight, Zap } from 'lucide-react'

interface OutputReviewProps {
  onNext?: () => void
  onPrevious?: () => void
  workflowState?: any
  updateWorkflowState?: (state: any) => void
}

interface OutputRow {
  id: string
  requirement: string
  entity: string
  mapping: string
  confidence: number
  status: 'mapped' | 'extended' | 'mismatch'
  notes?: string
  approved?: boolean
}

interface SheetData {
  name: string
  rows: OutputRow[]
  summary: { total: number; mapped: number; extended: number; mismatches: number }
}

export function OutputReview({ onNext, updateWorkflowState }: OutputReviewProps) {
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [reviewNotes, setReviewNotes] = useState('')
  const [outputApproved, setOutputApproved] = useState(false)

  const mockSheetData: SheetData[] = [
    { name: 'Structural Requirements', rows: [
      { id: 'sr1', requirement: 'Load Bearing Capacity - 50 tons', entity: 'Structural Framework', mapping: 'Direct Match', confidence: 95, status: 'mapped', notes: 'Perfect alignment with core structural specifications', approved: true },
      { id: 'sr2', requirement: 'Seismic Resistance Class C', entity: 'Foundation System', mapping: 'Indirect Match', confidence: 85, status: 'mapped', notes: 'Foundation provides seismic stability support' },
      { id: 'sr3', requirement: 'Wind Load 120 mph', entity: 'Structural Framework (Extended)', mapping: 'Extended Mapping', confidence: 78, status: 'extended', notes: 'Added wind resistance specifications to existing framework' }
    ], summary: { total: 3, mapped: 2, extended: 1, mismatches: 0 } },
    { name: 'Safety & Compliance', rows: [
      { id: 'sc1', requirement: 'Fire Rating Class A', entity: 'Safety Systems', mapping: 'Direct Match', confidence: 98, status: 'mapped', notes: 'Exact match with fire safety specifications', approved: true },
      { id: 'sc2', requirement: 'Emergency Egress - 4 exits', entity: 'Safety Systems', mapping: 'Partial Match', confidence: 65, status: 'mismatch', notes: 'Current model specifies 2 exits, requirement needs 4' },
      { id: 'sc3', requirement: 'ADA Compliance Level AA', entity: 'Accessibility System (New)', mapping: 'New Entity', confidence: 90, status: 'extended', notes: 'Created new accessibility system entity' }
    ], summary: { total: 3, mapped: 1, extended: 1, mismatches: 1 } },
    { name: 'Environmental', rows: [
      { id: 'env1', requirement: 'Carbon Footprint Reduction 25%', entity: 'HVAC System', mapping: 'Indirect Match', confidence: 72, status: 'mapped', notes: 'Energy-efficient HVAC contributes to carbon reduction' },
      { id: 'env2', requirement: 'Renewable Energy Integration', entity: 'Power Management System (New)', mapping: 'New Entity', confidence: 88, status: 'extended', notes: 'Created dedicated renewable energy management system' }
    ], summary: { total: 2, mapped: 1, extended: 1, mismatches: 0 } }
  ]

  const [sheets, setSheets] = useState(mockSheetData)
  const [currentSheet, setCurrentSheet] = useState(0)

  const getStatusColor = (status: OutputRow['status']) => ({ mapped: 'default', extended: 'secondary', mismatch: 'destructive' }[status] as 'default' | 'secondary' | 'destructive')
  const getStatusIcon = (status: OutputRow['status']) => ({
    mapped: <CheckCircle className="h-4 w-4 text-green-500" />,
    extended: <Eye className="h-4 w-4 text-blue-500" />,
    mismatch: <AlertTriangle className="h-4 w-4 text-red-500" />
  }[status])

  const handleRowApproval = (rowId: string, approved: boolean) => setSheets(sheets.map(s => ({ ...s, rows: s.rows.map(r => r.id === rowId ? { ...r, approved } : r) })))
  const handleSelectRow = (rowId: string) => setSelectedRows(prev => prev.includes(rowId) ? prev.filter(id => id !== rowId) : [...prev, rowId])
  const handleApproveSelected = () => { setSheets(sheets.map(s => ({ ...s, rows: s.rows.map(r => selectedRows.includes(r.id) ? { ...r, approved: true } : r) }))); setSelectedRows([]) }
  const handleRejectSelected = () => { setSheets(sheets.map(s => ({ ...s, rows: s.rows.map(r => selectedRows.includes(r.id) ? { ...r, approved: false } : r) }))); setSelectedRows([]) }

  const totalSummary = sheets.reduce((acc, s) => ({ total: acc.total + s.summary.total, mapped: acc.mapped + s.summary.mapped, extended: acc.extended + s.summary.extended, mismatches: acc.mismatches + s.summary.mismatches }), { total: 0, mapped: 0, extended: 0, mismatches: 0 })
  const approvedCount = sheets.reduce((acc, s) => acc + s.rows.filter(r => r.approved).length, 0)

  const handleExportApproval = () => {
    setOutputApproved(true)
    updateWorkflowState?.((prev: any) => ({ ...prev, outputApproved: true }))
  }

  return (
    <div className="space-y-6">
      <Alert>
        <Zap className="h-4 w-4" />
        <AlertDescription><strong>Step 4:</strong> Review the AI-generated output, approve or reject mappings, and export your final Excel file.</AlertDescription>
      </Alert>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[{ label: 'Total Items', value: totalSummary.total }, { label: 'Mapped', value: totalSummary.mapped, className: 'text-green-600' }, { label: 'Extended', value: totalSummary.extended, className: 'text-blue-600' }, { label: 'Mismatches', value: totalSummary.mismatches, className: 'text-red-600' }, { label: 'Approved', value: approvedCount, className: 'text-purple-600' }].map(stat => (
          <Card key={stat.label}><CardContent className="p-4 text-center"><div className={`text-2xl font-bold ${stat.className || ''}`}>{stat.value}</div><div className="text-sm text-muted-foreground">{stat.label}</div></CardContent></Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><TableProperties className="h-5 w-5" />Generated Output Review</CardTitle>
          <CardDescription>Review and approve the AI-generated Excel output before final export</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={sheets[currentSheet]?.name} onValueChange={v => { const idx = sheets.findIndex(s => s.name === v); if (idx !== -1) setCurrentSheet(idx) }}>
            <TabsList className="w-full justify-start">
              {sheets.map(sheet => (
                <TabsTrigger key={sheet.name} value={sheet.name} className="gap-1"><FileSpreadsheet className="h-3 w-3" />{sheet.name}<Badge variant="outline" className="ml-1 text-xs">{sheet.summary.total}</Badge></TabsTrigger>
              ))}
            </TabsList>
            {sheets.map(sheet => (
              <TabsContent key={sheet.name} value={sheet.name} className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm"><div className="w-2 h-2 bg-green-500 rounded-full" /><span>{sheet.summary.mapped} Mapped</span></div>
                  <div className="flex items-center gap-2 text-sm"><div className="w-2 h-2 bg-blue-500 rounded-full" /><span>{sheet.summary.extended} Extended</span></div>
                  <div className="flex items-center gap-2 text-sm"><div className="w-2 h-2 bg-red-500 rounded-full" /><span>{sheet.summary.mismatches} Mismatches</span></div>
                </div>
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12"><Checkbox checked={selectedRows.length === sheet.rows.length} onCheckedChange={checked => { if (checked) setSelectedRows(sheet.rows.map(r => r.id)); else setSelectedRows([]) }} /></TableHead>
                        <TableHead>Requirement</TableHead>
                        <TableHead>Entity</TableHead>
                        <TableHead>Mapping</TableHead>
                        <TableHead>Confidence</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Approved</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sheet.rows.map(row => (
                        <TableRow key={row.id} className={selectedRows.includes(row.id) ? 'bg-muted/50' : ''}>
                          <TableCell><Checkbox checked={selectedRows.includes(row.id)} onCheckedChange={() => handleSelectRow(row.id)} /></TableCell>
                          <TableCell className="font-medium">{row.requirement}</TableCell>
                          <TableCell>{row.entity}</TableCell>
                          <TableCell>{row.mapping}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-muted rounded-full h-2"><div className="h-full bg-primary rounded-full" style={{ width: `${row.confidence}%` }} /></div>
                              <span className="text-sm">{row.confidence}%</span>
                            </div>
                          </TableCell>
                          <TableCell><div className="flex items-center gap-2">{getStatusIcon(row.status)}<Badge variant={getStatusColor(row.status)}>{row.status}</Badge></div></TableCell>
                          <TableCell><Checkbox checked={row.approved === true} onCheckedChange={checked => handleRowApproval(row.id, checked as boolean)} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Bulk Actions</CardTitle><CardDescription>Manage multiple items at once</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleApproveSelected} disabled={selectedRows.length === 0} className="gap-2"><CheckCircle className="h-4 w-4" />Approve Selected ({selectedRows.length})</Button>
            <Button variant="outline" onClick={handleRejectSelected} disabled={selectedRows.length === 0} className="gap-2"><AlertTriangle className="h-4 w-4" />Reject Selected ({selectedRows.length})</Button>
          </div>
          <div className="space-y-2"><Label htmlFor="review-notes">Review Notes</Label><Textarea id="review-notes" value={reviewNotes} onChange={e => setReviewNotes(e.target.value)} placeholder="Add notes about this review session..." className="min-h-[100px]" /></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Export Options</CardTitle><CardDescription>Download the reviewed output in your preferred format</CardDescription></CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button className="gap-2" onClick={handleExportApproval}><Download className="h-4 w-4" />Export to Excel</Button>
            <Button variant="outline" className="gap-2"><FileText className="h-4 w-4" />Export to CSV</Button>
            <Button variant="outline" className="gap-2"><FileText className="h-4 w-4" />Generate Report</Button>
          </div>
          <div className="mt-4 p-3 bg-muted/50 rounded-lg"><p className="text-sm"><strong>Export Summary:</strong> {approvedCount} of {totalSummary.total} items approved • {totalSummary.mismatches} items need attention • {totalSummary.extended} items extended the core model</p></div>
        </CardContent>
      </Card>
      {outputApproved && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800"><CardContent className="p-6"><div className="flex items-center justify-between"><div><h3 className="font-semibold text-green-800 dark:text-green-200">Ready to Complete</h3><p className="text-sm text-green-600 dark:text-green-300">Output approved and exported successfully.</p></div><Button onClick={onNext} className="gap-2">Complete Workflow<ArrowRight className="h-4 w-4" /></Button></div></CardContent></Card>
      )}
    </div>
  )
}
