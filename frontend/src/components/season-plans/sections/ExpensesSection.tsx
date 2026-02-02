'use client'

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { BarChart3, DollarSign, Plus, Calendar, Edit, Trash2 } from 'lucide-react'
import { SeasonPlan } from '@/types/SeasonPlan'

interface ExpensesSectionProps {
  plan: SeasonPlan
  t: (key: string) => string
  formatDate: (date: string) => string
  calculateTotalExpenses: () => number
  getCategoryIcon: (category: string) => React.ReactNode
  openExpenseDialog: (index?: number) => void
  deleteExpense: (index: number) => void
}

export function ExpensesSection({
  plan,
  t,
  formatDate,
  calculateTotalExpenses,
  getCategoryIcon,
  openExpenseDialog,
  deleteExpense,
}: ExpensesSectionProps) {
  return (
    <AccordionItem value="expenses" className="border rounded-lg px-6">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-5 w-5 text-primary" />
          <div className="flex items-center gap-4">
            <span className="font-semibold">{t('seasonPlans.expenses')}</span>
            {plan.expenses && plan.expenses.length > 0 && (
              <div className="flex items-center gap-2 text-lg font-bold text-primary">
                <DollarSign className="h-5 w-5" />
                <span>LKR {calculateTotalExpenses().toLocaleString()}</span>
              </div>
            )}
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
        {plan.expenses && plan.expenses.length > 0 ? (
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
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">{t('seasonPlans.noExpenses')}</p>
            <p className="text-xs mt-1">{t('seasonPlans.clickAddToStart')}</p>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  )
}
