import { MetaResolverRule } from "../types";

export const defaultResolver: MetaResolverRule = {
  rule: () => ({
    author: [],
    title: [],
    publisher: [],
    image: [],
    url: [],
    logo: [],
    date: [],
    media: [],
    description: []
  }),
  match: _url => true,
  resolveUrl: url => url,
  resolveOptions: _url => ({})
};
