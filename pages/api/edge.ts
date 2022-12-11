import { withDefaultRatelimit } from "@/lib/middleware/with-ratelimit";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  runtime: "experimental-edge",
};

function handler(req: NextRequest, res: NextResponse) {
  const runtime = process.env.NEXT_RUNTIME || "";
  return new Response(
    JSON.stringify({
      runtime,
    }),
    {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    }
  );
}

export default withDefaultRatelimit(handler);
