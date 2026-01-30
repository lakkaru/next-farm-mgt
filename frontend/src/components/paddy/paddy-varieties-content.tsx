'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function PaddyVarietiesContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Paddy Varieties</h1>
      <Card>
        <CardHeader>
          <CardTitle>Available Varieties</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Paddy varieties listing will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
