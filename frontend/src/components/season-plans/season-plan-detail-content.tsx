'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { seasonPlanAPI } from '@/lib/api'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Calendar,
  MapPin,
  Droplets,
  Mountain,
  Sprout,
  Edit,
  Trash2,
  ArrowLeft,
  CheckCircle,
  Clock,
  DollarSign,
  Leaf,
  AlertCircle,
  TrendingUp,
  Package,
  Beaker,
  CalendarDays,
  Activity,
  FileText,
  BarChart3,
  Youtube,
  Upload,
  Plus,
} from 'lucide-react'
import Image from 'next/image'
import DeleteConfirmationDialog from './dialogs/DeleteConfirmationDialog';
import StageImplementationDialog from './dialogs/StageImplementationDialog';
import FertilizerImplementationDialog from './dialogs/FertilizerImplementationDialog';
// import { saveStageImplementation, saveFertilizerImplementation } from './handlers/seasonPlanHandlers';
import { SeasonPlan } from '../../types/SeasonPlan';

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

  // Stage implementation state
  const [stageDialog, setStageDialog] = useState({ open: false, index: -1 })
  const [stageImplementationData, setStageImplementationData] = useState({
    implementedDate: '',
    implementedEndDate: '',
    notes: '',
  })

  // Fertilizer implementation state
  const [fertilizerDialog, setFertilizerDialog] = useState({ open: false, index: -1 })
  const [fertilizerImplementationData, setFertilizerImplementationData] = useState({
    appliedDate: '',
    notes: '',
  })
  const [deletingFertilizer, setDeletingFertilizer] = useState(false)
  const [fertilizerToDelete, setFertilizerToDelete] = useState(-1)

  // LCC (Leaf Color Chart) Calculator state
  const [lccDialog, setLccDialog] = useState(false)
  const [lccData, setLccData] = useState({
    currentDate: new Date().toISOString().split('T')[0],
    leafColorIndex: 3,
    recommendedUrea: 0,
  })

  // Harvest state
  const [harvestDialog, setHarvestDialog] = useState(false)
  const [harvestData, setHarvestData] = useState({
    harvestDate: '',
    actualYield: '',
    quality: '',
    notes: '',
  })

  // Expense state
  const [expenseDialog, setExpenseDialog] = useState(false)
  const [editingExpense, setEditingExpense] = useState<number>(-1)
  const [expenseData, setExpenseData] = useState({
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: '',
  })
  const [deletingExpense, setDeletingExpense] = useState(false)
  const [expenseToDelete, setExpenseToDelete] = useState(-1)

  // Remark state
  const [remarkDialog, setRemarkDialog] = useState(false)
  const [editingRemark, setEditingRemark] = useState<number>(-1)
  const [remarkData, setRemarkData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: '',
    title: '',
    description: '',
    images: [] as File[],
  })
  const [uploadingImages, setUploadingImages] = useState(false)
  const [deletingRemark, setDeletingRemark] = useState(false)
  const [remarkToDelete, setRemarkToDelete] = useState(-1)

  const loadSeasonPlan = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await seasonPlanAPI.getSeasonPlan(planId)
      console.log('Season plan response:', response.data)
      const planData = response.data.data || response.data
      
      // Transform backend field names to match frontend interface
      if (planData.growingStages) {
        planData.growingStages = planData.growingStages.map((stage: {
          completed?: boolean;
          isCompleted?: boolean;
          implementedDate?: string;
          actualStartDate?: string;
          implementedEndDate?: string;
          actualEndDate?: string;
          notes?: string;
          implementationNotes?: string;
          [key: string]: unknown;
        }) => ({
          ...stage,
          isCompleted: stage.completed ?? stage.isCompleted ?? false,
          implementedDate: stage.implementedDate ?? stage.actualStartDate,
          implementedEndDate: stage.implementedEndDate ?? stage.actualEndDate,
          implementationNotes: stage.notes ?? stage.implementationNotes,
        }))
      }
      
      console.log('Plan data:', planData)
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
        implementedDate: stage.implementedDate || '',
        implementedEndDate: stage.implementedEndDate || '',
        notes: stage.implementationNotes || '',
      })
    }
  }

  const saveStageImplementation = async () => {
    if (!plan || stageDialog.index < 0) return

    try {
      const updatedStages = [...(plan.growingStages || [])]
      const isNewImplementation = !updatedStages[stageDialog.index].isCompleted
      
      updatedStages[stageDialog.index] = {
        ...updatedStages[stageDialog.index],
        isCompleted: true,
        implementedDate: stageImplementationData.implementedDate,
        implementedEndDate: stageImplementationData.implementedEndDate || stageImplementationData.implementedDate,
        implementationNotes: stageImplementationData.notes,
      }

      // Transform to backend format (completed instead of isCompleted, notes instead of implementationNotes)
      const backendStages = updatedStages.map(stage => ({
        ...stage,
        completed: stage.isCompleted,
        notes: stage.implementationNotes,
      }))

      await seasonPlanAPI.updateSeasonPlan(planId, {
        ...plan,
        growingStages: backendStages,
      })

      setPlan({ ...plan, growingStages: updatedStages })
      setStageDialog({ open: false, index: -1 })
      toast.success(t(isNewImplementation ? 'seasonPlans.stageMarkedComplete' : 'seasonPlans.stageUpdated'))
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || t('common.error'))
    }
  }

  // Fertilizer implementation handlers
  const openFertilizerDialog = (index: number) => {
    const fertilizer = plan?.fertilizerSchedule?.[index]
    if (fertilizer) {
      setFertilizerDialog({ open: true, index })
      setFertilizerImplementationData({
        appliedDate: fertilizer.appliedDate || '',
        notes: fertilizer.notes || '',
      })
    }
  }

  const saveFertilizerImplementation = async () => {
    if (!plan || !plan.fertilizerSchedule || fertilizerDialog.index < 0 || !plan._id) return

    try {
      const updatedFertilizerSchedule = plan.fertilizerSchedule.map((app, i) =>
        i === fertilizerDialog.index
          ? { ...app, ...fertilizerImplementationData, applied: true }
          : app
      );

      await seasonPlanAPI.updateSeasonPlan(plan._id, { fertilizerSchedule: updatedFertilizerSchedule });
      setPlan(prev => ({ ...prev, fertilizerSchedule: updatedFertilizerSchedule }));
      setFertilizerDialog({ open: false, index: -1 });
    } catch {
      toast.error(t('seasonPlans.errors.updateFailed'));
    }
  }

  const deleteFertilizerApplication = async (index: number) => {
    setFertilizerToDelete(index)
    setDeletingFertilizer(true)
  }

  const confirmDeleteFertilizer = async () => {
    if (!plan || fertilizerToDelete < 0) return

    try {
      const updatedFertilizers = (plan.fertilizerSchedule || []).filter((_, i) => i !== fertilizerToDelete)

      await seasonPlanAPI.updateSeasonPlan(planId, {
        ...plan,
        fertilizerSchedule: updatedFertilizers,
      })

      setPlan({ ...plan, fertilizerSchedule: updatedFertilizers })
      setDeletingFertilizer(false)
      setFertilizerToDelete(-1)
      toast.success(t('seasonPlans.fertilizerDeleted'))
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || t('common.error'))
    }
  }

  // LCC Calculator handlers
  const calculatePlantAge = () => {
    if (!plan?.cultivationDate) return 0
    const cultivationDate = new Date(plan.cultivationDate)
    const currentDate = new Date(lccData.currentDate)
    const diffTime = Math.abs(currentDate.getTime() - cultivationDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const calculateUreaRecommendation = (leafColorIndex: number, plantAge: number) => {
    const leafColorChart: { [key: number]: { [key: string]: number } } = {
      1: { '30-40': 40, '40-60': 35, '60-80': 30, '80+': 25 },
      2: { '30-40': 35, '40-60': 30, '60-80': 25, '80+': 20 },
      3: { '30-40': 30, '40-60': 25, '60-80': 20, '80+': 15 },
      4: { '30-40': 25, '40-60': 20, '60-80': 15, '80+': 10 },
      5: { '30-40': 20, '40-60': 15, '60-80': 10, '80+': 5 },
      6: { '30-40': 0, '40-60': 0, '60-80': 0, '80+': 0 },
    }

    let ageRange = '80+'
    if (plantAge >= 30 && plantAge < 40) ageRange = '30-40'
    else if (plantAge >= 40 && plantAge < 60) ageRange = '40-60'
    else if (plantAge >= 60 && plantAge < 80) ageRange = '60-80'

    return leafColorChart[leafColorIndex]?.[ageRange] || 0
  }

  const handleLeafColorCalculation = () => {
    const plantAge = calculatePlantAge()
    const recommendedUrea = calculateUreaRecommendation(lccData.leafColorIndex, plantAge)
    setLccData({ ...lccData, recommendedUrea })
  }

  const saveLCCFertilizerApplication = async () => {
    if (!plan || lccData.recommendedUrea === 0) return

    try {
      const newFertilizer = {
        type: 'Urea',
        fertilizerType: 'Urea',
        amount: lccData.recommendedUrea,
        quantity: lccData.recommendedUrea,
        unit: 'kg/ha',
        applicationDate: lccData.currentDate,
        applied: false,
        status: 'pending' as const,
        notes: `LCC Index: ${lccData.leafColorIndex}, Plant Age: ${calculatePlantAge()} days`,
        date: lccData.currentDate, // Add 'date' explicitly
        implementedDate: lccData.currentDate, // Add 'implementedDate' explicitly
        description: 'Default description' // Add 'description' explicitly
      }

      const updatedFertilizers = [...(plan.fertilizerSchedule || []), {
        ...newFertilizer,
        date: newFertilizer.date || newFertilizer.applicationDate || new Date().toISOString().split('T')[0],
        implementedDate: newFertilizer.implementedDate || newFertilizer.applicationDate || new Date().toISOString().split('T')[0], // Add implementedDate
        description: newFertilizer.description || '', // Ensure description is included
      }]

      await seasonPlanAPI.updateSeasonPlan(planId, {
        ...plan,
        fertilizerSchedule: updatedFertilizers,
      })

      setPlan({ ...plan, fertilizerSchedule: updatedFertilizers })
      setLccDialog(false)
      toast.success(t('seasonPlans.lccFertilizerAdded'))
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || t('common.error'))
    }
  }

  // Harvest handlers
  const openHarvestDialog = () => {
    const allStagesComplete = plan?.growingStages?.every((s) => s.isCompleted) || false
    if (!allStagesComplete) {
      toast.error(t('seasonPlans.completeAllStagesFirst'))
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
        actualYield: harvestData.actualYield,
        harvestQuality: harvestData.quality,
        harvestNotes: harvestData.notes,
      })

      setPlan({
        ...plan,
        actualHarvestDate: harvestData.harvestDate,
        actualYield: harvestData.actualYield,
        harvestQuality: harvestData.quality,
        harvestNotes: harvestData.notes,
      })

      setHarvestDialog(false)
      toast.success(t('seasonPlans.harvestRecorded'))
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || t('common.error'))
    }
  }

  // Expense handlers
  const openExpenseDialog = (index: number = -1) => {
    if (index >= 0 && plan?.expenses?.[index]) {
      setEditingExpense(index)
      const expense = plan.expenses[index]
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
      const updatedExpenses = [...(plan.expenses || [])]

      const expense = {
        category: expenseData.category,
        amount: parseFloat(expenseData.amount),
        description: expenseData.description,
        date: expenseData.date,
        paymentMethod: expenseData.paymentMethod,
      }

      if (editingExpense >= 0) {
        updatedExpenses[editingExpense] = expense
      } else {
        updatedExpenses.push(expense)
      }

      await seasonPlanAPI.updateSeasonPlan(planId, {
        ...plan,
        expenses: updatedExpenses,
      })

      setPlan({ ...plan, expenses: updatedExpenses })
      setExpenseDialog(false)
      toast.success(t(editingExpense >= 0 ? 'seasonPlans.expenseUpdated' : 'seasonPlans.expenseAdded'))
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
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
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || t('common.error'))
    }
  }

  // Remark handlers
  const openRemarkDialog = (index: number = -1) => {
    if (index >= 0 && plan?.dailyRemarks?.[index]) {
      setEditingRemark(index)
      const remark = plan.dailyRemarks[index]
      setRemarkData({
        date: remark.date || new Date().toISOString().split('T')[0],
        category: remark.category || '',
        title: remark.title || '',
        description: remark.description || remark.remark || '',
        images: [],
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
      const files = Array.from(e.target.files)
      setRemarkData({ ...remarkData, images: files })
    }
  }

  const saveRemark = async () => {
    if (!plan) return

    try {
      setUploadingImages(true)

      // In a real implementation, upload images to S3 or backend
      // For now, we'll just save the remark data
      const updatedRemarks = [...(plan.dailyRemarks || [])]

      const remark = {
        date: remarkData.date,
        remark: remarkData.description || remarkData.title || '',
        category: remarkData.category,
        title: remarkData.title,
        description: remarkData.description,
        images: [], // Would contain uploaded image URLs
      }

      if (editingRemark >= 0) {
        updatedRemarks[editingRemark] = remark
      } else {
        updatedRemarks.push(remark)
      }

      await seasonPlanAPI.updateSeasonPlan(planId, {
        ...plan,
        dailyRemarks: updatedRemarks,
      })

      setPlan({ ...plan, dailyRemarks: updatedRemarks })
      setRemarkDialog(false)
      setUploadingImages(false)
      toast.success(t(editingRemark >= 0 ? 'seasonPlans.remarkUpdated' : 'seasonPlans.remarkAdded'))
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setUploadingImages(false)
      toast.error(error.response?.data?.message || t('common.error'))
    }
  }

  const deleteRemark = async (index: number) => {
    setRemarkToDelete(index)
    setDeletingRemark(true)
  }

  const confirmDeleteRemark = async () => {
    if (!plan || remarkToDelete < 0) return

    try {
      const updatedRemarks = (plan.dailyRemarks || []).filter((_, i) => i !== remarkToDelete)

      await seasonPlanAPI.updateSeasonPlan(planId, {
        ...plan,
        dailyRemarks: updatedRemarks,
      })

      setPlan({ ...plan, dailyRemarks: updatedRemarks })
      setDeletingRemark(false)
      setRemarkToDelete(-1)
      toast.success(t('seasonPlans.remarkDeleted'))
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || t('common.error'))
    }
  }

  // YouTube search link generator
  const generateYouTubeSearchLink = (stageName: string) => {
    const query = encodeURIComponent(`paddy ${stageName} farming`)
    return `https://www.youtube.com/results?search_query=${query}`
  }

  const formatDate = (date: string) => {
    if (!date) return t('common.notSpecified')
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      planned: 'secondary',
      active: 'default',
      completed: 'default',
      cancelled: 'destructive',
    }
    return colors[status] || 'default'
  }

  const calculateTotalExpenses = () => {
    if (!plan?.expenses) return 0
    return plan.expenses.reduce((sum, expense) => sum + expense.amount, 0)
  }

  const getCompletedStages = () => {
    if (!plan?.growingStages) return 0
    return plan.growingStages.filter((stage) => stage.isCompleted).length
  }

  const getProgressPercentage = () => {
    if (!plan?.growingStages || plan.growingStages.length === 0) return 0
    return Math.round((getCompletedStages() / plan.growingStages.length) * 100)
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      seeds: <Package className="h-4 w-4" />,
      fertilizer: <Beaker className="h-4 w-4" />,
      pesticides: <Leaf className="h-4 w-4" />,
      labor: <Activity className="h-4 w-4" />,
      machinery: <DollarSign className="h-4 w-4" />,
      irrigation: <Droplets className="h-4 w-4" />,
      other: <FileText className="h-4 w-4" />,
    }
    return icons[category] || <FileText className="h-4 w-4" />
  }

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

  if (error || !plan) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push('/season-plans')}
            variant="outline"
            size="icon"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{t('seasonPlans.seasonPlanDetails')}</h1>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || t('seasonPlans.errors.notFound')}</AlertDescription>
        </Alert>
        <Button onClick={() => router.push('/season-plans')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('seasonPlans.backToList')}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push('/season-plans')}
            variant="outline"
            size="icon"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{plan.farmId?.name}</h1>
            <p className="text-muted-foreground">
              {t(`seasonPlans.seasons.${plan.season}`)} {t('seasonPlans.season')}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => router.push(`/season-plans/${planId}/edit`)}
            variant="outline"
          >
            <Edit className="mr-2 h-4 w-4" />
            {t('seasonPlans.editPlan')}
          </Button>
          <Button onClick={() => setDeleteDialogOpen(true)} variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            {t('seasonPlans.deletePlan')}
          </Button>
        </div>
      </div>

      {/* Status Badge and Progress */}
      <div className="flex items-center gap-4">
        <Badge variant={getStatusColor(plan.status || 'planned')} className="text-sm px-3 py-1">
          {t(`seasonPlans.statuses.${plan.status}`)}
        </Badge>
        {plan.growingStages && plan.growingStages.length > 0 && (
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <Progress value={getProgressPercentage()} className="h-2" />
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {getCompletedStages()}/{plan.growingStages.length}
            </span>
          </div>
        )}
      </div>

      {/* Basic Information & Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {t('seasonPlans.basicInfo')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <MapPin className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{t('seasonPlans.farm')}</p>
                  <p className="font-medium">{plan.farmId?.name}</p>
                  {plan.farmId?.district && (
                    <p className="text-xs text-muted-foreground">{plan.farmId.district}</p>
                  )}
                </div>
              </div>
            
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Mountain className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{t('seasonPlans.climateZone')}</p>
                  <p className="font-medium">{plan.climateZone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Droplets className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{t('seasonPlans.irrigationMethod')}</p>
                  <p className="font-medium">
                    {t(`common.irrigationMethods.${plan.irrigationMethod}`)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Sprout className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{t('seasonPlans.plantingMethod')}</p>
                  <p className="font-medium">
                    {t(`common.plantingMethods.${plan.plantingMethod}`)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Leaf className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{t('seasonPlans.paddyVariety')}</p>
                  <p className="font-medium">{plan.paddyVariety?.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{t('seasonPlans.cultivatingArea')}</p>
                  <p className="font-medium">
                    {plan.cultivatingArea} {t(`seasonPlans.units.${plan.areaUnit}`)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              {t('seasonPlans.timeline')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{t('seasonPlans.cultivationDate')}</p>
                  <p className="font-medium">{formatDate(plan.cultivationDate || '')}</p>
                </div>
              </div>

              {plan.transplantingDate && (
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <Sprout className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{t('seasonPlans.transplantingDate')}</p>
                    <p className="font-medium">{formatDate(plan.transplantingDate)}</p>
                  </div>
                </div>
              )}

              {plan.expectedHarvestDate && (
                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
                  <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{t('seasonPlans.expectedHarvest')}</p>
                    <p className="font-medium">{formatDate(plan.expectedHarvestDate)}</p>
                    {plan.estimatedYield && (
                      <p className="text-sm text-green-600 font-medium mt-1">
                        {t('seasonPlans.estimatedYield')}: {plan.estimatedYield} kg
                      </p>
                    )}
                  </div>
                </div>
              )}

              {plan.actualHarvestDate && (
                <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{t('seasonPlans.actualHarvest')}</p>
                    <p className="font-medium">{formatDate(plan.actualHarvestDate)}</p>
                    {plan.actualYield && (
                      <p className="text-sm text-blue-600 font-medium mt-1">
                        {t('seasonPlans.actualYield')}: {plan.actualYield} kg
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Record Harvest Button */}
            {!plan.actualHarvestDate && (
              <div className="pt-2">
                <Button variant="default" className="w-full gap-2" onClick={openHarvestDialog}>
                  <TrendingUp className="h-4 w-4" />
                  {t('seasonPlans.recordHarvest')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Accordion Sections */}
      <Accordion type="single" collapsible className="w-full space-y-4">
        {/* Growing Stages Accordion */}
        {plan.growingStages && plan.growingStages.length > 0 && (
          <AccordionItem value="growing-stages" className="border rounded-lg px-6">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-primary" />
                <div className="flex items-center gap-4">
                  <span className="font-semibold">{t('seasonPlans.growingStages')}</span>
                  <Badge variant="secondary">
                    {getCompletedStages()}/{plan.growingStages.length} {t('seasonPlans.completed')}
                  </Badge>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <div className="space-y-4">
                {plan.growingStages.map((stage, index) => (
                  <div
                    key={index}
                    className={`rounded-lg border-2 transition-all overflow-hidden ${
                      stage.isCompleted
                        ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900'
                        : 'bg-muted/50 border-muted'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start gap-4 p-4">
                      <div className="flex-shrink-0 mt-1">
                        {stage.isCompleted ? (
                          <CheckCircle className="h-7 w-7 text-green-600" />
                        ) : (
                          <Clock className="h-7 w-7 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg mb-2">
                              {t(`seasonPlans.stages.${stage.stage}`)}
                            </h3>
                            
                            {/* Planned Date */}
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span className="font-medium">{t('seasonPlans.planned')}:</span>
                                <span>
                                  {formatDate(stage.startDate)}
                                  {stage.endDate && ` - ${formatDate(stage.endDate)}`}
                                </span>
                              </div>
                              
                              {/* Actual Date (if completed) */}
                              {stage.isCompleted && stage.implementedDate && (
                                <div className="flex items-center gap-2 text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                  <span className="font-medium text-green-600">{t('seasonPlans.actual')}:</span>
                                  <span className="text-green-600 font-medium">
                                    {formatDate(stage.implementedDate)}
                                    {stage.implementedEndDate && stage.implementedEndDate !== stage.implementedDate
                                      ? ` - ${formatDate(stage.implementedEndDate)}`
                                      : ''}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            {/* Stage Description */}
                            {stage.description && (
                              <p className="mt-2 text-sm text-foreground/80">
                                {stage.description}
                              </p>
                            )}
                          </div>
                          <Badge
                            variant={stage.isCompleted ? 'default' : 'secondary'}
                            className={stage.isCompleted ? 'bg-green-600' : ''}
                          >
                            {stage.isCompleted ? t('seasonPlans.completed') : t('seasonPlans.pending')}
                          </Badge>
                        </div>
                        
                        {/* Implementation Notes Box - Only for completed stages */}
                        {stage.isCompleted && stage.implementationNotes && (
                          <div className="mt-4 p-4 bg-blue-100/50 dark:bg-blue-900/30 border-2 border-blue-300 dark:border-blue-700 rounded-lg shadow-sm">
                            <div className="flex items-start gap-2 mb-2">
                              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                              <span className="text-base font-semibold text-blue-700 dark:text-blue-300">
                                {t('seasonPlans.implementationNotes')}:
                              </span>
                            </div>
                            <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed pl-7">
                              {stage.implementationNotes}
                            </p>
                          </div>
                        )}
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 mt-3 pt-2 border-t">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => window.open(generateYouTubeSearchLink(stage.stage), '_blank')}
                          >
                            <Youtube className="h-4 w-4 text-red-600" />
                            {t('seasonPlans.learnMore')}
                          </Button>
                          {!stage.isCompleted && (
                            <Button
                              variant="default"
                              size="sm"
                              className="gap-2"
                              onClick={() => openStageDialog(index)}
                            >
                              <CheckCircle className="h-4 w-4" />
                              {t('seasonPlans.markComplete')}
                            </Button>
                          )}
                          {stage.isCompleted && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2"
                              onClick={() => openStageDialog(index)}
                            >
                              <Edit className="h-4 w-4" />
                              {t('seasonPlans.editImplementation')}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Fertilizer Schedule Accordion */}
        {plan.fertilizerSchedule && plan.fertilizerSchedule.length > 0 && (
          <AccordionItem value="fertilizer-schedule" className="border rounded-lg px-6">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <Beaker className="h-5 w-5 text-primary" />
                <div className="flex items-center gap-4">
                  <span className="font-semibold">{t('seasonPlans.fertilizerSchedule')}</span>
                  <Badge variant="secondary">
                    {plan.fertilizerSchedule.filter((app) => app.applied).length}/
                    {plan.fertilizerSchedule.length} {t('seasonPlans.applied')}
                  </Badge>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <div className="flex justify-end mb-3">
                <Button variant="outline" size="sm" className="gap-2" onClick={() => setLccDialog(true)}>
                  <Leaf className="h-4 w-4" />
                  {t('seasonPlans.lccCalculator')}
                </Button>
              </div>
              <div className="space-y-3">
                {plan.fertilizerSchedule.map((app, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all ${
                      app.applied
                        ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900'
                        : 'bg-muted/50 border-muted'
                    }`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <Beaker
                        className={`h-6 w-6 ${
                          app.applied ? 'text-green-600' : 'text-muted-foreground'
                        }`}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{app.stage}</h3>
                          
                          {/* Scheduled Date */}
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            <span className="font-medium">{t('seasonPlans.scheduled')}:</span>
                            <span>{formatDate(app.date)}</span>
                          </div>
                          
                          {/* Implemented Date (if applied) */}
                          {app.applied && app.implementedDate && (
                            <div className="flex items-center gap-2 mt-1 text-sm text-green-600">
                              <CheckCircle className="h-3.5 w-3.5" />
                              <span className="font-medium">{t('seasonPlans.implemented')}:</span>
                              <span>{formatDate(app.implementedDate)}</span>
                            </div>
                          )}
                          
                          {/* Description */}
                          {app.description && (
                            <p className="mt-2 text-sm text-foreground/80 leading-relaxed">
                              {app.description}
                            </p>
                          )}
                          
                          {/* Fertilizer Details */}
                          <div className="mt-3 space-y-1">
                            {app.fertilizers && (
                              <div className='flex justify-between items-center'>
                                <div>
                                  <div className="text-sm font-medium">
                                    {t('common.perFieldKg')}:
                                  </div>
                                  {Object.entries(app.fertilizers.perFieldKg || {}).map(
                                    ([fertilizer, quantity]) => (
                                      <div className="text-sm" key={fertilizer}>
                                        <span className="font-medium">{t(`seasonPlans.${fertilizer}`)}:</span> {quantity}
                                      </div>
                                    )
                                  )}
                                </div>
                                <div>
                                  <div className="text-sm font-medium">
                                    {t('common.recommendedPerHa')}:
                                  </div>
                                  {Object.entries(app.fertilizers.recommendedPerHa || {}).map(
                                    ([fertilizer, quantity]) => (
                                      <div className="text-sm" key={fertilizer}>
                                        <span className="font-medium">{t(`seasonPlans.${fertilizer}`)}:</span> {quantity}
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Notes Box */}
                          {app.notes && (
                            <div className="mt-3 p-3 bg-pink-50 dark:bg-pink-950/20 border-l-4 border-pink-400 rounded">
                              <div className="flex items-start gap-2">
                                <FileText className="h-4 w-4 text-pink-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <span className="text-sm font-medium text-pink-700 dark:text-pink-300">
                                    {t('seasonPlans.notes')}:
                                  </span>
                                  <p className="text-sm text-pink-600 dark:text-pink-400 mt-1">
                                    {t(app.notes)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={app.applied ? 'default' : 'secondary'}
                            className={app.applied ? 'bg-green-600' : ''}
                          >
                            {app.applied ? t('seasonPlans.applied') : t('seasonPlans.pending')}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        {!app.applied && (
                          <Button
                            variant="default"
                            size="sm"
                            className="gap-2"
                            onClick={() => openFertilizerDialog(index)}
                          >
                            <CheckCircle className="h-4 w-4" />
                            {t('seasonPlans.markApplied')}
                          </Button>
                        )}
                        {app.applied && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => openFertilizerDialog(index)}
                          >
                            <Edit className="h-4 w-4" />
                            {t('seasonPlans.editImplementation')}
                          </Button>
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          className="gap-2"
                          onClick={() => deleteFertilizerApplication(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                          {t('common.delete')}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Expenses Accordion */}
        {plan.expenses && plan.expenses.length > 0 && (
          <AccordionItem value="expenses" className="border rounded-lg px-6">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-5 w-5 text-primary" />
                <div className="flex items-center gap-4">
                  <span className="font-semibold">{t('seasonPlans.expenses')}</span>
                  <div className="flex items-center gap-2 text-lg font-bold text-primary">
                    <DollarSign className="h-5 w-5" />
                    <span>LKR {calculateTotalExpenses().toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <div className="flex justify-end mb-3">
                <Button variant="outline" size="sm" className="gap-2" onClick={() => openExpenseDialog()}>
                  <Plus className="h-4 w-4" />
                  {t('seasonPlans.addExpense')}
                </Button>
              </div>
              <div className="space-y-3">
                {plan.expenses.map((expense, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 border-2 border-muted hover:border-primary/50 transition-all"
                  >
                    <div className="flex-shrink-0 mt-1 p-2 rounded-lg bg-primary/10">
                      {getCategoryIcon(expense.category)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-semibold text-base">
                            {t(`seasonPlans.expenseCategories.${expense.category}`)}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {expense.description}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{formatDate(expense.date)}</span>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                          <p className="text-lg font-bold text-primary">
                            LKR {expense.amount.toLocaleString()}
                          </p>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openExpenseDialog(index)}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteExpense(index)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Daily Remarks Accordion */}
        {plan.dailyRemarks && plan.dailyRemarks.length > 0 && (
          <AccordionItem value="daily-remarks" className="border rounded-lg px-6">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <div className="flex items-center gap-4">
                  <span className="font-semibold">{t('seasonPlans.dailyRemarks')}</span>
                  <Badge variant="secondary">{plan.dailyRemarks.length} {t('seasonPlans.remarks')}</Badge>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <div className="flex justify-end mb-3">
                <Button variant="outline" size="sm" className="gap-2" onClick={() => openRemarkDialog()}>
                  <Plus className="h-4 w-4" />
                  {t('seasonPlans.addRemark')}
                </Button>
              </div>
              <div className="space-y-3">
                {plan.dailyRemarks
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((remark, index) => (
                    <div
                      key={index}
                      className="relative pl-6 py-4 pr-4 border-l-4 border-primary/50 bg-muted/30 rounded-r-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="absolute left-0 top-4 w-3 h-3 bg-primary rounded-full -translate-x-[8.5px]"></div>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm font-semibold text-muted-foreground">
                              {formatDate(remark.date)}
                            </p>
                            {remark.category && (
                              <Badge variant="outline" className="text-xs">
                                {remark.category}
                              </Badge>
                            )}
                          </div>
                          {remark.title && (
                            <p className="font-semibold text-base mb-1">{remark.title}</p>
                          )}
                          <p className="text-base leading-relaxed">{remark.description || remark.remark}</p>
                          {remark.images && remark.images.length > 0 && (
                            <div className="flex gap-2 mt-3">
                              {remark.images.map((img, imgIndex) => (
                                <Image
                                  key={imgIndex}
                                  src={img}
                                  alt={`Remark ${imgIndex + 1}`}
                                  width={500}
                                  height={300}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openRemarkDialog(index)}
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteRemark(index)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
      />

      {/* Stage Implementation Dialog */}
      <StageImplementationDialog
        open={stageDialog.open}
        onOpenChange={(open) => setStageDialog({ ...stageDialog, open })}
        stageData={stageImplementationData}
        onSave={saveStageImplementation}
        onChange={(field, value) =>
          setStageImplementationData((prev) => ({ ...prev, [field]: value }))
        }
      />

      {/* Fertilizer Implementation Dialog */}
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
              <Label htmlFor="remarkDate">{t('seasonPlans.date')}</Label>
              <Input
                id="remarkDate"
                type="date"
                value={remarkData.date}
                onChange={(e) => setRemarkData({ ...remarkData, date: e.target.value })}
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
              <Label htmlFor="remarkDescription">{t('seasonPlans.description')}</Label>
              <Textarea
                id="remarkDescription"
                placeholder={t('seasonPlans.descriptionPlaceholder')}
                value={remarkData.description}
                onChange={(e) => setRemarkData({ ...remarkData, description: e.target.value })}
                rows={4}
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
                  className="cursor-pointer"
                />
                <Button variant="outline" size="icon" type="button">
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
