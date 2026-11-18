export async function onRequest({ params, env }) {
  const key = Array.isArray(params.path) ? params.path.join("/") : params.path;
  if (!key || key.includes("..")) return new Response("Not found", { status: 404 });
  const object = await env.PHOTO_BUCKET.get(key);
  if (!object) return new Response("Not found", { status: 404 });
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("X-Content-Type-Options", "nosniff");
  return new Response(object.body, { headers });
}
