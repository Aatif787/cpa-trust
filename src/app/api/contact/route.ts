import { NextResponse } from "next/server";
import { processContactRequest } from "@/lib/mail/contact-service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const result = await processContactRequest(request);

  return NextResponse.json(result.body, {
    status: result.status,
    headers: {
      "Cache-Control": "no-store",
      ...result.headers,
    },
  });
}
