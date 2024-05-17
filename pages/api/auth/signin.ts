import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";
import bcrypt from "bcrypt";
import * as jose from "jose";

const prisma = new PrismaClient();

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method === "POST") {
    const errors: string[] = [];
    const { email, password } = request.body;

    const validationSchema = [
      {
        valid: validator.isEmail(email),
        errorMessage: "Email is invalid",
      },
      {
        valid: validator.isLength(password, { min: 8 }),
        errorMessage: "Enter a valid password"
      },
    ];

    validationSchema.forEach((check) => {
      if(!check.valid){
        errors.push(check.errorMessage);
      }
    });

    if(errors.length){
      return response.status(400).json({errorMessage: errors});
    }

    const userWithEmail = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!userWithEmail) {
      return response.status(401).json({
        errorMessage: "Email or password is invalid",
      });
    }

    const isMatch = await bcrypt.compare(password, userWithEmail.password);

    if (!isMatch) {
      return response.status(401).json({
        errorMessage: "Email or password is invalid",
      });
    }

    const alg = "HS256";
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new jose.SignJWT({ email: userWithEmail.email })
      .setProtectedHeader({ alg })
      .setExpirationTime("24h")
      .sign(secret);

    response.status(200).json({
      data: {
        response: token,
      },
    });
  }

  return response.status(404).json("Unknown enpoint");
}
