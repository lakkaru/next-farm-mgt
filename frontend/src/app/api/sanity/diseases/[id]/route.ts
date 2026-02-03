import { NextRequest, NextResponse } from 'next/server'
import { updateDiseaseInfo, deleteDiseaseInfo } from '@/sanity/lib/mutations'

// PATCH update disease
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = request.headers.get('x-sanity-token')
        if (!token) {
            return NextResponse.json(
                { error: 'Sanity token required' },
                { status: 401 }
            )
        }

        const data = await request.json()
        const result = await updateDiseaseInfo(token, params.id, data)
        return NextResponse.json(result)
    } catch (error) {
        console.error('Error updating disease:', error)
        return NextResponse.json(
            { error: 'Failed to update disease' },
            { status: 500 }
        )
    }
}

// DELETE disease
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = request.headers.get('x-sanity-token')
        if (!token) {
            return NextResponse.json(
                { error: 'Sanity token required' },
                { status: 401 }
            )
        }

        await deleteDiseaseInfo(token, params.id)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting disease:', error)
        return NextResponse.json(
            { error: 'Failed to delete disease' },
            { status: 500 }
        )
    }
}
