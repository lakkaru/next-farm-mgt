import { toast } from 'react-toastify';
import { SeasonPlan } from '@/types/SeasonPlan';
import { seasonPlanAPI } from '@/lib/api';

export const saveStageImplementation = async (
  plan: SeasonPlan | null,
  stageDialog: { open: boolean; index: number },
  stageImplementationData: { implementedDate: string; implementedEndDate: string; notes: string },
  setPlan: (plan: SeasonPlan | null) => void,
  setStageDialog: (dialog: { open: boolean; index: number }) => void,
  t: (key: string) => string,
  planId: string
) => {
  if (!plan || stageDialog.index < 0) return;

  try {
    const updatedStages = [...(plan.growingStages || [])];
    const isNewImplementation = !updatedStages[stageDialog.index].isCompleted;

    updatedStages[stageDialog.index] = {
      ...updatedStages[stageDialog.index],
      isCompleted: true,
      implementedDate: stageImplementationData.implementedDate,
      implementedEndDate:
        stageImplementationData.implementedEndDate || stageImplementationData.implementedDate,
      implementationNotes: stageImplementationData.notes,
    };

    // Transform to backend format
    const backendStages = updatedStages.map((stage) => ({
      ...stage,
      completed: stage.isCompleted,
      notes: stage.implementationNotes,
    }));

    await seasonPlanAPI.updateSeasonPlan(planId, {
      ...plan,
      growingStages: backendStages,
    });

    setPlan({ ...plan, growingStages: updatedStages });
    setStageDialog({ open: false, index: -1 });
    toast.success(
      t(isNewImplementation ? 'seasonPlans.stageMarkedComplete' : 'seasonPlans.stageUpdated')
    );
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } };
    toast.error(error.response?.data?.message || t('common.error'));
  }
};

export const saveFertilizerImplementation = async (
  plan: SeasonPlan | null,
  fertilizerDialog: { open: boolean; index: number },
  fertilizerImplementationData: { appliedDate: string; notes: string },
  setPlan: (plan: SeasonPlan | null) => void,
  setFertilizerDialog: (dialog: { open: boolean; index: number }) => void,
  t: (key: string) => string,
  planId: string
) => {
  if (!plan || fertilizerDialog.index < 0) return;

  try {
    const updatedFertilizers = [...(plan.fertilizerSchedule || [])];
    const isNewApplication = !updatedFertilizers[fertilizerDialog.index].applied;

    updatedFertilizers[fertilizerDialog.index] = {
      ...updatedFertilizers[fertilizerDialog.index],
      applied: true,
      appliedDate: fertilizerImplementationData.appliedDate,
      notes: fertilizerImplementationData.notes,
      date: fertilizerImplementationData.appliedDate,
    };

    await seasonPlanAPI.updateSeasonPlan(planId, {
      ...plan,
      fertilizerSchedule: updatedFertilizers,
    });

    setPlan({ ...plan, fertilizerSchedule: updatedFertilizers });
    setFertilizerDialog({ open: false, index: -1 });
    toast.success(
      t(isNewApplication ? 'seasonPlans.fertilizerMarkedApplied' : 'seasonPlans.fertilizerUpdated')
    );
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } };
    toast.error(error.response?.data?.message || t('common.error'));
  }
};