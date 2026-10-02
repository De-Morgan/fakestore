import { z } from "zod";

const PayloadSchema = z.object({ sub: z.coerce.number().int().positive() });

// Reads the user id from a JWT. This does NOT verify the signature: use it for UI, never for security.
export function decodeUserId(token: string): number {
  const payload = token.split(".")[1];
  if (!payload) throw new Error("Malformed token");
  // base64url → base64. atob tolerates the missing "=" padding.
  const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
  return PayloadSchema.parse(JSON.parse(json)).sub;
}
