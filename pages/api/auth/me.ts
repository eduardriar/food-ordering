import { NextApiRequest, NextApiResponse } from "next";
import * as jose from "jose";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method === "GET") {
    const bearerToken = request.headers["authorization"] as string;
    const token = bearerToken.split(" ")[1];

    const payload = jwt.decode(token) as { email: string };

    if (!payload.email) {
      return response.status(401).json({
        errorMessage: "Unauthorized request",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: payload?.email,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
      },
    });

    return response.status(200).json({ me: user });
  }

  return response.json({ me: "ECRA" });
}
