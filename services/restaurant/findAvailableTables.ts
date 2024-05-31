import { PrismaClient, Restaurant } from "@prisma/client";
import { times } from "../../data/times";
import { NextApiResponse } from "next";

const prisma = new PrismaClient();

export const findAvailableTables = async ({
  time,
  day,
  restaurant,
  response,
}: {
  time: string;
  day: string;
  restaurant: {
    tables: {
      id: number;
      seats: number;
      restaurant_id: number;
      created_at: Date;
      updated_ate: Date;
    }[];
    open_time: string;
    close_time: string;
  };
  response: NextApiResponse;
}) => {
  const searchTimes = times.find((t) => t.time === time)?.searchTimes;
  console.log(searchTimes)

  if (!searchTimes) {
    return response.status(400).json({
      errorMessage: "Invalid data provided",
    });
  }

  console.log(`${day}T${searchTimes[0]}`)
  console.log(new Date(`${day}T${searchTimes[0]}`))

  const bookings = await prisma.booking.findMany({
    where: {
      booking_time: {
        //Greater than
        gte: new Date(`${day}T${searchTimes[0]}`),
        //Less than
        lte: new Date(`${day}T${searchTimes[searchTimes.length - 1]}`),
      },
    },
    select: {
      number_of_people: true,
      booking_time: true,
      booking_on_table: true,
    },
  });

  const bookingTablesObj: { [key: string]: { [key: number]: boolean } } = {};

  bookings.forEach((booking) => {
    bookingTablesObj[booking.booking_time.toISOString()] = booking.booking_on_table.reduce((obj, table) => {
      return {
        ...obj,
        [table.table_id]: true,
      };
    }, {});
  });

  const tables = restaurant.tables;

  const searchTimesWithTables = searchTimes.map((searchTime) => {
    return {
      date: new Date(`${day}T${searchTime}`),
      time: searchTime,
      tables,
    };
  });

  searchTimesWithTables.forEach((t) => {
    t.tables = t.tables.filter((table) => {
      if (bookingTablesObj[t.date.toISOString()]) {
        if (bookingTablesObj[t.date.toISOString()][table.id]) return false;
      }
      return true;
    });
  });

  return searchTimesWithTables;
};
