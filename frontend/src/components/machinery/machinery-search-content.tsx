'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function MachinerySearchContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Search Machinery</h1>
      <Card>
        <CardHeader>
          <CardTitle>Find Machinery</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Machinery search functionality will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
