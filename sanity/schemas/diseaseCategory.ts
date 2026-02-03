import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'diseaseCategory',
    title: 'Disease Category',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Category Name',
            type: 'string',
            description: 'e.g., Nutrition Deficiencies, Insect Damage, Fungal Diseases, Bacterial Diseases',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'name',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'icon',
            title: 'Icon Name',
            type: 'string',
            description: 'Lucide icon name (e.g., Leaf, Bug, Droplets, AlertCircle)',
        }),
        defineField({
            name: 'order',
            title: 'Display Order',
            type: 'number',
            description: 'Lower numbers appear first',
            validation: (Rule) => Rule.required().min(0),
        }),
        defineField({
            name: 'isActive',
            title: 'Is Active',
            type: 'boolean',
            description: 'Show this category on the website',
            initialValue: true,
        }),
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'description',
            order: 'order',
        },
        prepare({ title, subtitle, order }) {
            return {
                title: `${order}. ${title}`,
                subtitle: subtitle,
            }
        },
    },
})
