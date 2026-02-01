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
import { AxiosResponse } from 'axios';
import { SeasonPlan } from '@/types/SeasonPlan';
import { Farm } from '../../types/SeasonPlan';

interface PaddyVariety {
  _id: string;
  name: string;
}

interface GrowingStage {
  stage: string;
  startDate: string;
  endDate: string;
  isCompleted: boolean;
  notes?: string;
}

interface FertilizerApplication {
  type: string;
  amount: number;
  unit: string;
  appliedDate: string;
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

        // console.log('=== API Responses ===');
        // console.log('Plan Response:', planResponse);
        // console.log('Plan Response Data:', planResponse.data);
        // console.log('Farms Response:', farmsResponse);
        // console.log('Varieties Response:', varietiesResponse);

        // Extract the plan data from the nested data property
        const planData = planResponse.data.data || planResponse.data;
        // console.log('Extracted Plan Data:', planData);

        const updatedFormData = {
          ...planData,
          farmId: typeof planData.farmId === 'object' ? planData.farmId._id : planData.farmId,
          paddyVariety: typeof planData.paddyVariety === 'object' ? planData.paddyVariety._id : planData.paddyVariety,
          irrigationMethod: planData.irrigationMethod === 'Under irrigation' ? 'Irrigated' : planData.irrigationMethod,
          cultivationDate: planData.cultivationDate ? new Date(planData.cultivationDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        };

        // console.log('Updated Form Data:', updatedFormData);
        setFormData(updatedFormData);

        const farmsData = Array.isArray(farmsResponse.data.data) ? farmsResponse.data.data : [];
        const varietiesData = Array.isArray(varietiesResponse.data.data) ? varietiesResponse.data.data : [];
        
        // console.log('Setting Farms:', farmsData);
        // console.log('Setting Varieties:', varietiesData);
        
        setFarms(farmsData);
        setPaddyVarieties(varietiesData);
      } catch (err) {
        console.error('Error fetching data:', err);
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
    setFormData((prev: Partial<SeasonPlan>) => ({ ...prev, [field]: value }));
  }, []);

  const addGrowingStage = useCallback(() => {
    setFormData((prev: Partial<SeasonPlan>) => ({
      ...prev,
      growingStages: [
        ...(prev.growingStages || []),
        {
          stage: 'land_preparation',
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0],
          isCompleted: false,
        },
      ],
    }));
  }, []);

  const removeGrowingStage = useCallback((index: number) => {
    setFormData((prev: Partial<SeasonPlan>) => ({
      ...prev,
      growingStages: prev.growingStages?.filter((_: any, i: number) => i !== index),
    }));
  }, []);

  const updateGrowingStage = useCallback((index: number, field: string, value: unknown) => {
    setFormData((prev: Partial<SeasonPlan>) => ({
      ...prev,
      growingStages: prev.growingStages?.map((stage: any, i: number) =>
        i === index ? { ...stage, [field]: value } : stage
      ),
    }));
  }, []);

  const addFertilizerApplication = useCallback(() => {
    setFormData((prev: Partial<SeasonPlan>) => ({
      ...prev,
      fertilizerSchedule: [
        ...(prev.fertilizerSchedule || []),
        {
          type: '',
          amount: 0,
          unit: 'kg',
          appliedDate: new Date().toISOString().split('T')[0],
          fertilizerType: '',
          quantity: 0,
          applied: false,
          date: new Date().toISOString().split('T')[0],
        },
      ],
    }));
  }, []);

  const removeFertilizerApplication = useCallback((index: number) => {
    setFormData((prev: Partial<SeasonPlan>) => ({
      ...prev,
      fertilizerSchedule: prev.fertilizerSchedule?.filter((_: any, i: number) => i !== index),
    }));
  }, []);

  const updateFertilizerApplication = useCallback((index: number, field: string, value: unknown) => {
    setFormData((prev: Partial<SeasonPlan>) => ({
      ...prev,
      fertilizerSchedule: prev.fertilizerSchedule?.map((app: any, i: number) =>
        i === index ? { ...app, [field]: value } : app
      ),
    }));
  }, []);

  const addExpense = useCallback(() => {
    setFormData((prev: Partial<SeasonPlan>) => ({
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
    setFormData((prev: Partial<SeasonPlan>) => ({
      ...prev,
      expenses: prev.expenses?.filter((_: any, i: number) => i !== index),
    }));
  }, []);

  const updateExpense = useCallback((index: number, field: string, value: unknown) => {
    setFormData((prev: Partial<SeasonPlan>) => ({
      ...prev,
      expenses: prev.expenses?.map((exp: any, i: number) =>
        i === index ? { ...exp, [field]: value } : exp
      ),
    }));
  }, []);

  const addDailyRemark = useCallback(() => {
    setFormData((prev: Partial<SeasonPlan>) => ({
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
    setFormData((prev: Partial<SeasonPlan>) => ({
      ...prev,
      dailyRemarks: prev.dailyRemarks?.filter((_: any, i: number) => i !== index),
    }));
  }, []);

  const updateDailyRemark = useCallback((index: number, field: string, value: unknown) => {
    setFormData((prev: Partial<SeasonPlan>) => ({
      ...prev,
      dailyRemarks: prev.dailyRemarks?.map((remark: any, i: number) =>
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
              {/* Farm */}
              <div className="space-y-2">
                <Label htmlFor="farmId">{t('seasonPlans.farm')}</Label>
                <Select
                  value={typeof formData.farmId === 'object' ? formData.farmId._id : formData.farmId || ''}
                  onValueChange={(value) => handleChange('farmId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a farm" />
                  </SelectTrigger>
                  <SelectContent>
                    {farms.map((farm) => (
                      <SelectItem key={farm._id} value={farm._id}>
                        {farm.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Season */}
              <div className="space-y-2">
                <Label htmlFor="season">{t('seasonPlans.season')}</Label>
                <Select
                  value={formData.season}
                  onValueChange={(value) => handleChange('season', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select season" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maha">{t('seasonPlans.seasons.maha')}</SelectItem>
                    <SelectItem value="yala">{t('seasonPlans.seasons.yala')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Irrigation Method */}
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
                    <SelectItem value="under_irrigation">{t('common.irrigationMethods.under_irrigation')}</SelectItem>
                    <SelectItem value="rain_fed">{t('common.irrigationMethods.rain_fed')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Planting Method */}
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
                    <SelectItem value="direct_seeding">{t('common.plantingMethods.direct_seeding')}</SelectItem>
                    <SelectItem value="transplanting">{t('common.plantingMethods.transplanting')}</SelectItem>
                    <SelectItem value="parachute_seeding">{t('common.plantingMethods.parachute_seeding')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Paddy Variety */}
              <div className="space-y-2">
                <Label htmlFor="paddyVariety">{t('seasonPlans.paddyVariety')}</Label>
                <Select
                  value={typeof formData.paddyVariety === 'object' ? formData.paddyVariety._id : formData.paddyVariety || ''}
                  onValueChange={(value) => handleChange('paddyVariety', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select paddy variety" />
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

              {/* Cultivating Area */}
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

              {/* Cultivation Date */}
              <div className="space-y-2">
                <Label htmlFor="cultivationDate">{t('seasonPlans.cultivationDate')}</Label>
                <Input
                  type="date"
                  value={formData.cultivationDate || ''}
                  onChange={(e) => handleChange('cultivationDate', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push(`/season-plans/${id}`)}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant="default" disabled={saving}>
            {t('common.update')}
          </Button>
        </div>
      </form>
    </div>
  );
}
