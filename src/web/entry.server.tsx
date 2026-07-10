import { handleRequest } from '@vercel/react-router/entry.server';
import type { EntryContext } from 'react-router';

export default async function (
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
): Promise<Response> {
  return handleRequest(request, responseStatusCode, responseHeaders, routerContext);
}
