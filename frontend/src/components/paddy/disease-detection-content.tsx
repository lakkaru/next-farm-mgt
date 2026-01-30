'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function DiseaseDetectionContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Disease Detection</h1>
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Disease Detection</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Upload an image of your crop to detect potential diseases using AI.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
