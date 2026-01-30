'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface EditSeasonPlanFormProps {
  planId: string
}

export function EditSeasonPlanForm({ planId }: EditSeasonPlanFormProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Season Plan</h1>
      <Card>
        <CardHeader>
          <CardTitle>Edit Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Editing plan ID: {planId}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
