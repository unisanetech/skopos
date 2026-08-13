import { resolveWebReleaseIdentity } from "@/lib/release-identity";

export const dynamic = "force-static";

export function GET() {
  return Response.json(resolveWebReleaseIdentity(process.env), {
    headers: {
      "cache-control": "public, max-age=0, must-revalidate",
    },
  });
}
