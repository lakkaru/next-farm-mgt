import { NextRequest, NextResponse } from 'next/server'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createDiseaseCategory, updateDiseaseCategory, deleteDiseaseCategory } from '@/sanity/lib/mutations'
import { getDiseaseCategories } from '@/sanity/lib/queries'

// GET all categories
export async function GET() {
    try {
        const categories = await getDiseaseCategories()
        return NextResponse.json(categories)
    } catch (error) {
        console.error('Error fetching categories:', error)
        return NextResponse.json(
            { error: 'Failed to fetch categories' },
            { status: 500 }
        )
    }
}

// POST create new category
export async function POST(request: NextRequest) {
    try {
        const token = request.headers.get('x-sanity-token')
        if (!token) {
            return NextResponse.json(
                { error: 'Sanity token required' },
                { status: 401 }
            )
        }

        const data = await request.json()
        const result = await createDiseaseCategory(token, data)
        return NextResponse.json(result)
    } catch (error) {
        console.error('Error creating category:', error)
        return NextResponse.json(
            { error: 'Failed to create category' },
            { status: 500 }
        )
    }
}
