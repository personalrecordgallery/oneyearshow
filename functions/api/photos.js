export async function onRequest({ env }) {
  const listed = await env.PHOTO_BUCKET.list({ limit: 1000 });
  const photos = listed.objects
    .sort((a, b) => b.key.localeCompare(a.key))
    .map((object) => ({ url: `/photos/${encodeURIComponent(object.key)}`, uploaded: object.uploaded }));
  return Response.json(photos, {
    headers: { "Cache-Control": "no-store" }
  });
}
