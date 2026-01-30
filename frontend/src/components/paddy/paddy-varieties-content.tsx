'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useI18n } from '@/contexts/i18n-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { paddyVarietyAPI } from '@/lib/api'
import { Search, AlertCircle, Leaf } from 'lucide-react'

interface PaddyVariety {
  _id: string
  name: string
  popularName?: string
  type: string
  duration: string
  characteristics?: {
    averageYield?: string
    resistance?: string[]
    suitableZones?: string[]
    grainQuality?: {
      grainShape?: string
      pericarpColour?: string
    }
  }
  yearOfRelease?: number
  culmHeight?: string
  recommendation?: string
}

export function PaddyVarietiesContent() {
  const { t } = useI18n()
  const [varieties, setVarieties] = useState<PaddyVariety[]>([])
  const [filteredVarieties, setFilteredVarieties] = useState<PaddyVariety[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('')
  const [selectedGrainShape, setSelectedGrainShape] = useState<string>('')
  const [selectedGrainColor, setSelectedGrainColor] = useState<string>('')

  // Get unique grain shapes and colors from varieties
  const uniqueGrainShapes = Array.from(
    new Set(
      varieties
        .filter((v) => v.characteristics?.grainQuality?.grainShape)
        .map((v) => v.characteristics?.grainQuality?.grainShape)
    )
  )

  const uniqueGrainColors = Array.from(
    new Set(
      varieties
        .filter((v) => v.characteristics?.grainQuality?.pericarpColour)
        .map((v) => v.characteristics?.grainQuality?.pericarpColour)
    )
  )

  const uniqueTypes = Array.from(new Set(varieties.map((v) => v.type)))

  const loadVarieties = useCallback(async () => {
    try {
      setLoading(true)
      const response = await paddyVarietyAPI.getPaddyVarieties()
      const data = response.data.data || []
      setVarieties(data)
      setFilteredVarieties(data)
      setError('')
    } catch (err) {
      console.error('Error loading paddy varieties:', err)
      setError(t('paddyVarieties.noPaddyVarietiesAvailable'))
      setVarieties([])
      setFilteredVarieties([])
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    loadVarieties()
  }, [loadVarieties])

  useEffect(() => {
    let filtered = varieties

    // Filter by search term (name)
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (variety) =>
          variety.name.toLowerCase().includes(searchLower) ||
          variety.popularName?.toLowerCase().includes(searchLower)
      )
    }

    // Filter by type (age/duration)
    if (selectedType) {
      filtered = filtered.filter((variety) => variety.type === selectedType)
    }

    // Filter by grain shape (size)
    if (selectedGrainShape) {
      filtered = filtered.filter(
        (variety) => variety.characteristics?.grainQuality?.grainShape === selectedGrainShape
      )
    }

    // Filter by grain color
    if (selectedGrainColor) {
      filtered = filtered.filter(
        (variety) => variety.characteristics?.grainQuality?.pericarpColour === selectedGrainColor
      )
    }

    setFilteredVarieties(filtered)
  }, [searchTerm, selectedType, selectedGrainShape, selectedGrainColor, varieties])

  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedType('')
    setSelectedGrainShape('')
    setSelectedGrainColor('')
  }

  const hasActiveFilters =
    searchTerm || selectedType || selectedGrainShape || selectedGrainColor

  if (error && !loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('navigation.paddyVarieties')}</h1>
            <p className="text-muted-foreground mt-1">{t('paddyVarieties.subtitle')}</p>
          </div>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('navigation.paddyVarieties')}</h1>
          <p className="text-muted-foreground mt-1">{t('paddyVarieties.subtitle')}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('paddyVarieties.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">{t('common.filter')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Duration/Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('paddyVarieties.durationLabel')}</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option value="">{t('common.all')}</option>
                  {uniqueTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grain Shape Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('paddyVarieties.grainSizeLabel')}</label>
                <select
                  value={selectedGrainShape}
                  onChange={(e) => setSelectedGrainShape(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option value="">{t('common.all')}</option>
                  {uniqueGrainShapes.map((shape) => (
                    <option key={shape} value={shape}>
                      {shape}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grain Color Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('paddyVarieties.grainColorLabel')}</label>
                <select
                  value={selectedGrainColor}
                  onChange={(e) => setSelectedGrainColor(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option value="">{t('common.all')}</option>
                  {uniqueGrainColors.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearFilters}
                    className="w-full"
                  >
                    {t('common.clear')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      {!loading && varieties.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {t('paddyVarieties.showingCount', {
            shown: filteredVarieties.length,
            total: varieties.length,
          })}
        </p>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredVarieties.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Leaf className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm ? t('paddyVarieties.noVarietiesFound') : t('paddyVarieties.noPaddyVarietiesAvailable')}
            </h3>
            <p className="text-muted-foreground text-center max-w-md">
              {searchTerm
                ? t('paddyVarieties.noVarietiesMatch', { term: searchTerm })
                : t('common.noDataAvailable')}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Varieties Grid */}
      {!loading && filteredVarieties.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVarieties.map((variety) => (
            <Link key={variety._id} href={`/paddy/varieties/${variety._id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">{variety.name}</CardTitle>
                      {variety.popularName && (
                        <p className="text-sm text-muted-foreground mt-1">{variety.popularName}</p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Type Badge */}
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      {variety.type}
                    </Badge>
                  </div>

                  {/* Duration */}
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      {t('paddyVarieties.durationLabel')}
                    </p>
                    <p className="text-sm font-semibold">{variety.duration}</p>
                  </div>

                  {/* Year Released */}
                  {variety.yearOfRelease && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">
                        {t('paddyVarieties.releasedLabel')}
                      </p>
                      <p className="text-sm">{variety.yearOfRelease}</p>
                    </div>
                  )}

                  {/* Yield */}
                  {variety.characteristics?.averageYield && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">
                        {t('paddyVarieties.yieldLabel')}
                      </p>
                      <p className="text-sm">{variety.characteristics.averageYield}</p>
                    </div>
                  )}

                  {/* Grain Characteristics */}
                  {(variety.characteristics?.grainQuality?.grainShape ||
                    variety.characteristics?.grainQuality?.pericarpColour) && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">
                        {t('paddyVarieties.characteristicsTitle')}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {variety.characteristics?.grainQuality?.grainShape && (
                          <Badge variant="outline" className="text-xs">
                            {variety.characteristics.grainQuality.grainShape}
                          </Badge>
                        )}
                        {variety.characteristics?.grainQuality?.pericarpColour && (
                          <Badge variant="outline" className="text-xs">
                            {variety.characteristics.grainQuality.pericarpColour}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Resistance */}
                  {variety.characteristics?.resistance &&
                    variety.characteristics.resistance.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">
                          {t('paddyVarieties.resistanceLabel')}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {variety.characteristics.resistance.slice(0, 3).map((resist, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {resist}
                            </Badge>
                          ))}
                          {variety.characteristics.resistance.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{variety.characteristics.resistance.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                  {/* View Details Button */}
                  <Button variant="outline" className="w-full mt-4" size="sm">
                    {t('common.view')}
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
