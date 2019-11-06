import { CookieJar } from "tough-cookie";
import { MetaResolverRule, MetascraperArg, Rule } from "../types";
import * as moment from "moment-timezone";

const titleRegExp = /^(.+)（(.+)）の通販・購入はメロンブックス$/;

const pageTitle = (n: 1 | 2) => ({
  htmlDom
}: MetascraperArg): string | null => {
  const content: string = htmlDom('meta[property="og:title"]').attr("content");
  const matched: RegExpMatchArray | null = content
    ? content.match(titleRegExp)
    : null;
  return matched ? matched[n] : null;
};

const image = ({ htmlDom }: MetascraperArg): string | null => {
  const content = htmlDom('meta[property="og:image"]').attr("content");
  return content ? content.replace(/&c=1/, "") : null;
};

const url = ({ url }: MetascraperArg): string | null => {
  return url.replace(/&c=1/, "");
};

const author = ({ htmlDom }: MetascraperArg): string | null => {
  return htmlDom("th:contains('作家名')")
    .next("td")
    .children("a")
    .text();
};

const logo = ({ htmlDom }: MetascraperArg): string | null => {
  const path = htmlDom('a[title="Melonbooks"] img').attr("src");
  return path ? `https://www.melonbooks.co.jp/${path}` : null;
};

const date = ({ htmlDom }: MetascraperArg): string | null => {
  const dateString = htmlDom("th:contains('発行日')")
    .next("td")
    .text();
  return dateString
    ? moment
        .tz(new Date(dateString).toISOString().slice(0, -1), "Asia/Tokyo")
        .add(9, "hours")
        .format()
    : null;
};

const description = ({ htmlDom }: MetascraperArg): string | null => {
  return htmlDom("#special_desription .richeditor p").text();
};

const urlRegexp = /www\.melonbooks\.co\.jp\/detail\/detail\.php/;

export const melonbooks: MetaResolverRule = {
  rule: (): Rule => ({
    title: [pageTitle(1)],
    publisher: [pageTitle(2)],
    image: [image],
    url: [url],
    author: [author],
    logo: [logo],
    date: [date],
    media: [(_arg: MetascraperArg): string | null => "Merchandise"],
    description: [description]
  }),
  match: url => url.match(urlRegexp) != null,
  resolveUrl: url => url.replace(/&c=1/, ""),
  resolveOptions: _url => {
    const cookieJar = new CookieJar();
    cookieJar.setCookieSync("AUTH_ADULT=1", "http://www.melonbooks.co.jp/");
    return { cookieJar };
  }
};
