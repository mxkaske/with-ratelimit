import type { NextApiRequest, NextApiResponse } from "next";
import { withRatelimit } from "@/lib/middleware/with-ratelimit";
import { ratelimit } from "@/lib/upstash";

type Data = {
  name: string;
};

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  res.status(200).json({ name: "World" });
}

export default withRatelimit(
  {
    ratelimit,
    // REMINDER: add validation to be sure it exists
    // otherwise will be empty like '@upstash/ratelimit::12345'
    // instead of '@upstash/ratelimit:1:12345' if id="1"
    identifier: (req) => req.query.id as string,
  },
  handler
);
