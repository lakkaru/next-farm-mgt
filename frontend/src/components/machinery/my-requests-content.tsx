'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function MyRequestsContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Requests</h1>
      <Card>
        <CardHeader>
          <CardTitle>Service Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Your machinery service requests will be displayed here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
