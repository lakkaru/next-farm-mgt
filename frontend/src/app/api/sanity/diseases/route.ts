import { NextRequest, NextResponse } from 'next/server'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createDiseaseInfo, updateDiseaseInfo, deleteDiseaseInfo } from '@/sanity/lib/mutations'
import { getAllDiseases } from '@/sanity/lib/queries'

// GET all diseases
export async function GET() {
    try {
        const diseases = await getAllDiseases()
        return NextResponse.json(diseases)
    } catch (error) {
        console.error('Error fetching diseases:', error)
        return NextResponse.json(
            { error: 'Failed to fetch diseases' },
            { status: 500 }
        )
    }
}

// POST create new disease
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
        const result = await createDiseaseInfo(token, data)
        return NextResponse.json(result)
    } catch (error) {
        console.error('Error creating disease:', error)
        return NextResponse.json(
            { error: 'Failed to create disease' },
            { status: 500 }
        )
    }
}
