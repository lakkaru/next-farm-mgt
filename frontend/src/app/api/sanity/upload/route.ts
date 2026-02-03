import { NextRequest, NextResponse } from 'next/server'
import { uploadImage } from '@/sanity/lib/mutations'

export async function POST(request: NextRequest) {
    try {
        const token = request.headers.get('x-sanity-token')
        if (!token) {
            return NextResponse.json(
                { error: 'Sanity token required' },
                { status: 401 }
            )
        }

        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            )
        }

        const assetId = await uploadImage(token, file)
        return NextResponse.json({ assetId })
    } catch (error) {
        console.error('Error uploading image:', error)
        return NextResponse.json(
            { error: 'Failed to upload image' },
            { status: 500 }
        )
    }
}
