'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function MyMachineryContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Machinery</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Machinery Listings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Your machinery listings will be displayed here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
