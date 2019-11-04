import { APIGatewayProxyHandler } from 'aws-lambda'
import 'source-map-support/register'
import _ from 'lodash'
import nijie from './metascraper-nijie'

export const hello: APIGatewayProxyHandler = async (event, _context) => {
  const metascraper = require('metascraper')([
    nijie(),
    require('metascraper-author')(),
    require('metascraper-date')(),
    require('metascraper-description')(),
    require('metascraper-image')(),
    require('metascraper-logo')(),
    require('metascraper-publisher')(),
    require('metascraper-title')(),
    require('metascraper-url')()
  ])

  const got = require("got")
  const targetUrl = 'http://nijie.info/view.php?id=55726'
  const { body: html, url } = await got(targetUrl)
  const metadata = await metascraper({ html, url })
  return {
    statusCode: 200,
    body: JSON.stringify(metadata, null),
  };
}
