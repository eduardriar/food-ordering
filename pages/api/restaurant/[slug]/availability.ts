import { NextApiRequest, NextApiResponse } from "next";
import { times } from "../../../../data";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
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

  const searchTimes = times.find((t) => t.time === time)?.searchTimes;

  if (!searchTimes) {
    return response.status(400).json({
      errorMessage: "Invalid data provided",
    });
  }

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

  const tables = restaurant.tables;

  const searchTimesWithTables = searchTimes.map(searchTime => {
    return {
      date: new Date(`${day}T${searchTime}`),
      time: searchTime,
      tables
    }
  });

  searchTimesWithTables.forEach(t => {
    t.tables = t.tables.filter(table => {
      if(bookingTablesObj[t.date.toISOString()]){
        if(bookingTablesObj[t.date.toISOString()][table.id]) return false
      }
      return true
    })
  });

  const availabilities = searchTimesWithTables.map(t => {
    const sumSeats = t.tables.reduce((accumulator, table) => accumulator + table.seats, 0);
    return {
      time: t.time,
      availability: Number(partySize) <= sumSeats
    }
  }).filter(availability => {
    const timeIsAfterOpenningHour = new Date(`${day}T${availability.time}`) >= new Date(`${day}T${restaurant.open_time}`);
    const timeIsBeforeClosingHour = new Date(`${day}T${availability.time}`) <= new Date(`${day}T${restaurant.close_time}`);

    return timeIsAfterOpenningHour && timeIsBeforeClosingHour;
  });

  return response.json({ availabilities });
}
