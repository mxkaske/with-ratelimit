import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import type { Ratelimit } from "@upstash/ratelimit";
import { ratelimit } from "@/lib/upstash";

type WithRatelimitConfig = {
  ratelimit: Ratelimit;
  identifier:
    | string // use a constant to limit all requests with a single ratelimit
    | ((req: NextApiRequest) => string); // use a variable from the request for individual limits
  error?: string;
};

export function withServerRatelimit(
  config: WithRatelimitConfig,
  handler: NextApiHandler
) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    const { ratelimit, identifier: _identifier, error } = config;
    let identifier: string;
    if (typeof _identifier === "string") {
      identifier = _identifier;
    } else {
      identifier = _identifier(req);
    }
    const { success } = await ratelimit.limit(identifier);

    if (!success) {
      return res.status(429).end(error || "Too Many Requests");
    }

    return handler(req, res);
  };
}

export function withServerDefaultRatelimit(handler: NextApiHandler) {
  return withServerRatelimit(
    {
      ratelimit,
      identifier: "api",
    },
    handler
  );
}
