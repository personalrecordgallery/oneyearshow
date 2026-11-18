const MAX_BYTES = 15 * 1024 * 1024;
const ALLOWED_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"]
]);

export async function onRequestPost({ request, env }) {
  const expected = env.UPLOAD_PASSWORD;
  const supplied = request.headers.get("x-upload-password") || "";
  if (!expected || supplied.length !== expected.length || !constantTimeEquals(supplied, expected)) {
    return Response.json({ error: "Incorrect password." }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("photo");
  if (!(file instanceof File)) return Response.json({ error: "Choose a photo to upload." }, { status: 400 });
  const extension = ALLOWED_TYPES.get(file.type);
  if (!extension) return Response.json({ error: "Use a JPEG, PNG, WebP, or GIF image." }, { status: 415 });
  if (file.size > MAX_BYTES) return Response.json({ error: "The photo must be 15 MB or smaller." }, { status: 413 });

  const key = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
  await env.PHOTO_BUCKET.put(key, file.stream(), {
    httpMetadata: { contentType: file.type, cacheControl: "public, max-age=31536000, immutable" }
  });
  return Response.json({ ok: true }, { status: 201 });
}

function constantTimeEquals(a, b) {
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}
