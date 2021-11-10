import { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const json = req.body()
  console.log("json", json)
  res.status(200).json({ name: "John Doe" })
}
