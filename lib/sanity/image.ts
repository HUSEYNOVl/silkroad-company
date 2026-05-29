import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from './client'

type SanityImageSource = Parameters<ReturnType<typeof imageUrlBuilder>['image']>[0]

const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

export function urlForImage(source: SanityImageSource | undefined | null, width = 800): string {
  if (!source) return ''
  try {
    return urlFor(source).width(width).auto('format').url()
  } catch {
    return ''
  }
}
