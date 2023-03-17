import { MetaResolverRule, MetaResolver } from "../types";

export const buildResolver = (rules: Array<MetaResolverRule>) => (
  url: string
): MetaResolver => {
  const matchedRule = rules.find((rule: MetaResolverRule) => rule.match(url));
  return {
    url: () => matchedRule.resolveUrl(url),
    options: () => matchedRule.resolveOptions(url),
    rule: matchedRule.rule
  };
};
