'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ProfileContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Profile management will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
