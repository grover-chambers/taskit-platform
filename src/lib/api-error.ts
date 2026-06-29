const isProd = process.env.NODE_ENV === 'production';

export function sanitizedErrorResponse(error: unknown, status = 500) {
  if (isProd) {
    return Response.json({ error: 'Internal server error' }, { status });
  }
  const message = error instanceof Error ? error.message : 'Internal server error';
  return Response.json({ error: message }, { status });
}
