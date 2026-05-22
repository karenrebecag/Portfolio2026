import type { CollectionAfterChangeHook } from 'payload'

export const revalidateProject: CollectionAfterChangeHook = async ({ doc, req }) => {
  const webhookUrl = process.env.REVALIDATE_WEBHOOK_URL
  const secret = process.env.REVALIDATE_SECRET

  if (!webhookUrl || !secret) {
    req.payload.logger.warn('Revalidation webhook not configured. Skipping.')
    return doc
  }

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revalidate-secret': secret,
      },
      body: JSON.stringify({ slug: doc.slug }),
    })
    req.payload.logger.info(`Revalidation triggered for project: ${doc.slug}`)
  } catch (error) {
    req.payload.logger.error(`Revalidation failed for project: ${doc.slug}`, error)
  }

  return doc
}
