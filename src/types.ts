import * as cheerio from 'cheerio'
import * as got from 'got'

export type Rule = Record<keyof Metadata, MetascraperFunc[]>

export interface MetaResolver {
  url(): string
  options():  got.GotOptions<null>
  rule(): Rule
}

export interface Metadata {
  author: string
  title: string
  publisher: string
  image: string
  url: string
  logo: string
  date: string
  media: string
  description: string
}

export interface MetaResolverRule {
  rule: () => Rule
  match: (url: string) => boolean
  resolveUrl: (url: string) => string
  resolveOptions: (url: string) => got.GotOptions<null>
}

export interface MetascraperArg {
  htmlDom: typeof cheerio,
  url: string
}

export type MetascraperFunc = ({ htmlDom }: MetascraperArg) => string | null 