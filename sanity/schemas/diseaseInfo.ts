import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'diseaseInfo',
    title: 'Disease Information',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Disease/Deficiency Name',
            type: 'string',
            description: 'e.g., Nitrogen (N), Brown Spot, Rice Blast',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'scientificName',
            title: 'Scientific Name',
            type: 'string',
            description: 'Scientific or chemical name (optional for deficiencies)',
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'reference',
            to: [{ type: 'diseaseCategory' }],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'severity',
            title: 'Severity Level',
            type: 'string',
            options: {
                list: [
                    { title: 'High Impact', value: 'high' },
                    { title: 'Medium Impact', value: 'medium' },
                    { title: 'Low Impact', value: 'low' },
                ],
                layout: 'radio',
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'mainImage',
            title: 'Main Reference Image',
            type: 'image',
            options: {
                hotspot: true,
            },
            fields: [
                {
                    name: 'alt',
                    type: 'string',
                    title: 'Alternative Text',
                },
            ],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'additionalImages',
            title: 'Additional Images',
            type: 'array',
            of: [
                {
                    type: 'image',
                    options: { hotspot: true },
                    fields: [
                        {
                            name: 'alt',
                            type: 'string',
                            title: 'Alternative Text',
                        },
                        {
                            name: 'caption',
                            type: 'string',
                            title: 'Caption',
                        },
                    ],
                },
            ],
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 4,
            description: 'Brief overview of the disease/deficiency',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'symptoms',
            title: 'Symptoms',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'List of symptoms to identify this condition',
            validation: (Rule) => Rule.required().min(1),
        }),
        defineField({
            name: 'visualSigns',
            title: 'Visual Signs',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'Visual indicators for identification',
        }),
        defineField({
            name: 'causes',
            title: 'Common Causes',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'What causes this condition',
        }),
        defineField({
            name: 'treatment',
            title: 'Treatment Protocol',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'Step-by-step treatment recommendations',
            validation: (Rule) => Rule.required().min(1),
        }),
        defineField({
            name: 'prevention',
            title: 'Prevention Measures',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'How to prevent this condition',
        }),
        defineField({
            name: 'timing',
            title: 'Treatment Timing',
            type: 'string',
            description: 'When to apply treatment for best results',
        }),
        defineField({
            name: 'criticalStages',
            title: 'Critical Growth Stages',
            type: 'string',
            description: 'Which growth stages are most vulnerable',
        }),
        defineField({
            name: 'commonRegions',
            title: 'Common Regions',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'Where this condition commonly occurs',
        }),
        defineField({
            name: 'seasonality',
            title: 'Seasonality',
            type: 'string',
            description: 'When this condition is most common',
        }),
        defineField({
            name: 'economicImpact',
            title: 'Economic Impact',
            type: 'text',
            rows: 2,
            description: 'Potential yield loss or economic impact',
        }),
        defineField({
            name: 'expertNotes',
            title: 'Expert Notes',
            type: 'text',
            rows: 3,
            description: 'Additional notes from agricultural experts',
        }),
        defineField({
            name: 'order',
            title: 'Display Order',
            type: 'number',
            description: 'Order within category (lower numbers appear first)',
            initialValue: 0,
        }),
        defineField({
            name: 'isActive',
            title: 'Is Active',
            type: 'boolean',
            description: 'Show this on the website',
            initialValue: true,
        }),
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'scientificName',
            media: 'mainImage',
            severity: 'severity',
        },
        prepare({ title, subtitle, media, severity }) {
            const severityEmoji = severity === 'high' ? '🔴' : severity === 'medium' ? '🟡' : '🟢'
            return {
                title: `${severityEmoji} ${title}`,
                subtitle: subtitle || 'No scientific name',
                media,
            }
        },
    },
})
