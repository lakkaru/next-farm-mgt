'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { seasonPlanAPI, farmAPI, paddyVarietyAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Trash2, Loader2 } from 'lucide-react';

interface Farm {
  _id: string;
  farmName: string;
  district: string;
}

interface PaddyVariety {
  _id: string;
  name: string;
}

interface GrowingStage {
  stage: string;
  startDate: string;
  endDate: string;
  completed: boolean;
  notes?: string;
}

interface FertilizerApplication {
  type: string;
  amount: number;
  unit: string;
  applicationDate: string;
  applied: boolean;
  notes?: string;
}

interface Expense {
  category: string;
  amount: number;
  description: string;
  date: string;
}

interface DailyRemark {
  date: string;
  remark: string;
}

interface SeasonPlan {
  _id: string;
  farmId: Farm | string;
  season: string;
  cultivationDate: string;
  seedingDate?: string;
  transplantingDate?: string;
  expectedHarvestDate: string;
  actualHarvestDate?: string;
  estimatedYield?: number;
  actualYield?: number;
  yieldUnit?: string;
  district: string;
  climateZone: string;
  irrigationMethod: string;
  plantingMethod: string;
  paddyVariety: PaddyVariety | string;
  cultivatingArea: number;
  areaUnit: string;
  status: string;
  growingStages?: GrowingStage[];
  fertilizerSchedule?: FertilizerApplication[];
  expenses?: Expense[];
  dailyRemarks?: DailyRemark[];
}

interface EditSeasonPlanContentProps {
  id: string;
}

export default function EditSeasonPlanContent({ id }: EditSeasonPlanContentProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [paddyVarieties, setPaddyVarieties] = useState<PaddyVariety[]>([]);
  
  const [formData, setFormData] = useState<Partial<SeasonPlan>>({
    season: 'maha',
    irrigationMethod: 'Rain fed',
    plantingMethod: 'transplanting',
    status: 'planned',
    areaUnit: 'acres',
    yieldUnit: 'kg',
    growingStages: [],
    fertilizerSchedule: [],
    expenses: [],
    dailyRemarks: [],
  });

  // Fetch season plan data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [planResponse, farmsResponse, varietiesResponse] = await Promise.all([
          seasonPlanAPI.getSeasonPlan(id),
          farmAPI.getFarms(),
          paddyVarietyAPI.getPaddyVarieties(),
        ]);

        setFormData({
          ...planResponse.data,
          farmId: typeof planResponse.data.farmId === 'object' 
            ? planResponse.data.farmId._id 
            : planResponse.data.farmId,
          paddyVariety: typeof planResponse.data.paddyVariety === 'object'
            ? planResponse.data.paddyVariety._id
            : planResponse.data.paddyVariety,
        });
        setFarms(farmsResponse.data || []);
        setPaddyVarieties(varietiesResponse.data || []);
      } catch (err) {
        setError(t('seasonPlans.errors.loadFailed'));
        toast.error(t('seasonPlans.errors.loadFailed'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      await seasonPlanAPI.updateSeasonPlan(id, formData);
      toast.success(t('seasonPlans.success.updated'));
      router.push(`/season-plans/${id}`);
    } catch (err) {
      toast.error(t('seasonPlans.errors.updateFailed'));
    } finally {
      setSaving(false);
    }
  };

  const handleChange = useCallback((field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const addGrowingStage = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      growingStages: [
        ...(prev.growingStages || []),
        {
          stage: 'land_preparation',
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0],
          completed: false,
        },
      ],
    }));
  }, []);

  const removeGrowingStage = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      growingStages: prev.growingStages?.filter((_, i) => i !== index),
    }));
  }, []);

  const updateGrowingStage = useCallback((index: number, field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      growingStages: prev.growingStages?.map((stage, i) =>
        i === index ? { ...stage, [field]: value } : stage
      ),
    }));
  }, []);

  const addFertilizerApplication = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      fertilizerSchedule: [
        ...(prev.fertilizerSchedule || []),
        {
          type: '',
          amount: 0,
          unit: 'kg',
          applicationDate: new Date().toISOString().split('T')[0],
          applied: false,
        },
      ],
    }));
  }, []);

  const removeFertilizerApplication = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      fertilizerSchedule: prev.fertilizerSchedule?.filter((_, i) => i !== index),
    }));
  }, []);

  const updateFertilizerApplication = useCallback((index: number, field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      fertilizerSchedule: prev.fertilizerSchedule?.map((app, i) =>
        i === index ? { ...app, [field]: value } : app
      ),
    }));
  }, []);

  const addExpense = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      expenses: [
        ...(prev.expenses || []),
        {
          category: 'other',
          amount: 0,
          description: '',
          date: new Date().toISOString().split('T')[0],
        },
      ],
    }));
  }, []);

  const removeExpense = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      expenses: prev.expenses?.filter((_, i) => i !== index),
    }));
  }, []);

  const updateExpense = useCallback((index: number, field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      expenses: prev.expenses?.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      ),
    }));
  }, []);

  const addDailyRemark = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      dailyRemarks: [
        ...(prev.dailyRemarks || []),
        {
          date: new Date().toISOString().split('T')[0],
          remark: '',
        },
      ],
    }));
  }, []);

  const removeDailyRemark = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      dailyRemarks: prev.dailyRemarks?.filter((_, i) => i !== index),
    }));
  }, []);

  const updateDailyRemark = useCallback((index: number, field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      dailyRemarks: prev.dailyRemarks?.map((remark, i) =>
        i === index ? { ...remark, [field]: value } : remark
      ),
    }));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/season-plans/${id}`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">{t('seasonPlans.editPlan')}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t('seasonPlans.basicInfo')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="farmId">{t('seasonPlans.farm')}</Label>
                <Select
                  value={formData.farmId as string}
                  onValueChange={(value) => handleChange('farmId', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {farms.map((farm) => (
                      <SelectItem key={farm._id} value={farm._id}>
                        {farm.farmName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="season">{t('seasonPlans.season')}</Label>
                <Select
                  value={formData.season}
                  onValueChange={(value) => handleChange('season', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maha">{t('seasonPlans.seasons.maha')}</SelectItem>
                    <SelectItem value="yala">{t('seasonPlans.seasons.yala')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="irrigationMethod">{t('seasonPlans.irrigationMethod')}</Label>
                <Select
                  value={formData.irrigationMethod}
                  onValueChange={(value) => handleChange('irrigationMethod', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rain fed">
                      {t('seasonPlans.irrigationMethods.Rain fed')}
                    </SelectItem>
                    <SelectItem value="Under irrigation">
                      {t('seasonPlans.irrigationMethods.Under irrigation')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="plantingMethod">{t('seasonPlans.plantingMethod')}</Label>
                <Select
                  value={formData.plantingMethod}
                  onValueChange={(value) => handleChange('plantingMethod', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="direct_seeding">
                      {t('seasonPlans.plantingMethods.direct_seeding')}
                    </SelectItem>
                    <SelectItem value="transplanting">
                      {t('seasonPlans.plantingMethods.transplanting')}
                    </SelectItem>
                    <SelectItem value="parachute_seeding">
                      {t('seasonPlans.plantingMethods.parachute_seeding')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paddyVariety">{t('seasonPlans.paddyVariety')}</Label>
                <Select
                  value={formData.paddyVariety as string}
                  onValueChange={(value) => handleChange('paddyVariety', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paddyVarieties.map((variety) => (
                      <SelectItem key={variety._id} value={variety._id}>
                        {variety.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cultivatingArea">{t('seasonPlans.cultivatingArea')}</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.cultivatingArea || ''}
                    onChange={(e) => handleChange('cultivatingArea', parseFloat(e.target.value))}
                    className="flex-1"
                  />
                  <Select
                    value={formData.areaUnit}
                    onValueChange={(value) => handleChange('areaUnit', value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hectares">{t('seasonPlans.units.hectares')}</SelectItem>
                      <SelectItem value="acres">{t('seasonPlans.units.acres')}</SelectItem>
                      <SelectItem value="perches">{t('seasonPlans.units.perches')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">{t('seasonPlans.status')}</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planned">{t('seasonPlans.statuses.planned')}</SelectItem>
                    <SelectItem value="active">{t('seasonPlans.statuses.active')}</SelectItem>
                    <SelectItem value="completed">{t('seasonPlans.statuses.completed')}</SelectItem>
                    <SelectItem value="cancelled">{t('seasonPlans.statuses.cancelled')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>{t('seasonPlans.timeline')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cultivationDate">{t('seasonPlans.cultivationDate')}</Label>
                <Input
                  type="date"
                  value={formData.cultivationDate || ''}
                  onChange={(e) => handleChange('cultivationDate', e.target.value)}
                />
              </div>

              {formData.plantingMethod === 'transplanting' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="seedingDate">{t('seasonPlans.seedingDate')}</Label>
                    <Input
                      type="date"
                      value={formData.seedingDate || ''}
                      onChange={(e) => handleChange('seedingDate', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transplantingDate">{t('seasonPlans.transplantingDate')}</Label>
                    <Input
                      type="date"
                      value={formData.transplantingDate || ''}
                      onChange={(e) => handleChange('transplantingDate', e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="expectedHarvestDate">{t('seasonPlans.expectedHarvest')}</Label>
                <Input
                  type="date"
                  value={formData.expectedHarvestDate || ''}
                  onChange={(e) => handleChange('expectedHarvestDate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="actualHarvestDate">{t('seasonPlans.actualHarvest')}</Label>
                <Input
                  type="date"
                  value={formData.actualHarvestDate || ''}
                  onChange={(e) => handleChange('actualHarvestDate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedYield">{t('seasonPlans.estimatedYield')}</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.estimatedYield || ''}
                    onChange={(e) => handleChange('estimatedYield', parseFloat(e.target.value))}
                    className="flex-1"
                  />
                  <Select
                    value={formData.yieldUnit}
                    onValueChange={(value) => handleChange('yieldUnit', value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">{t('seasonPlans.units.kg')}</SelectItem>
                      <SelectItem value="tons">{t('seasonPlans.units.tons')}</SelectItem>
                      <SelectItem value="bags">{t('seasonPlans.units.bags')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="actualYield">{t('seasonPlans.actualYield')}</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.actualYield || ''}
                    onChange={(e) => handleChange('actualYield', parseFloat(e.target.value))}
                    className="flex-1"
                  />
                  <Select
                    value={formData.yieldUnit}
                    onValueChange={(value) => handleChange('yieldUnit', value)}
                    disabled
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Growing Stages */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('seasonPlans.growingStages')}</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addGrowingStage}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Stage
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.growingStages?.map((stage, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Stage {index + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeGrowingStage(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Stage Type</Label>
                    <Select
                      value={stage.stage}
                      onValueChange={(value) => updateGrowingStage(index, 'stage', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="land_preparation">
                          {t('seasonPlans.stages.land_preparation')}
                        </SelectItem>
                        <SelectItem value="nursery">{t('seasonPlans.stages.nursery')}</SelectItem>
                        <SelectItem value="transplanting">
                          {t('seasonPlans.stages.transplanting')}
                        </SelectItem>
                        <SelectItem value="tillering">{t('seasonPlans.stages.tillering')}</SelectItem>
                        <SelectItem value="flowering">{t('seasonPlans.stages.flowering')}</SelectItem>
                        <SelectItem value="grain_filling">
                          {t('seasonPlans.stages.grain_filling')}
                        </SelectItem>
                        <SelectItem value="maturity">{t('seasonPlans.stages.maturity')}</SelectItem>
                        <SelectItem value="harvest">{t('seasonPlans.stages.harvest')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={stage.startDate}
                      onChange={(e) => updateGrowingStage(index, 'startDate', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={stage.endDate}
                      onChange={(e) => updateGrowingStage(index, 'endDate', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={stage.completed}
                        onChange={(e) => updateGrowingStage(index, 'completed', e.target.checked)}
                      />
                      Completed
                    </Label>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Notes</Label>
                    <Textarea
                      value={stage.notes || ''}
                      onChange={(e) => updateGrowingStage(index, 'notes', e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Fertilizer Schedule */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('seasonPlans.fertilizerSchedule')}</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addFertilizerApplication}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Application
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.fertilizerSchedule?.map((app, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Application {index + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFertilizerApplication(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Input
                      value={app.type}
                      onChange={(e) => updateFertilizerApplication(index, 'type', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Application Date</Label>
                    <Input
                      type="date"
                      value={app.applicationDate}
                      onChange={(e) => updateFertilizerApplication(index, 'applicationDate', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Amount</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        step="0.01"
                        value={app.amount}
                        onChange={(e) => updateFertilizerApplication(index, 'amount', parseFloat(e.target.value))}
                        className="flex-1"
                      />
                      <Select
                        value={app.unit}
                        onValueChange={(value) => updateFertilizerApplication(index, 'unit', value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">{t('seasonPlans.units.kg')}</SelectItem>
                          <SelectItem value="bags">{t('seasonPlans.units.bags')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={app.applied}
                        onChange={(e) => updateFertilizerApplication(index, 'applied', e.target.checked)}
                      />
                      Applied
                    </Label>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Notes</Label>
                    <Textarea
                      value={app.notes || ''}
                      onChange={(e) => updateFertilizerApplication(index, 'notes', e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Expenses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('seasonPlans.expenses')}</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addExpense}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.expenses?.map((expense, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Expense {index + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExpense(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={expense.category}
                      onValueChange={(value) => updateExpense(index, 'category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="seeds">
                          {t('seasonPlans.expenseCategories.seeds')}
                        </SelectItem>
                        <SelectItem value="fertilizer">
                          {t('seasonPlans.expenseCategories.fertilizer')}
                        </SelectItem>
                        <SelectItem value="pesticides">
                          {t('seasonPlans.expenseCategories.pesticides')}
                        </SelectItem>
                        <SelectItem value="labor">
                          {t('seasonPlans.expenseCategories.labor')}
                        </SelectItem>
                        <SelectItem value="machinery">
                          {t('seasonPlans.expenseCategories.machinery')}
                        </SelectItem>
                        <SelectItem value="irrigation">
                          {t('seasonPlans.expenseCategories.irrigation')}
                        </SelectItem>
                        <SelectItem value="other">
                          {t('seasonPlans.expenseCategories.other')}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={expense.date}
                      onChange={(e) => updateExpense(index, 'date', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Amount (LKR)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={expense.amount}
                      onChange={(e) => updateExpense(index, 'amount', parseFloat(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Description</Label>
                    <Textarea
                      value={expense.description}
                      onChange={(e) => updateExpense(index, 'description', e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Daily Remarks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('seasonPlans.dailyRemarks')}</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addDailyRemark}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Remark
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.dailyRemarks?.map((remark, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Remark {index + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDailyRemark(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={remark.date}
                      onChange={(e) => updateDailyRemark(index, 'date', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Remark</Label>
                    <Textarea
                      value={remark.remark}
                      onChange={(e) => updateDailyRemark(index, 'remark', e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/season-plans/${id}`)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
