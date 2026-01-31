'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { farmAPI } from '@/lib/api'
import { formatArea } from '@/lib/utils'
import { toast } from 'sonner'
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  MapPin,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react'

interface Farm {
  _id: string
  name: string
  type: string
  farmType?: string
  district?: string
  cultivationZone?: string
  description?: string
  totalArea?: number | { value: number; unit: string }
  area?: number | { value: number; unit: string }
  address?: {
    street?: string
    city?: string
    district?: string
    province?: string
  }
}

const farmTypeColors: Record<string, string> = {
  crop: 'success',
  livestock: 'warning',
  mixed: 'info',
  aquaculture: 'default',
  poultry: 'secondary',
}

export function FarmsPageContent() {
  const router = useRouter()
  const [farms, setFarms] = useState<Farm[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    farm: Farm | null
  }>({ open: false, farm: null })

  const loadFarms = useCallback(async () => {
    try {
      setLoading(true)
      const response = await farmAPI.getFarms()
      setFarms(response.data.data || [])
    } catch (error) {
      console.error('Error loading farms:', error)
      toast.error('Failed to load farms')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadFarms()
  }, [loadFarms])

  const handleDelete = async () => {
    if (!deleteDialog.farm) return
    try {
      await farmAPI.deleteFarm(deleteDialog.farm._id)
      toast.success('Farm deleted successfully')
      setDeleteDialog({ open: false, farm: null })
      loadFarms()
    } catch (error) {
      console.error('Error deleting farm:', error)
      toast.error('Failed to delete farm')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Farm Management</h1>
        </div>
        <Link href="/farms/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Farm
          </Button>
        </Link>
      </div>

      {/* Farm Cards */}
      {farms.length === 0 ? (
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Farms Yet</h3>
            <p className="text-muted-foreground mb-4">
              You haven&apos;t registered any farms. Get started by adding your
              first farm.
            </p>
            <Link href="/farms/create">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Your First Farm
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map((farm) => (
            <Card
              key={farm._id}
              className="flex flex-col cursor-pointer hover:shadow-lg transition-shadow duration-300"
              onClick={() => router.push(`/farms/${farm._id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">{farm.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {farm.district && farm.cultivationZone
                        ? `${farm.district}, ${farm.cultivationZone}`
                        : farm.district || 'Location not set'}
                    </p>
                  </div>
                  <Badge
                    variant={
                      (farmTypeColors[farm.farmType || farm.type] as
                        | 'default'
                        | 'success'
                        | 'warning'
                        | 'info'
                        | 'secondary') || 'default'
                    }
                    className="whitespace-nowrap"
                  >
                    {farm.farmType || farm.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span>{formatArea(farm.totalArea || farm.area)}</span>
                  </div>

                  {farm.description && (
                    <div className="mt-2">
                      <p className="text-muted-foreground line-clamp-3">
                        {farm.description}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter
                className="flex gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => router.push(`/farms/${farm._id}`)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => router.push(`/farms/${farm._id}/edit`)}
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setDeleteDialog({ open: true, farm })}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog({ open, farm: open ? deleteDialog.farm : null })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Farm</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleteDialog.farm?.name}
              &quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, farm: null })}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
