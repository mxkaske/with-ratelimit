import type { NextApiRequest, NextApiResponse } from "next";
import { withDefaultRatelimit } from "@/lib/middleware/with-ratelimit";

type Data = {
  name: string;
};

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  res.status(200).json({ name: "Hello" });
}

export default withDefaultRatelimit(handler);
