import _ from "lodash";
import * as moment from "moment-timezone";
import { MetaResolverRule, MetascraperArg } from "../types";

const urlRegexp = /nijie\.info\/view\.php/;

const escape = (propName: string) => ({
  htmlDom,
  url
}: MetascraperArg): string | null => {
  if (!url.match(urlRegexp)) {
    return null;
  }
  const data = {};
  const $ = htmlDom;
  try {
    $('script[type="application/ld+json"]').map((_i, e) => {
      Object.assign(
        data,
        ..._.castArray(
          JSON.parse(
            $(e)
              .contents()
              .text()
              .replace(/\r?\n/g, "\\n")
          )
        )
      );
    });
  } catch (err) {
    return null;
  }
  return _.get(data, propName);
};

const date = (propName: string) => ({
  htmlDom,
  url
}: MetascraperArg): string | null => {
  if (!url.match(urlRegexp)) {
    return null;
  }

  const dateString = escape(propName)({ htmlDom, url });
  return moment
    .tz(new Date(dateString).toISOString().slice(0, -1), "Asia/Tokyo")
    .add(9, "hours")
    .format();
};

const publisher = ({ url }: MetascraperArg): string | null => {
  return url.match(urlRegexp) ? "ニジエ" : null;
};

const logo = ({ htmlDom }: MetascraperArg): string | null => {
  return htmlDom('meta[property="og:image"]').attr("content");
};

export const nijie: MetaResolverRule = {
  rule: () => ({
    author: [escape("author.name")],
    title: [escape("name")],
    media: [(arg): string | null => escape("genre")(arg).toLowerCase()],
    image: [escape("thumbnailUrl")],
    date: [date("uploadDate")],
    publisher: [publisher],
    logo: [logo],
    url: [({ url }): string | null => url],
    description: [escape("description")]
  }),
  match: url => url.match(urlRegexp) != null,
  resolveUrl: url => url,
  resolveOptions: _url => ({})
};
