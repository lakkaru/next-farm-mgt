'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useI18n } from '@/contexts/i18n-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    AlertCircle,
    Beaker,
    Bug,
    CheckCircle2,
    Droplets,
    Info,
    Leaf,
    Pill,
    Shield,
    Zap,
    Loader2,
} from 'lucide-react'
import { getAllDiseases, getDiseaseCategories, DiseaseInfo, DiseaseCategory } from '@/sanity/lib/queries'

export function DiseaseDetectionContent() {
    const { t } = useI18n()
    const [selectedDisease, setSelectedDisease] = useState<DiseaseInfo | null>(null)
    const [diseases, setDiseases] = useState<DiseaseInfo[]>([])
    const [categories, setCategories] = useState<DiseaseCategory[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState<string>('all')

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true)
                const [diseasesData, categoriesData] = await Promise.all([
                    getAllDiseases(),
                    getDiseaseCategories(),
                ])
                setDiseases(diseasesData)
                setCategories(categoriesData)
            } catch (error) {
                console.error('Error fetching disease data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const getSeverityColor = (severity: string) => {
        if (severity === 'high') return 'destructive'
        if (severity === 'medium') return 'secondary'
        return 'default'
    }

    const getSeverityTranslation = (severity: string) => {
        if (severity === 'high') return t('diseaseDetection.severity.highImpact')
        if (severity === 'medium') return t('diseaseDetection.severity.mediumImpact')
        return t('diseaseDetection.severity.lowImpact')
    }

    const getCategoryIcon = (iconName?: string) => {
        type IconType = React.FC<{ className?: string }>
        const icons: { [key: string]: IconType } = {
            Leaf,
            Bug,
            Droplets,
            AlertCircle,
            Shield,
            Zap,
        }
        return icons[iconName || 'Leaf'] || Leaf
    }

    const filteredDiseases = selectedCategory === 'all'
        ? diseases
        : diseases.filter(d => d.category?.slug?.current === selectedCategory)

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    {t('diseaseDetection.title')}
                </h1>
                <p className="text-muted-foreground mt-2">
                    {t('diseaseDetection.subtitle')}
                </p>
            </div>

            {/* Info Alert */}
            <Alert>
                <Beaker className="h-4 w-4" />
                <AlertDescription>
                    <strong>{t('diseaseDetection.aiNoteTitle')}</strong> {t('diseaseDetection.aiNote')}
                </AlertDescription>
            </Alert>

            {/* Category Tabs */}
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto">
                    <TabsTrigger value="all" className="gap-2">
                        <Leaf className="h-4 w-4" />
                        {t('diseaseDetection.allCategories')}
                    </TabsTrigger>
                    {categories.map((category) => {
                        const Icon = getCategoryIcon(category.icon)
                        return (
                            <TabsTrigger key={category._id} value={category.slug.current} className="gap-2">
                                <Icon className="h-4 w-4" />
                                {category.name}
                            </TabsTrigger>
                        )
                    })}
                </TabsList>

                <TabsContent value={selectedCategory} className="mt-6">
                    {/* Disease Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredDiseases.map((disease) => (
                            <Card
                                key={disease._id}
                                className="h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer overflow-hidden"
                                onClick={() => setSelectedDisease(disease)}
                            >
                                {/* Image */}
                                <div className="relative w-full h-40 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center overflow-hidden">
                                    {disease.mainImage?.asset?.url ? (
                                        <Image
                                            src={disease.mainImage.asset.url}
                                            alt={disease.mainImage.alt || disease.name}
                                            className="w-full h-full object-cover"
                                            width={400}
                                            height={160}
                                        />
                                    ) : (
                                        <Leaf className="h-12 w-12 text-slate-400" />
                                    )}
                                    <Badge
                                        variant={getSeverityColor(disease.severity)}
                                        className="absolute top-2 right-2"
                                    >
                                        {getSeverityTranslation(disease.severity)}
                                    </Badge>
                                </div>

                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        {disease.name}
                                        {disease.category && (
                                            <span className="block text-sm font-normal text-muted-foreground mt-1">
                                                {disease.category.name}
                                            </span>
                                        )}
                                    </CardTitle>
                                    {disease.scientificName && (
                                        <p className="text-xs italic text-muted-foreground">
                                            {disease.scientificName}
                                        </p>
                                    )}
                                </CardHeader>

                                <CardContent className="space-y-3">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-2">
                                            <strong>{t('diseaseDetection.keySymptomsLabel')}</strong>
                                        </p>
                                        <ul className="space-y-1">
                                            {disease.symptoms.slice(0, 2).map((symptom, idx) => (
                                                <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                                                    <span>•</span>
                                                    <span>{symptom}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {disease.criticalStages && (
                                        <div className="pt-2">
                                            <p className="text-xs text-primary font-semibold">
                                                {t('diseaseDetection.criticalStageLabel')} {disease.criticalStages}
                                            </p>
                                        </div>
                                    )}

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setSelectedDisease(disease)
                                        }}
                                    >
                                        <Info className="h-4 w-4 mr-2" />
                                        {t('diseaseDetection.viewCompleteGuide')}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {filteredDiseases.length === 0 && (
                        <div className="text-center py-12">
                            <Leaf className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">
                                No diseases or deficiencies found in this category yet.
                            </p>
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Detail Dialog */}
            <Dialog open={!!selectedDisease} onOpenChange={(open) => !open && setSelectedDisease(null)}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    {selectedDisease && (
                        <>
                            <DialogHeader>
                                <div className="space-y-2">
                                    <DialogTitle className="text-xl">
                                        {selectedDisease.name}
                                        {selectedDisease.scientificName && (
                                            <span className="block text-sm font-normal italic text-muted-foreground mt-1">
                                                {selectedDisease.scientificName}
                                            </span>
                                        )}
                                    </DialogTitle>
                                    <div className="flex gap-2">
                                        <Badge variant={getSeverityColor(selectedDisease.severity)}>
                                            {getSeverityTranslation(selectedDisease.severity)}
                                        </Badge>
                                        {selectedDisease.category && (
                                            <Badge variant="outline">
                                                {selectedDisease.category.name}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </DialogHeader>

                            <div className="space-y-6">
                                {/* Disease Image */}
                                {selectedDisease.mainImage?.asset?.url && (
                                    <div className="w-full bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
                                        <Image
                                            src={selectedDisease.mainImage.asset.url}
                                            alt={selectedDisease.mainImage.alt || selectedDisease.name}
                                            className="w-full h-auto max-h-96 object-cover"
                                            width={600}
                                            height={400}
                                        />
                                    </div>
                                )}

                                {/* Description */}
                                {selectedDisease.description && (
                                    <div className="bg-slate-50 rounded-lg p-4">
                                        <p className="text-sm">{selectedDisease.description}</p>
                                    </div>
                                )}

                                {/* Visual Signs */}
                                {selectedDisease.visualSigns && selectedDisease.visualSigns.length > 0 && (
                                    <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                                        <h3 className="font-semibold flex items-center gap-2 text-primary">
                                            <Zap className="h-4 w-4" />
                                            {t('diseaseDetection.visualSignsTitle')}
                                        </h3>
                                        <ul className="space-y-2">
                                            {selectedDisease.visualSigns.map((sign, idx) => (
                                                <li key={idx} className="text-sm flex gap-2">
                                                    <span className="text-muted-foreground">•</span>
                                                    <span>{sign}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* All Symptoms */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                                        {t('diseaseDetection.allSymptomsTitle')}
                                    </h3>
                                    <ul className="space-y-2">
                                        {selectedDisease.symptoms.map((symptom, idx) => (
                                            <li key={idx} className="text-sm flex gap-2">
                                                <span className="text-yellow-600">•</span>
                                                <span>{symptom}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Common Causes */}
                                {selectedDisease.causes && selectedDisease.causes.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="font-semibold flex items-center gap-2">
                                            <Info className="h-4 w-4" />
                                            {t('diseaseDetection.commonCausesTitle')}
                                        </h3>
                                        <ul className="space-y-2">
                                            {selectedDisease.causes.map((cause, idx) => (
                                                <li key={idx} className="text-sm flex gap-2">
                                                    <span>•</span>
                                                    <span>{cause}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Treatment */}
                                <div className="space-y-3 bg-green-50 rounded-lg p-4">
                                    <h3 className="font-semibold flex items-center gap-2 text-green-700">
                                        <Pill className="h-4 w-4" />
                                        {t('diseaseDetection.treatmentProtocolTitle')}
                                    </h3>
                                    {selectedDisease.timing && (
                                        <Alert variant="default" className="bg-green-100 border-green-300">
                                            <AlertDescription className="text-sm">
                                                <strong>{t('diseaseDetection.timingLabel')}</strong> {selectedDisease.timing}
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                    <ul className="space-y-2">
                                        {selectedDisease.treatment.map((treatment, idx) => (
                                            <li key={idx} className="text-sm flex gap-2">
                                                <span className="text-green-700">•</span>
                                                <span>{treatment}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Prevention */}
                                {selectedDisease.prevention && selectedDisease.prevention.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="font-semibold flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-blue-600" />
                                            {t('diseaseDetection.preventionMeasuresTitle')}
                                        </h3>
                                        <ul className="space-y-2">
                                            {selectedDisease.prevention.map((prevention, idx) => (
                                                <li key={idx} className="text-sm flex gap-2">
                                                    <span className="text-blue-600">•</span>
                                                    <span>{prevention}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Critical Stages Alert */}
                                {selectedDisease.criticalStages && (
                                    <Alert variant="default">
                                        <Shield className="h-4 w-4" />
                                        <AlertDescription>
                                            <strong>{t('diseaseDetection.criticalGrowthStagesLabel')}</strong> {selectedDisease.criticalStages}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {/* Additional Info */}
                                {(selectedDisease.economicImpact || selectedDisease.seasonality || selectedDisease.expertNotes) && (
                                    <div className="space-y-3 border-t pt-4">
                                        {selectedDisease.economicImpact && (
                                            <div>
                                                <h4 className="font-semibold text-sm mb-1">Economic Impact</h4>
                                                <p className="text-sm text-muted-foreground">{selectedDisease.economicImpact}</p>
                                            </div>
                                        )}
                                        {selectedDisease.seasonality && (
                                            <div>
                                                <h4 className="font-semibold text-sm mb-1">Seasonality</h4>
                                                <p className="text-sm text-muted-foreground">{selectedDisease.seasonality}</p>
                                            </div>
                                        )}
                                        {selectedDisease.expertNotes && (
                                            <div>
                                                <h4 className="font-semibold text-sm mb-1">Expert Notes</h4>
                                                <p className="text-sm text-muted-foreground">{selectedDisease.expertNotes}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
