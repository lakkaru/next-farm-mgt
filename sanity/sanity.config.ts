import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'
import { projectId } from './env'

export default defineConfig({
    name: 'default',
    title: 'Farm Management - Disease Database',

    projectId: projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

    plugins: [structureTool(), visionTool()],

    schema: {
        types: schemaTypes,
    },
})
