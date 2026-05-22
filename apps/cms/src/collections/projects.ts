import type { CollectionConfig } from 'payload'
import { revalidateProject } from '../hooks/revalidate-project'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'featured', 'publishedAt'],
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateProject],
  },
  fields: [
    {
      name: 'title',
      label: 'Nombre del proyecto',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Se genera automaticamente desde el titulo.',
      },
      hooks: {
        beforeValidate: [
          ({ data, originalDoc }) => {
            if (originalDoc?.slug) return originalDoc.slug
            if (data?.title) {
              return data.title
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
          },
        ],
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Borrador', value: 'draft' },
        { label: 'Publicado', value: 'published' },
        { label: 'Archivado', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      label: 'Proyecto destacado',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Aparece en la seccion hero del portafolio.',
      },
    },

    // -- Metadata --
    {
      type: 'row',
      fields: [
        {
          name: 'category',
          label: 'Categoria',
          type: 'select',
          required: true,
          options: [
            { label: 'Web', value: 'web' },
            { label: 'Mobile', value: 'mobile' },
            { label: 'Design System', value: 'design_system' },
            { label: 'Branding', value: 'branding' },
            { label: 'Ilustracion', value: 'illustration' },
            { label: 'Motion', value: 'motion' },
            { label: 'UX Research', value: 'ux_research' },
          ],
          admin: { width: '33%' },
        },
        {
          name: 'role',
          label: 'Mi rol en el proyecto',
          type: 'text',
          required: true,
          admin: {
            width: '33%',
            description: 'Ej: Lead Designer, Frontend Developer, Design System Architect',
          },
        },
        {
          name: 'year',
          label: 'Ano',
          type: 'text',
          admin: {
            width: '33%',
            description: 'Ej: 2024, 2023-2024',
          },
        },
      ],
    },
    {
      name: 'tags',
      label: 'Tech stack / herramientas',
      type: 'array',
      admin: {
        description: 'Ej: React, Figma, Payload CMS, Tailwind, etc.',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
    },

    // -- Contenido --
    {
      name: 'summary',
      label: 'Resumen corto',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Una o dos oraciones. Se muestra en la tarjeta del proyecto.',
      },
    },
    {
      name: 'description',
      label: 'Descripcion completa',
      type: 'richText',
      required: true,
      admin: {
        description: 'Contexto, proceso, decisiones clave, resultados.',
      },
    },

    // -- Links --
    {
      type: 'row',
      fields: [
        {
          name: 'liveUrl',
          label: 'URL en vivo',
          type: 'text',
          admin: {
            width: '50%',
            description: 'Link al sitio/app desplegado.',
          },
        },
        {
          name: 'repoUrl',
          label: 'Repositorio',
          type: 'text',
          admin: {
            width: '50%',
            description: 'Link al repo (si es publico).',
          },
        },
      ],
    },

    // -- Media --
    {
      name: 'coverImage',
      label: 'Imagen de portada',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Imagen principal del proyecto. Se muestra en la tarjeta y como hero.',
      },
    },
    {
      name: 'gallery',
      label: 'Galeria',
      type: 'array',
      admin: {
        description: 'Capturas, mockups, fotos del proceso.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          label: 'Pie de imagen',
          type: 'text',
        },
      ],
    },

    // -- Auto-generated --
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Se llena automaticamente al publicar.',
      },
      hooks: {
        beforeChange: [
          ({ data, originalDoc }) => {
            if (data?.status === 'published' && originalDoc?.status !== 'published') {
              return new Date().toISOString()
            }
            return originalDoc?.publishedAt
          },
        ],
      },
    },
  ],
}
