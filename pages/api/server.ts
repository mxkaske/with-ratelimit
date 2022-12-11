import type { NextApiRequest, NextApiResponse } from "next";
import { withDefaultRatelimit } from "@/lib/middleware/with-ratelimit";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const runtime = process.env.NEXT_RUNTIME || "";
  res.status(200).json({ runtime });
}

export default withDefaultRatelimit(handler);
