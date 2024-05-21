import { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import * as jose from "jose";

const prisma = new PrismaClient();

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method === "POST") {
    const { firstName, lastName, email, phone, city, password } = request.body;
    const errors: string[] = [];
    const validationSchema = [
      {
        valid: validator.isLength(firstName, { min: 1, max: 20 }),
        errorMessage: "First name is invalid",
      },
      {
        valid: validator.isLength(lastName, { min: 1, max: 20 }),
        errorMessage: "Last name is invalid",
      },
      {
        valid: validator.isEmail(email),
        errorMessage: "Email is invalid",
      },
      {
        valid: validator.isMobilePhone(phone),
        errorMessage: "Phone is invalid",
      },
      {
        valid: validator.isLength(city, { min: 1, max: 20 }),
        errorMessage: "City is invalid",
      },
      {
        valid: validator.isStrongPassword(password),
        errorMessage: "Password is not strong enough",
      },
    ];

    validationSchema.forEach((check) => {
      if (!check.valid) {
        errors.push(check.errorMessage);
      }
    });

    if (errors.length) {
      return response.status(400).json({
        errorMessage: errors,
      });
    }

    const userWithEmail = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (userWithEmail) {
      return response.status(400).json({
        errorMessage: "Email is associated with anohter account",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await prisma.user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        city: city,
        email: email,
        password: hashedPassword,
        phone: phone,
      },
    });

    const alg = "HS256";
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new jose.SignJWT({ id: createdUser.id, email: createdUser.email })
      .setProtectedHeader({ alg })
      .setExpirationTime("24h")
      .sign(secret);

    return response
      .status(200)
      .setHeader("Set-cookie", `jwt=${token}; Max-age=8640; Path=/`)
      .json({
        user: {
          firstName: createdUser.first_name,
          lastName: createdUser.last_name,
          email: createdUser.email,
          phone: createdUser.phone,
          city: createdUser.city,
        },
        token: token,
      });
  }

  return response.status(404).json("Unknown enpoint");
};

export default handler;
