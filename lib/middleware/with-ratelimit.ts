import type { NextResponse, NextRequest } from "next/server";
import type { NextApiHandler, NextApiResponse } from "next";
import type { Ratelimit } from "@upstash/ratelimit";
import { ratelimit } from "@/lib/upstash";

// TODO: Use a Generic T

type WithRatelimitConfig = {
  ratelimit: Ratelimit;
  identifier: string | ((req: Parameters<Handler>[0]) => string);
  error?: string;
};

type NextEdgeHandler = (
  req: NextRequest,
  res: NextResponse
) => unknown | Promise<unknown>;

type Handler = NextApiHandler | NextEdgeHandler;

function isEdge(res: NextResponse | NextApiResponse): res is NextResponse {
  return !(res as NextResponse).status;
}

export function withRatelimit(config: WithRatelimitConfig, handler: Handler) {
  return async function (
    req: Parameters<typeof handler>[0],
    res: Parameters<typeof handler>[1]
  ) {
    const { ratelimit, identifier: _identifier, error } = config;
    const identifier =
      typeof _identifier === "string" ? _identifier : _identifier(req);
    const { success } = await ratelimit.limit(identifier);
    if (!success) {
      if (isEdge(res)) {
        return new Response(error || "Too Many Requests", {
          status: 429,
        });
      } else {
        return res.status(429).end(config.error || "Too Many Requests");
      }
    }
    // @ts-ignore FIXME: `Type 'NextRequest' is not assignable to type 'NextApiRequest & NextRequest'.`
    return handler(req, res);
  };
}

export function withDefaultRatelimit(handler: Handler) {
  return withRatelimit(
    {
      ratelimit,
      identifier: "api",
    },
    handler
  );
}
