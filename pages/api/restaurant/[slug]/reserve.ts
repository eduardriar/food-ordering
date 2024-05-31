import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { findAvailableTables } from "../../../../services/restaurant/findAvailableTables";
import validator from "validator";

const prisma = new PrismaClient();

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method === "POST") {
    const { day, time, partySize } = request.query as {
      day: string;
      time: string;
      partySize: string;
    };

    

    const { bookerPhone, bookerEmail, bookerFirstName, bookerLastName, bookerOccasion, bookerRequest, slug } = request.body;

    const errors: string[] = [];
    const validationSchema = [
      {
        valid: validator.isLength(bookerFirstName, { min: 1, max: 20 }),
        errorMessage: "First name is invalid",
      },
      {
        valid: validator.isLength(bookerLastName, { min: 1, max: 20 }),
        errorMessage: "Last name is invalid",
      },
      {
        valid: validator.isEmail(bookerEmail),
        errorMessage: "Last name is invalid",
      },
      {
        valid: validator.isMobilePhone(bookerPhone),
        errorMessage: "Phone is invalid",
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

    console.log(slug)

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
        tables: true,
        open_time: true,
        close_time: true,
      },
    });

    console.log(restaurant)

    if (!restaurant) {
      return response.status(400).json({
        errorMessage: "Invalid data provided",
      });
    }

    if (
      new Date(`${day}T${time}`) < new Date(`${day}T${restaurant.open_time}`) ||
      new Date(`${day}T${time}`) > new Date(`${day}T${restaurant.close_time}`)
    ) {
      return response.status(400).json({
        errorMessage: "Restaurant is not open at that time",
      });
    }

    const searchTimesWithTables = await findAvailableTables({ time, day, restaurant, response });
    console.log(searchTimesWithTables)

    if (!searchTimesWithTables) {
      return response.status(400).json({
        errorMessage: "Invalid data provided",
      });
    }

    const searchTimeWithTables = searchTimesWithTables.find(
      (timeTable) => timeTable.date.toISOString() === new Date(`${day}T${time}`).toISOString()
    );

    if (!searchTimeWithTables) {
      return response.status(400).json({
        errorMessage: "No availability for this time",
      });
    }

    const tablesCount: { 2: number[]; 4: number[]; totalSeats: number } = {
      "2": [],
      "4": [],
      totalSeats: 0,
    };

    searchTimeWithTables.tables.forEach((table) => {
      if (table.seats === 2) {
        tablesCount[2].push(table.id);
        tablesCount.totalSeats = tablesCount.totalSeats + 2;
      } else {
        tablesCount[4].push(table.id);
        tablesCount.totalSeats = tablesCount.totalSeats + 4;
      }
    });

    if (parseInt(partySize) > tablesCount.totalSeats) {
      return response.status(400).json({
        errorMessage: "You're booking more tables than the availables",
      });
    }

    const tablesToBook: number[] = [];

    let seatsRemaning = parseInt(partySize);

    while (seatsRemaning > 0) {
      // Look for case if we can choose tables of two seats
      if (seatsRemaning > 2) {
        if (tablesCount[4].length) {
          tablesToBook.push(tablesCount[4][0]);
          tablesCount[4].shift();
          seatsRemaning = seatsRemaning - 4;
        }
      } else {
        if (tablesCount[2].length) {
          tablesToBook.push(tablesCount[2][0]);
          tablesCount[2].shift();
          seatsRemaning = seatsRemaning - 2;
        }
      }
    }

    const booking = await prisma.booking.create({
      data: {
        number_of_people: parseInt(partySize),
        booking_time: new Date(`${day}T${time}`),
        booker_email: bookerEmail,
        booker_phone: bookerPhone,
        booker_first_name: bookerFirstName,
        booker_last_name: bookerLastName,
        booker_occasion: bookerOccasion,
        booker_request: bookerRequest,
        restaurant_id: restaurant.id,
      },
    });

    const bookingsOnTablesData = tablesToBook.map((table) => ({
      table_id: table,
      booking_id: booking.id,
    }));

    await prisma.bookingOnTable.createMany({
      data: bookingsOnTablesData,
    });

    return response.status(200).json({ booking });
  }
}
