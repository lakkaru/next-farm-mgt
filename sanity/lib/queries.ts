import { client } from './client'

export interface DiseaseCategory {
    _id: string
    name: string
    slug: {
        current: string
    }
    description?: string
    icon?: string
    order: number
    isActive: boolean
}

export interface DiseaseInfo {
    _id: string
    name: string
    scientificName?: string
    category: {
        _ref: string
        name: string
        slug: {
            current: string
        }
    }
    severity: 'high' | 'medium' | 'low'
    mainImage: {
        asset: {
            _ref: string
            url: string
        }
        alt?: string
    }
    additionalImages?: Array<{
        asset: {
            _ref: string
            url: string
        }
        alt?: string
        caption?: string
    }>
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
}

// Fetch all active disease categories
export async function getDiseaseCategories(): Promise<DiseaseCategory[]> {
    const query = `*[_type == "diseaseCategory" && isActive == true] | order(order asc) {
    _id,
    name,
    slug,
    description,
    icon,
    order,
    isActive
  }`

    return await client.fetch(query)
}

// Fetch all active diseases with their category info
export async function getAllDiseases(): Promise<DiseaseInfo[]> {
    const query = `*[_type == "diseaseInfo" && isActive == true] | order(order asc) {
    _id,
    name,
    scientificName,
    "category": category->{
      _id,
      name,
      slug
    },
    severity,
    "mainImage": {
      "asset": mainImage.asset->{
        _id,
        url
      },
      "alt": mainImage.alt
    },
    "additionalImages": additionalImages[]{
      "asset": asset->{
        _id,
        url
      },
      alt,
      caption
    },
    description,
    symptoms,
    visualSigns,
    causes,
    treatment,
    prevention,
    timing,
    criticalStages,
    commonRegions,
    seasonality,
    economicImpact,
    expertNotes,
    order,
    isActive
  }`

    return await client.fetch(query)
}

// Fetch diseases by category
export async function getDiseasesByCategory(categorySlug: string): Promise<DiseaseInfo[]> {
    const query = `*[_type == "diseaseInfo" && isActive == true && category->slug.current == $categorySlug] | order(order asc) {
    _id,
    name,
    scientificName,
    "category": category->{
      _id,
      name,
      slug
    },
    severity,
    "mainImage": {
      "asset": mainImage.asset->{
        _id,
        url
      },
      "alt": mainImage.alt
    },
    "additionalImages": additionalImages[]{
      "asset": asset->{
        _id,
        url
      },
      alt,
      caption
    },
    description,
    symptoms,
    visualSigns,
    causes,
    treatment,
    prevention,
    timing,
    criticalStages,
    commonRegions,
    seasonality,
    economicImpact,
    expertNotes,
    order,
    isActive
  }`

    return await client.fetch(query, { categorySlug })
}

// Fetch a single disease by ID
export async function getDiseaseById(id: string): Promise<DiseaseInfo | null> {
    const query = `*[_type == "diseaseInfo" && _id == $id][0] {
    _id,
    name,
    scientificName,
    "category": category->{
      _id,
      name,
      slug
    },
    severity,
    "mainImage": {
      "asset": mainImage.asset->{
        _id,
        url
      },
      "alt": mainImage.alt
    },
    "additionalImages": additionalImages[]{
      "asset": asset->{
        _id,
        url
      },
      alt,
      caption
    },
    description,
    symptoms,
    visualSigns,
    causes,
    treatment,
    prevention,
    timing,
    criticalStages,
    commonRegions,
    seasonality,
    economicImpact,
    expertNotes,
    order,
    isActive
  }`

    return await client.fetch(query, { id })
}
