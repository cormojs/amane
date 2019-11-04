import _ from 'lodash'
import moment from 'moment-timezone'

const escape = propName => ({ htmlDom }) => {
  const data = {}
  const $ = htmlDom
  try {
    $('script[type="application/ld+json"]').map((i, e) => {
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
      )
    })
  } catch (err) {}
  return _.get(data, propName)
}

const date = propName => ({ htmlDom }) => {
  const dateString: string = escape(propName)({ htmlDom })
  return moment.tz(
    new Date(dateString).toISOString().slice(0, -1),
    "Asia/Tokyo"
  ).add(9, 'hours').format()
}

const publisher = ({ url }) => {
  return url.match("https?://nijie.info/") ? "ニジエ" : null
}

const logo = ({ htmlDom }) => {
  return htmlDom('meta[property="og:image"]').attr('content')
}

export default () => {
  return {
    author: [escape('author.name')],
    title: [escape('name')],
    genre: [escape('genre')],
    image: [escape('thumbnailUrl')],
    date: [date('uploadDate')],
    publisher: [publisher],
    logo: [logo]
  }
}