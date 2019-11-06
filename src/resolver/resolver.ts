import { MetaResolverRule, MetaResolver } from "../types";
import * as got from "got";

export const buildResolver = (rules: Array<MetaResolverRule>) => (
  url: string
): MetaResolver => {
  const matchedRule = rules.find((rule: MetaResolverRule) => rule.match(url));
  return {
    url: (): string => matchedRule.resolveUrl(url),
    options: (): got.GotOptions<null> => matchedRule.resolveOptions(url),
    rule: matchedRule.rule
  };
};
