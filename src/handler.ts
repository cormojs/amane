import { APIGatewayProxyHandler } from 'aws-lambda'
import 'source-map-support/register'
import got from 'got'
import { melonbooks } from './resolver/melonbooks-resolver'
import { defaultResolver } from './resolver/default-resolver'
import { nijie } from './resolver/nijie-resolver'
import { buildResolver } from './resolver/resolver'
const metascraper = require('metascraper')

export const hello: APIGatewayProxyHandler = async (event, _context) => {
  const resolver = buildResolver([ melonbooks, nijie, defaultResolver ])
  console.log(event)
  const targetUrl = event.queryStringParameters?.['url']
  const resolved = resolver(targetUrl)
  const { body: html, url } = await got(resolved.url(), resolved.options())
  const metadata = await metascraper([resolved.rule()])({ html, url })
  return {
    statusCode: 200,
    body: JSON.stringify(metadata)
  };
}
