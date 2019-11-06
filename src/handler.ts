import { APIGatewayProxyHandler } from 'aws-lambda'
import 'source-map-support/register'
import * as got from 'got'
import { melonbooks } from './resolver/melonbooks-resolver'
import { defaultResolver } from './resolver/default-resolver'
import { nijie } from './resolver/nijie-resolver'
import { buildResolver } from './resolver/resolver'
import * as metascraper from 'metascraper'

export const hello: APIGatewayProxyHandler = async (event, _context) => {
  const resolver = buildResolver([ melonbooks, nijie, defaultResolver ])
  console.log(event)
  const targetUrl = 'http://nijie.info/view.php?id=339139'
  const resolved = resolver(targetUrl)
  const { body: html, url } = await got(resolved.url(), resolved.options())
  const metadata = await metascraper([resolved.rule()])({ html, url })
  return {
    statusCode: 200,
    body: JSON.stringify(metadata)
  };
}
