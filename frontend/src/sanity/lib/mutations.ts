// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { client } from './client'
import { createClient } from '@sanity/client'
import { apiVersion, dataset, projectId } from './env'

// Create a client with token for mutations (write operations)
// Note: The token should be passed from the server-side API route
export function getWriteClient(token: string) {
    return createClient({
        apiVersion,
        dataset,
        projectId,
        token,
        useCdn: false, // Don't use CDN for mutations
    })
}

// Disease Category Mutations
export async function createDiseaseCategory(token: string, data: {
    name: string
    slug: string
    description?: string
    icon?: string
    order: number
    isActive: boolean
}) {
    const writeClient = getWriteClient(token)
    return await writeClient.create({
        _type: 'diseaseCategory',
        name: data.name,
        slug: {
            _type: 'slug',
            current: data.slug,
        },
        description: data.description,
        icon: data.icon,
        order: data.order,
        isActive: data.isActive,
    })
}

export async function updateDiseaseCategory(token: string, id: string, data: Partial<{
    name: string
    slug: string
    description?: string
    icon?: string
    order: number
    isActive: boolean
}>) {
    const writeClient = getWriteClient(token)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updates: any = {}

    if (data.name !== undefined) updates.name = data.name
    if (data.slug !== undefined) updates.slug = { _type: 'slug', current: data.slug }
    if (data.description !== undefined) updates.description = data.description
    if (data.icon !== undefined) updates.icon = data.icon
    if (data.order !== undefined) updates.order = data.order
    if (data.isActive !== undefined) updates.isActive = data.isActive

    return await writeClient.patch(id).set(updates).commit()
}

export async function deleteDiseaseCategory(token: string, id: string) {
    const writeClient = getWriteClient(token)
    return await writeClient.delete(id)
}

// Disease Info Mutations
export async function createDiseaseInfo(token: string, data: {
    name: string
    scientificName?: string
    categoryId: string
    severity: 'high' | 'medium' | 'low'
    mainImageAssetId?: string
    mainImageAlt?: string
    description: string
    symptoms: string[]
    visualSigns?: string[]
    causes?: string[]
    treatment: string[]
    prevention?: string[]
    timing?: string
    criticalStages?: string
    commonRegions?: string[]
    seasonality?: string
    economicImpact?: string
    expertNotes?: string
    order: number
    isActive: boolean
}) {
    const writeClient = getWriteClient(token)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc: any = {
        _type: 'diseaseInfo',
        name: data.name,
        scientificName: data.scientificName,
        category: {
            _type: 'reference',
            _ref: data.categoryId,
        },
        severity: data.severity,
        description: data.description,
        symptoms: data.symptoms,
        visualSigns: data.visualSigns,
        causes: data.causes,
        treatment: data.treatment,
        prevention: data.prevention,
        timing: data.timing,
        criticalStages: data.criticalStages,
        commonRegions: data.commonRegions,
        seasonality: data.seasonality,
        economicImpact: data.economicImpact,
        expertNotes: data.expertNotes,
        order: data.order,
        isActive: data.isActive,
    }

    if (data.mainImageAssetId) {
        doc.mainImage = {
            _type: 'image',
            asset: {
                _type: 'reference',
                _ref: data.mainImageAssetId,
            },
            alt: data.mainImageAlt,
        }
    }

    return await writeClient.create(doc)
}

export async function updateDiseaseInfo(token: string, id: string, data: Partial<{
    name: string
    scientificName?: string
    categoryId: string
    severity: 'high' | 'medium' | 'low'
    mainImageAssetId?: string
    mainImageAlt?: string
    description: string
    symptoms: string[]
    visualSigns?: string[]
    causes?: string[]
    treatment: string[]
    prevention?: string[]
    timing?: string
    criticalStages?: string
    commonRegions?: string[]
    seasonality?: string
    economicImpact?: string
    expertNotes?: string
    order: number
    isActive: boolean
}>) {
    const writeClient = getWriteClient(token)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updates: any = {}

    if (data.name !== undefined) updates.name = data.name
    if (data.scientificName !== undefined) updates.scientificName = data.scientificName
    if (data.categoryId !== undefined) {
        updates.category = {
            _type: 'reference',
            _ref: data.categoryId,
        }
    }
    if (data.severity !== undefined) updates.severity = data.severity
    if (data.description !== undefined) updates.description = data.description
    if (data.symptoms !== undefined) updates.symptoms = data.symptoms
    if (data.visualSigns !== undefined) updates.visualSigns = data.visualSigns
    if (data.causes !== undefined) updates.causes = data.causes
    if (data.treatment !== undefined) updates.treatment = data.treatment
    if (data.prevention !== undefined) updates.prevention = data.prevention
    if (data.timing !== undefined) updates.timing = data.timing
    if (data.criticalStages !== undefined) updates.criticalStages = data.criticalStages
    if (data.commonRegions !== undefined) updates.commonRegions = data.commonRegions
    if (data.seasonality !== undefined) updates.seasonality = data.seasonality
    if (data.economicImpact !== undefined) updates.economicImpact = data.economicImpact
    if (data.expertNotes !== undefined) updates.expertNotes = data.expertNotes
    if (data.order !== undefined) updates.order = data.order
    if (data.isActive !== undefined) updates.isActive = data.isActive

    if (data.mainImageAssetId !== undefined) {
        updates.mainImage = {
            _type: 'image',
            asset: {
                _type: 'reference',
                _ref: data.mainImageAssetId,
            },
            alt: data.mainImageAlt,
        }
    }

    return await writeClient.patch(id).set(updates).commit()
}

export async function deleteDiseaseInfo(token: string, id: string) {
    const writeClient = getWriteClient(token)
    return await writeClient.delete(id)
}

// Image Upload
export async function uploadImage(token: string, file: File): Promise<string> {
    const writeClient = getWriteClient(token)
    const asset = await writeClient.assets.upload('image', file)
    return asset._id
}
