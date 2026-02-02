'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { seasonPlanAPI } from '@/lib/api'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Accordion } from '@/components/ui/accordion'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertCircle, Upload } from 'lucide-react'
import DeleteConfirmationDialog from './dialogs/DeleteConfirmationDialog'
import StageImplementationDialog from './dialogs/StageImplementationDialog'
import FertilizerImplementationDialog from './dialogs/FertilizerImplementationDialog'
import { SeasonPlanHeader } from './sections/SeasonPlanHeader'
import { GrowingStagesSection } from './sections/GrowingStagesSection'
import { FertilizerScheduleSection } from './sections/FertilizerScheduleSection'
import { ExpensesSection } from './sections/ExpensesSection'
import { DailyRemarksSection } from './sections/DailyRemarksSection'
import {
  formatDate as utilFormatDate,
  getStatusColor,
  calculateTotalExpenses,
  getCompletedStages,
  getProgressPercentage,
  getCategoryIcon,
  generateYouTubeSearchLink,
  calculatePlantAge as utilCalculatePlantAge,
  calculateUreaRecommendation as utilCalculateUreaRecommendation,
} from './utils/seasonPlanHelpers'
import { SeasonPlan } from '@/types/SeasonPlan'

interface SeasonPlanDetailContentProps {
  planId: string
}

export function SeasonPlanDetailContent({ planId }: SeasonPlanDetailContentProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const [plan, setPlan] = useState<SeasonPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Dialog states
  const [stageDialog, setStageDialog] = useState({ open: false, index: -1 })
  const [fertilizerDialog, setFertilizerDialog] = useState({ open: false, index: -1 })
  const [lccDialog, setLccDialog] = useState(false)
  const [harvestDialog, setHarvestDialog] = useState(false)
  const [expenseDialog, setExpenseDialog] = useState(false)
  const [remarkDialog, setRemarkDialog] = useState(false)

  // Delete states
  const [deletingFertilizer, setDeletingFertilizer] = useState(false)
  const [fertilizerToDelete, setFertilizerToDelete] = useState(-1)
  const [deletingExpense, setDeletingExpense] = useState(false)
  const [expenseToDelete, setExpenseToDelete] = useState(-1)
  const [deletingRemark, setDeletingRemark] = useState(false)
  const [remarkToDelete, setRemarkToDelete] = useState(-1)

  // Edit indices
  const [editingExpense, setEditingExpense] = useState<number>(-1)
  const [editingRemark, setEditingRemark] = useState<number>(-1)

  // Form data states
  const [stageImplementationData, setStageImplementationData] = useState({
    implementedDate: '',
    implementedEndDate: '',
    notes: '',
  })

  const [fertilizerImplementationData, setFertilizerImplementationData] = useState({
    appliedDate: '',
    notes: '',
  })

  const [lccData, setLccData] = useState({
    currentDate: new Date().toISOString().split('T')[0],
    leafColorIndex: 3,
    recommendedUrea: 0,
  })

  const [harvestData, setHarvestData] = useState({
    harvestDate: '',
    actualYield: '',
    quality: '',
    notes: '',
  })

  const [expenseData, setExpenseData] = useState({
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: '',
  })

  const [remarkData, setRemarkData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: '',
    title: '',
    description: '',
    images: [] as File[],
  })

  const [uploadingImages, setUploadingImages] = useState(false)

  // Helper functions wrapped for consistent signature
  const formatDate = (date: string) => utilFormatDate(date, t)
  const calculatePlantAge = () => utilCalculatePlantAge(plan?.cultivationDate || '')
  const calculateUreaRecommendation = (leafColorIndex: number, plantAge: number) =>
    utilCalculateUreaRecommendation(leafColorIndex, plantAge)

  // Load season plan
  const loadSeasonPlan = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await seasonPlanAPI.getSeasonPlan(planId)
      const planData = response.data.data || response.data

      // Transform backend field names
      if (planData.growingStages) {
        planData.growingStages = planData.growingStages.map((stage: {
          completed?: boolean
          isCompleted?: boolean
          implementedDate?: string
          actualStartDate?: string
          implementedEndDate?: string
          actualEndDate?: string
          notes?: string
          implementationNotes?: string
          [key: string]: unknown
        }) => ({
          ...stage,
          isCompleted: stage.completed ?? stage.isCompleted ?? false,
          implementedDate: stage.implementedDate ?? stage.actualStartDate,
          implementedEndDate: stage.implementedEndDate ?? stage.actualEndDate,
          implementationNotes: stage.notes ?? stage.implementationNotes,
        }))
      }

      setPlan(planData)
    } catch (err) {
      console.error('Error loading season plan:', err)
      setError(t('seasonPlans.errors.loadFailed'))
      toast.error(t('seasonPlans.errors.loadFailed'))
    } finally {
      setLoading(false)
    }
  }, [planId, t])

  useEffect(() => {
    if (planId) {
      loadSeasonPlan()
    }
  }, [planId, loadSeasonPlan])

  const handleDelete = async () => {
    try {
      await seasonPlanAPI.deleteSeasonPlan(planId)
      toast.success(t('seasonPlans.success.deleted'))
      router.push('/season-plans')
    } catch (err) {
      console.error('Error deleting season plan:', err)
      toast.error(t('seasonPlans.errors.deleteFailed'))
    } finally {
      setDeleteDialogOpen(false)
    }
  }

  // Stage implementation handlers
  const openStageDialog = (index: number) => {
    const stage = plan?.growingStages?.[index]
    if (stage) {
      setStageDialog({ open: true, index })
      setStageImplementationData({
        implementedDate: stage.implementedDate || new Date().toISOString().split('T')[0],
        implementedEndDate: stage.implementedEndDate || '',
        notes: stage.implementationNotes || '',
      })
    }
  }

  const saveStageImplementation = async () => {
    if (!plan || stageDialog.index < 0) return

    try {
      const updatedStages = [...(plan.growingStages || [])]
      updatedStages[stageDialog.index] = {
        ...updatedStages[stageDialog.index],
        isCompleted: true,
        implementedDate: stageImplementationData.implementedDate,
        implementedEndDate: stageImplementationData.implementedEndDate,
        implementationNotes: stageImplementationData.notes,
      }

      await seasonPlanAPI.updateSeasonPlan(planId, {
        ...plan,
        growingStages: updatedStages,
      })

      setPlan({ ...plan, growingStages: updatedStages })
      setStageDialog({ open: false, index: -1 })
      toast.success(t(stageDialog.index >= 0 ? 'seasonPlans.stageUpdated' : 'seasonPlans.stageMarkedComplete'))
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error.response?.data?.message || t('common.error'))
    }
  }

  // Fertilizer implementation handlers
  const openFertilizerDialog = (index: number) => {
    const app = plan?.fertilizerSchedule?.[index]
    if (app) {
      setFertilizerDialog({ open: true, index })
      setFertilizerImplementationData({
        appliedDate: app.implementedDate || new Date().toISOString().split('T')[0],
        notes: app.notes || '',
      })
    }
  }

  const saveFertilizerImplementation = async () => {
    if (!plan || fertilizerDialog.index < 0) return

    try {
      const updatedSchedule = [...(plan.fertilizerSchedule || [])]
      updatedSchedule[fertilizerDialog.index] = {
        ...updatedSchedule[fertilizerDialog.index],
        applied: true,
        implementedDate: fertilizerImplementationData.appliedDate,
        notes: fertilizerImplementationData.notes,
      }

      await seasonPlanAPI.updateSeasonPlan(planId, {
        ...plan,
        fertilizerSchedule: updatedSchedule,
      })

      setPlan({ ...plan, fertilizerSchedule: updatedSchedule })
      setFertilizerDialog({ open: false, index: -1 })
      toast.success(t('seasonPlans.fertilizerMarkedApplied'))
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error.response?.data?.message || t('common.error'))
    }
  }

  const deleteFertilizerApplication = async (index: number) => {
    setFertilizerToDelete(index)
    setDeletingFertilizer(true)
  }

  const confirmDeleteFertilizer = async () => {
    if (!plan || fertilizerToDelete < 0) return

    try {
      const updatedSchedule = (plan.fertilizerSchedule || []).filter((_, i) => i !== fertilizerToDelete)

      await seasonPlanAPI.updateSeasonPlan(planId, {
        ...plan,
        fertilizerSchedule: updatedSchedule,
      })

      setPlan({ ...plan, fertilizerSchedule: updatedSchedule })
      setDeletingFertilizer(false)
      setFertilizerToDelete(-1)
      toast.success(t('seasonPlans.fertilizerDeleted'))
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error.response?.data?.message || t('common.error'))
    }
  }

  // LCC Calculator handlers
  const handleLeafColorCalculation = () => {
    const plantAge = calculatePlantAge()
    const recommendedUrea = calculateUreaRecommendation(lccData.leafColorIndex, plantAge)
    setLccData({ ...lccData, recommendedUrea })
  }

  const saveLCCFertilizerApplication = async () => {
    if (!plan || lccData.recommendedUrea === 0) return

    try {
      const newApplication = {
        stage: `LCC-based Application (Day ${calculatePlantAge()})`,
        date: lccData.currentDate,
        description: `Based on leaf color reading of ${lccData.leafColorIndex}`,
        fertilizers: {
          urea: parseFloat(((lccData.recommendedUrea * (Number(plan.cultivatingArea) || 0)) / (plan.areaUnit === 'hectare' ? 1 : 0.4047)).toFixed(2)),
        },
        fertilizerType: 'urea',
        quantity: lccData.recommendedUrea,
        unit: 'kg',
        applied: false,
        notes: `Auto-generated from LCC calculator`,
      }

      const updatedSchedule = [...(plan.fertilizerSchedule || []), newApplication]

      await seasonPlanAPI.updateSeasonPlan(planId, {
        ...plan,
        fertilizerSchedule: updatedSchedule,
      })

      setPlan({ ...plan, fertilizerSchedule: updatedSchedule })
      setLccDialog(false)
      toast.success(t('seasonPlans.fertilizerAdded'))
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error.response?.data?.message || t('common.error'))
    }
  }

  // Harvest handlers
  const openHarvestDialog = () => {
    const allStagesComplete = plan?.growingStages?.every((s) => s.isCompleted) || false
    if (!allStagesComplete) {
      toast.warning(t('seasonPlans.completeAllStagesFirst'))
      return
    }
    setHarvestDialog(true)
    setHarvestData({
      harvestDate: new Date().toISOString().split('T')[0],
      actualYield: '',
      quality: '',
      notes: '',
    })
  }

  const saveHarvestData = async () => {
    if (!plan) return

    try {
      await seasonPlanAPI.updateSeasonPlan(planId, {
        ...plan,
        actualHarvestDate: harvestData.harvestDate,
        actualYield: parseFloat(harvestData.actualYield),
        harvestQuality: harvestData.quality,
        harvestNotes: harvestData.notes,
        status: 'completed',
      })

      await loadSeasonPlan()
      setHarvestDialog(false)
      toast.success(t('seasonPlans.harvestRecorded'))
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error.response?.data?.message || t('common.error'))
    }
  }

  // Expense handlers
  const openExpenseDialog = (index: number = -1) => {
    if (index >= 0 && plan?.expenses?.[index]) {
      const expense = plan.expenses[index]
      setEditingExpense(index)
      setExpenseData({
        category: expense.category,
        amount: expense.amount.toString(),
        description: expense.description || '',
        date: expense.date,
        paymentMethod: expense.paymentMethod || '',
      })
    } else {
      setEditingExpense(-1)
      setExpenseData({
        category: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: '',
      })
    }
    setExpenseDialog(true)
  }

  const saveExpense = async () => {
    if (!plan) return

    try {
      const newExpense = {
        category: expenseData.category,
        amount: parseFloat(expenseData.amount),
        description: expenseData.description,
        date: expenseData.date,
      }

      let updatedExpenses
      if (editingExpense >= 0) {
        updatedExpenses = [...(plan.expenses || [])]
        updatedExpenses[editingExpense] = newExpense
      } else {
        updatedExpenses = [...(plan.expenses || []), newExpense]
      }

      await seasonPlanAPI.updateSeasonPlan(planId, {
        ...plan,
        expenses: updatedExpenses,
      })

      setPlan({ ...plan, expenses: updatedExpenses })
      setExpenseDialog(false)
      toast.success(t(editingExpense >= 0 ? 'seasonPlans.expenseUpdated' : 'seasonPlans.expenseAdded'))
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error.response?.data?.message || t('common.error'))
    }
  }

  const deleteExpense = async (index: number) => {
    setExpenseToDelete(index)
    setDeletingExpense(true)
  }

  const confirmDeleteExpense = async () => {
    if (!plan || expenseToDelete < 0) return

    try {
      const updatedExpenses = (plan.expenses || []).filter((_, i) => i !== expenseToDelete)

      await seasonPlanAPI.updateSeasonPlan(planId, {
        ...plan,
        expenses: updatedExpenses,
      })

      setPlan({ ...plan, expenses: updatedExpenses })
      setDeletingExpense(false)
      setExpenseToDelete(-1)
      toast.success(t('seasonPlans.expenseDeleted'))
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error.response?.data?.message || t('common.error'))
    }
  }

  // Remark handlers
  const openRemarkDialog = (index: number = -1) => {
    if (index >= 0 && plan?.dailyRemarks?.[index]) {
      const remark = plan.dailyRemarks[index]
      setEditingRemark(index)
      setRemarkData({
        date: remark.date,
        category: remark.category || '',
        title: remark.title || '',
        description: remark.description || remark.remark || '',
        images: [], // New images to upload (existing images are preserved on backend)
      })
    } else {
      setEditingRemark(-1)
      setRemarkData({
        date: new Date().toISOString().split('T')[0],
        category: '',
        title: '',
        description: '',
        images: [],
      })
    }
    setRemarkDialog(true)
  }

  const handleRemarkImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setRemarkData({ ...remarkData, images: Array.from(e.target.files) })
    }
  }

  const saveRemark = async () => {
    if (!plan) return

    // Validate required fields
    if (!remarkData.date || !remarkData.description.trim()) {
      toast.error(t('seasonPlans.remarkValidationError') || 'Date and description are required')
      return
    }

    try {
      setUploadingImages(true)

      // Create FormData with all remark fields
      const formData = new FormData()
      formData.append('date', remarkData.date)
      // Only append category and title if they have values
      if (remarkData.category && remarkData.category.trim()) {
        formData.append('category', remarkData.category.trim())
      }
      if (remarkData.title && remarkData.title.trim()) {
        formData.append('title', remarkData.title.trim())
      }
      formData.append('description', remarkData.description.trim())

      // Append image files
      remarkData.images.forEach((file) => {
        formData.append('images', file)
      })

      let response
      if (editingRemark >= 0) {
        // Update existing remark
        const remarkId = plan.dailyRemarks?.[editingRemark]._id
        if (!remarkId) {
          throw new Error('Remark ID not found')
        }
        response = await seasonPlanAPI.updateDailyRemark(planId, remarkId, formData)
      } else {
        // Add new remark
        response = await seasonPlanAPI.addDailyRemark(planId, formData)
      }

      // Update plan with the response data
      const updatedPlan = response.data.data || response.data
      setPlan(updatedPlan)
      setRemarkDialog(false)
      setUploadingImages(false)
      toast.success(t(editingRemark >= 0 ? 'seasonPlans.remarkUpdated' : 'seasonPlans.remarkAdded'))
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string; errors?: Array<{ field: string; message: string }> } } }
      setUploadingImages(false)

      // Show detailed validation errors if available
      if (error.response?.data?.errors && error.response.data.errors.length > 0) {
        const errorMessages = error.response.data.errors.map(e => `${e.field}: ${e.message}`).join(', ')
        toast.error(errorMessages)
      } else {
        toast.error(error.response?.data?.message || t('common.error'))
      }
    }
  }

  const deleteRemark = async (index: number) => {
    setRemarkToDelete(index)
    setDeletingRemark(true)
  }

  const confirmDeleteRemark = async () => {
    if (!plan || remarkToDelete < 0) return

    try {
      const remarkId = plan.dailyRemarks?.[remarkToDelete]._id
      if (!remarkId) {
        throw new Error('Remark ID not found')
      }

      // Use the proper backend API that handles R2 cleanup
      const response = await seasonPlanAPI.deleteDailyRemark(planId, remarkId)

      // Update plan with the response data
      const updatedPlan = response.data.data || response.data
      setPlan(updatedPlan)
      setDeletingRemark(false)
      setRemarkToDelete(-1)
      toast.success(t('seasonPlans.remarkDeleted'))
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error.response?.data?.message || t('common.error'))
    }
  }

  // Render loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  // Render error state
  if (error || !plan) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || t('seasonPlans.errors.notFound')}
          </AlertDescription>
        </Alert>
        <Button onClick={() => router.push('/season-plans')} variant="outline">
          {t('common.back')}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SeasonPlanHeader
        plan={plan}
        t={t}
        formatDate={formatDate}
        getStatusColor={getStatusColor}
        getCompletedStages={() => getCompletedStages(plan)}
        getProgressPercentage={() => getProgressPercentage(plan)}
        openHarvestDialog={openHarvestDialog}
        onEdit={() => router.push(`/season-plans/${planId}/edit`)}
        onDelete={() => setDeleteDialogOpen(true)}
        onBack={() => router.push('/season-plans')}
      />

      <Accordion type="single" collapsible className="w-full space-y-4">
        <GrowingStagesSection
          plan={plan}
          t={t}
          formatDate={formatDate}
          getCompletedStages={() => getCompletedStages(plan)}
          openStageDialog={openStageDialog}
          generateYouTubeSearchLink={generateYouTubeSearchLink}
        />

        <FertilizerScheduleSection
          plan={plan}
          t={t}
          formatDate={formatDate}
          openFertilizerDialog={openFertilizerDialog}
          deleteFertilizerApplication={deleteFertilizerApplication}
          setLccDialog={setLccDialog}
        />

        <ExpensesSection
          plan={plan}
          t={t}
          formatDate={formatDate}
          calculateTotalExpenses={() => calculateTotalExpenses(plan)}
          getCategoryIcon={getCategoryIcon}
          openExpenseDialog={openExpenseDialog}
          deleteExpense={deleteExpense}
        />

        <DailyRemarksSection
          plan={plan}
          t={t}
          formatDate={formatDate}
          openRemarkDialog={openRemarkDialog}
          deleteRemark={deleteRemark}
        />
      </Accordion>

      {/* Dialogs */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
      />

      <StageImplementationDialog
        open={stageDialog.open}
        onOpenChange={(open) => setStageDialog({ ...stageDialog, open })}
        stageData={stageImplementationData}
        onSave={saveStageImplementation}
        onChange={(field, value) =>
          setStageImplementationData((prev) => ({ ...prev, [field]: value }))
        }
      />

      <FertilizerImplementationDialog
        open={fertilizerDialog.open}
        onOpenChange={(open) => setFertilizerDialog({ ...fertilizerDialog, open })}
        fertilizerData={fertilizerImplementationData}
        onSave={saveFertilizerImplementation}
        onChange={(field, value) =>
          setFertilizerImplementationData((prev) => ({ ...prev, [field]: value }))
        }
      />

      {/* Delete Fertilizer Confirmation Dialog */}
      <Dialog open={deletingFertilizer} onOpenChange={setDeletingFertilizer}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('seasonPlans.confirmDeleteFertilizer')}</DialogTitle>
            <DialogDescription>{t('seasonPlans.deleteFertilizerWarning')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingFertilizer(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="destructive" onClick={confirmDeleteFertilizer}>
              {t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* LCC Calculator Dialog */}
      <Dialog open={lccDialog} onOpenChange={setLccDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('seasonPlans.lccCalculator')}</DialogTitle>
            <DialogDescription>{t('seasonPlans.lccDescription')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="lccDate">{t('seasonPlans.currentDate')}</Label>
              <Input
                id="lccDate"
                type="date"
                value={lccData.currentDate}
                onChange={(e) => setLccData({ ...lccData, currentDate: e.target.value })}
              />
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm">
                <span className="font-semibold">{t('seasonPlans.plantAge')}:</span> {calculatePlantAge()}{' '}
                {t('seasonPlans.days')}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="leafColorIndex">{t('seasonPlans.leafColorIndex')} (1-6)</Label>
              <Select
                value={lccData.leafColorIndex.toString()}
                onValueChange={(value) => setLccData({ ...lccData, leafColorIndex: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {index} - {index === 1 ? t('seasonPlans.lightestGreen') : index === 6 ? t('seasonPlans.darkestGreen') : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="w-full" onClick={handleLeafColorCalculation}>
              {t('seasonPlans.calculate')}
            </Button>
            {lccData.recommendedUrea > 0 && (
              <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary">
                <p className="font-semibold text-lg">
                  {t('seasonPlans.recommendedUrea')}: {lccData.recommendedUrea} kg/ha
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLccDialog(false)}>
              {t('common.cancel')}
            </Button>
            {lccData.recommendedUrea > 0 && (
              <Button onClick={saveLCCFertilizerApplication}>
                {t('seasonPlans.addToSchedule')}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Harvest Recording Dialog */}
      <Dialog open={harvestDialog} onOpenChange={setHarvestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('seasonPlans.recordHarvest')}</DialogTitle>
            <DialogDescription>{t('seasonPlans.harvestDescription')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="harvestDate">{t('seasonPlans.harvestDate')}</Label>
              <Input
                id="harvestDate"
                type="date"
                value={harvestData.harvestDate}
                onChange={(e) => setHarvestData({ ...harvestData, harvestDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="actualYield">{t('seasonPlans.actualYield')} (kg)</Label>
              <Input
                id="actualYield"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={harvestData.actualYield}
                onChange={(e) => setHarvestData({ ...harvestData, actualYield: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quality">{t('seasonPlans.quality')}</Label>
              <Select
                value={harvestData.quality}
                onValueChange={(value) => setHarvestData({ ...harvestData, quality: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('seasonPlans.selectQuality')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">{t('seasonPlans.excellent')}</SelectItem>
                  <SelectItem value="good">{t('seasonPlans.good')}</SelectItem>
                  <SelectItem value="average">{t('seasonPlans.average')}</SelectItem>
                  <SelectItem value="poor">{t('seasonPlans.poor')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="harvestNotes">{t('seasonPlans.notes')}</Label>
              <Textarea
                id="harvestNotes"
                placeholder={t('seasonPlans.notesPlaceholder')}
                value={harvestData.notes}
                onChange={(e) => setHarvestData({ ...harvestData, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setHarvestDialog(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={saveHarvestData}>{t('common.save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Expense Dialog */}
      <Dialog open={expenseDialog} onOpenChange={setExpenseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingExpense >= 0 ? t('seasonPlans.editExpense') : t('seasonPlans.addExpense')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="expenseCategory">{t('seasonPlans.category')}</Label>
              <Select
                value={expenseData.category}
                onValueChange={(value) => setExpenseData({ ...expenseData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('seasonPlans.selectCategory')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seeds">{t('seasonPlans.expenseCategories.seeds')}</SelectItem>
                  <SelectItem value="fertilizer">{t('seasonPlans.expenseCategories.fertilizer')}</SelectItem>
                  <SelectItem value="pesticides">{t('seasonPlans.expenseCategories.pesticides')}</SelectItem>
                  <SelectItem value="labor">{t('seasonPlans.expenseCategories.labor')}</SelectItem>
                  <SelectItem value="equipment">{t('seasonPlans.expenseCategories.equipment')}</SelectItem>
                  <SelectItem value="transport">{t('seasonPlans.expenseCategories.transport')}</SelectItem>
                  <SelectItem value="other">{t('seasonPlans.expenseCategories.other')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expenseAmount">{t('seasonPlans.amount')} (LKR)</Label>
              <Input
                id="expenseAmount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={expenseData.amount}
                onChange={(e) => setExpenseData({ ...expenseData, amount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expenseDate">{t('seasonPlans.date')}</Label>
              <Input
                id="expenseDate"
                type="date"
                value={expenseData.date}
                onChange={(e) => setExpenseData({ ...expenseData, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expenseDescription">{t('seasonPlans.description')}</Label>
              <Textarea
                id="expenseDescription"
                placeholder={t('seasonPlans.descriptionPlaceholder')}
                value={expenseData.description}
                onChange={(e) => setExpenseData({ ...expenseData, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExpenseDialog(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={saveExpense}>{t('common.save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Expense Confirmation Dialog */}
      <Dialog open={deletingExpense} onOpenChange={setDeletingExpense}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('seasonPlans.confirmDeleteExpense')}</DialogTitle>
            <DialogDescription>{t('seasonPlans.deleteExpenseWarning')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingExpense(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="destructive" onClick={confirmDeleteExpense}>
              {t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remark Dialog */}
      <Dialog open={remarkDialog} onOpenChange={setRemarkDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingRemark >= 0 ? t('seasonPlans.editRemark') : t('seasonPlans.addRemark')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="remarkDate">
                {t('seasonPlans.date')} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="remarkDate"
                type="date"
                value={remarkData.date}
                onChange={(e) => setRemarkData({ ...remarkData, date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="remarkCategory">{t('seasonPlans.category')}</Label>
              <Input
                id="remarkCategory"
                placeholder={t('seasonPlans.categoryPlaceholder')}
                value={remarkData.category}
                onChange={(e) => setRemarkData({ ...remarkData, category: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="remarkTitle">{t('seasonPlans.title')}</Label>
              <Input
                id="remarkTitle"
                placeholder={t('seasonPlans.titlePlaceholder')}
                value={remarkData.title}
                onChange={(e) => setRemarkData({ ...remarkData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="remarkDescription">
                {t('seasonPlans.description')} <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="remarkDescription"
                placeholder={t('seasonPlans.descriptionPlaceholder')}
                value={remarkData.description}
                onChange={(e) => setRemarkData({ ...remarkData, description: e.target.value })}
                rows={4}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="remarkImages">{t('seasonPlans.images')}</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="remarkImages"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleRemarkImageUpload}
                  className="cursor-pointer flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  onClick={() => document.getElementById('remarkImages')?.click()}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              {remarkData.images.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {remarkData.images.length} {t('seasonPlans.imagesSelected')}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemarkDialog(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={saveRemark} disabled={uploadingImages}>
              {uploadingImages ? t('seasonPlans.uploading') : t('common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Remark Confirmation Dialog */}
      <Dialog open={deletingRemark} onOpenChange={setDeletingRemark}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('seasonPlans.confirmDeleteRemark')}</DialogTitle>
            <DialogDescription>{t('seasonPlans.deleteRemarkWarning')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingRemark(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="destructive" onClick={confirmDeleteRemark}>
              {t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
