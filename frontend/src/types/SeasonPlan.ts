// This file contains the SeasonPlan interface used across the application.

export interface SeasonPlan {
  _id?: string;
  farmId?: {
    _id: string;
    name: string;
    district?: string;
  };
  season?: string;
  climateZone?: string;
  irrigationMethod?: string;
  plantingMethod?: string;
  paddyVariety?: {
    _id: string;
    name: string;
  };
  cultivatingArea?: string;
  areaUnit?: string;
  cultivationDate?: string;
  seedingDate?: string;
  transplantingDate?: string;
  status?: string;
  expectedHarvestDate?: string;
  actualHarvestDate?: string;
  estimatedYield?: string;
  actualYield?: string;
  yieldUnit?: string; // Added to match formData usage
  harvestQuality?: string;
  harvestNotes?: string;
  growingStages?: Array<{
    stage: string;
    description?: string;
    startDate: string;
    endDate?: string;
    isCompleted: boolean;
    implementedDate?: string;
    implementedEndDate?: string;
    implementationNotes?: string;
  }>;
  fertilizerSchedule?: Array<{
    stage?: string;
    type?: string;
    date: string;
    fertilizerType: string;
    quantity: number;
    amount?: number;
    unit: string;
    applied: boolean;
    status?: string;
    appliedDate?: string;
    implementedDate?: string;
    description?: string;
    applicationNotes?: string;
    notes?: string;
    fertilizers?: Record<string, number>;
    applicationDate?: string; // Added to match fertilizerSchedule field references
  }>;
  expenses?: Array<{
    category: string;
    description: string;
    amount: number;
    date: string;
    paymentMethod?: string;
  }>;
  dailyRemarks?: Array<{
    date: string;
    remark: string;
    category?: string;
    title?: string;
    description?: string;
    images?: Array<any>;
  }>;
}

export interface Farm {
  _id: string;
  name: string;
  location?: Record<string, any>;
  totalArea?: Record<string, any>;
  cultivatedArea?: Record<string, any>;
}