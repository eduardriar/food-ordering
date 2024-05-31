import { NextApiRequest, NextApiResponse } from "next";
import { times } from "../../../../data";
import { PrismaClient } from "@prisma/client";
import { findAvailableTables } from "../../../../services/restaurant/findAvailableTables";

const prisma = new PrismaClient();

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method === "GET") {
    // request.query is how we optain QSP
    const { slug, day, time, partySize } = request.query as {
      slug: string;
      day: string;
      time: string;
      partySize: string;
    };

    if (!day || !time || !partySize) {
      return response.status(400).json({
        errorMessage: "Invalid data provided",
      });
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        slug,
      },
      select: {
        tables: true,
        open_time: true,
        close_time: true,
      },
    });

    if (!restaurant) {
      return response.status(400).json({
        errorMessage: "Invalid data provided",
      });
    }

    const searchTimesWithTables = await findAvailableTables({ time, day, restaurant, response });

    if (!searchTimesWithTables) {
      return response.status(400).json({
        errorMessage: "Invalid data provided",
      });
    }

    const availabilities = searchTimesWithTables
      .map((t) => {
        const sumSeats = t.tables.reduce((accumulator, table) => accumulator + table.seats, 0);
        return {
          time: t.time,
          availability: Number(partySize) <= sumSeats,
        };
      })
      .filter((availability) => {
        const timeIsAfterOpenningHour =
          new Date(`${day}T${availability.time}`) >= new Date(`${day}T${restaurant.open_time}`);
        const timeIsBeforeClosingHour =
          new Date(`${day}T${availability.time}`) <= new Date(`${day}T${restaurant.close_time}`);

        return timeIsAfterOpenningHour && timeIsBeforeClosingHour;
      });

    return response.json({ availabilities });
  }
}
