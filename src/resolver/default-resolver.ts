import { MetaResolverRule } from "../types";

export const defaultResolver: MetaResolverRule = {
  rule: () => ({}),
  match: _url => true,
  resolveUrl: url => url,
  resolveOptions: _url => ({})
};
