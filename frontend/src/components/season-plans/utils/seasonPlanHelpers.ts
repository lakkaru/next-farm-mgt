import { Package, Beaker, Leaf, Activity, DollarSign, Droplets, FileText } from 'lucide-react'
import React from 'react';
import { SeasonPlan } from '@/types/SeasonPlan'

export function formatDate(date: string, t: (key: string) => string): string {
  if (!date) return t('common.notSpecified')
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function getStatusColor(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  const colors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    planned: 'secondary',
    active: 'default',
    completed: 'default',
    cancelled: 'destructive',
  }
  return colors[status] || 'default'
}

export function calculateTotalExpenses(plan: SeasonPlan | null): number {
  if (!plan?.expenses) return 0
  return plan.expenses.reduce((sum, expense) => sum + expense.amount, 0)
}

export function getCompletedStages(plan: SeasonPlan | null): number {
  if (!plan?.growingStages) return 0
  return plan.growingStages.filter((stage) => stage.isCompleted).length
}

export function getProgressPercentage(plan: SeasonPlan | null): number {
  if (!plan?.growingStages || plan.growingStages.length === 0) return 0
  return Math.round((getCompletedStages(plan) / plan.growingStages.length) * 100)
}

export function getCategoryIcon(category: string): React.ReactNode {
  const icons: Record<string, React.ReactNode> = {
    seeds: React.createElement(Package, { className: "h-4 w-4" }),
    fertilizer: React.createElement(Beaker, { className: "h-4 w-4" }),
    pesticides: React.createElement(Leaf, { className: "h-4 w-4" }),
    labor: React.createElement(Activity, { className: "h-4 w-4" }),
    machinery: React.createElement(DollarSign, { className: "h-4 w-4" }),
    irrigation: React.createElement(Droplets, { className: "h-4 w-4" }),
    other: React.createElement(FileText, { className: "h-4 w-4" }),
  }
  return icons[category] || React.createElement(FileText, { className: "h-4 w-4" })
}

export function generateYouTubeSearchLink(stageName: string): string {
  const query = encodeURIComponent(`paddy ${stageName} farming`)
  return `https://www.youtube.com/results?search_query=${query}`
}

export function calculatePlantAge(cultivationDate: string): number {
  const plantingDate = new Date(cultivationDate)
  const today = new Date()
  const diffTime = Math.abs(today.getTime() - plantingDate.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function calculateUreaRecommendation(leafColorIndex: number, plantAge: number): number {
  // LCC-based urea recommendation logic
  // Lower LCC values (lighter green) indicate nitrogen deficiency
  if (leafColorIndex >= 5) {
    return 0 // No urea needed
  } else if (leafColorIndex === 4) {
    return plantAge < 30 ? 25 : 30 // kg/ha
  } else if (leafColorIndex === 3) {
    return plantAge < 30 ? 35 : 40
  } else {
    return plantAge < 30 ? 45 : 50
  }
}
