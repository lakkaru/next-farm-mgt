'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function DiseaseReferencesContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Disease References</h1>
      <Card>
        <CardHeader>
          <CardTitle>Reference Images</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Disease reference management will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
