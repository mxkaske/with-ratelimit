import type { NextResponse, NextRequest } from "next/server";
import type { Ratelimit } from "@upstash/ratelimit";
import { ratelimit } from "@/lib/upstash";

type WithRatelimitConfig = {
  ratelimit: Ratelimit;
  identifier:
    | string // use a constant to limit all requests with a single ratelimit
    | ((req: NextRequest) => string); // use a variable from the request for individual limits
  error?: string;
};

type NextEdgeHandler = (
  req: NextRequest,
  res: NextResponse
) => unknown | Promise<unknown>;

export function withEdgeRatelimit(
  config: WithRatelimitConfig,
  handler: NextEdgeHandler
) {
  return async function (req: NextRequest, res: NextResponse) {
    const { ratelimit, identifier: _identifier, error } = config;
    let identifier: string;
    if (typeof _identifier === "string") {
      identifier = _identifier;
    } else {
      identifier = _identifier(req);
    }
    const { success } = await ratelimit.limit(identifier);

    if (!success) {
      return new Response(error || "Too Many Requests", { status: 429 });
    }

    return handler(req, res);
  };
}

export function withDefaultEdgeRatelimit(handler: NextEdgeHandler) {
  return withEdgeRatelimit(
    {
      ratelimit,
      identifier: "api",
    },
    handler
  );
}
