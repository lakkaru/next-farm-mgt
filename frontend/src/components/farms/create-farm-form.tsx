'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function CreateFarmForm() {
  const router = useRouter()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Create New Farm</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Farm Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Farm creation form will be implemented here. This form will include
            fields for farm name, type, area, location, and other relevant details.
          </p>
          {/* TODO: Implement full form with validation */}
        </CardContent>
      </Card>
    </div>
  )
}
