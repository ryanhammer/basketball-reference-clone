import { isbot } from 'isbot';
import { renderToReadableStream } from 'react-dom/server';
import type { EntryContext } from 'react-router';
import { ServerRouter } from 'react-router';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
): Promise<Response> {
  let statusCode = responseStatusCode;

  const stream = await renderToReadableStream(
    <ServerRouter context={routerContext} url={request.url} />,
    {
      signal: request.signal,
      onError(error: unknown) {
        console.error(error);
        statusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await stream.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  return new Response(stream, {
    status: statusCode,
    headers: responseHeaders,
  });
}
