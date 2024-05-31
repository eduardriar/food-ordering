"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { times } from "../../../../../../data";
import useAvailability from "../../../../../../hooks/useAvailability";
import { CircularProgress } from "@mui/material";
import Link from "next/link";
import { Time, convertToDisplayTime } from "../../../../../../utils/convertToDisplayTime";
import { Restaurant } from "@prisma/client";

interface ReservationCardProps {
  restaurant: Restaurant;
}

export const ReservationCard: React.FC<ReservationCardProps> = ({ restaurant }) => {
  console.log(restaurant)
  const { open_time: openTime, close_time: closeTime, party_size: partySize, slug } = restaurant;
  const {
    availability: { loading, data, error },
    fetchAvailability,
  } = useAvailability();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedTime, setSelectedTime] = useState(openTime);
  const [partySizeSelection, setPartySizeSelection] = useState(1);

  const selectOptionBuilder = (partySize: number) => {
    const optionList = [];
    const baseObject = (number: number) => ({
      value: number,
      label: `${number} ${number === 1 ? "Person" : "People"}`,
    });

    for (let index = 1; index <= partySize; index++) {
      optionList.push(baseObject(index));
    }

    return optionList.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ));
  };

  const selectOptionTimeBuilder = () => {
    const openingRange = [];
    const openTimeIndex = times.findIndex((time) => time.time === openTime);
    const closeTimeIndex = times.findIndex((time) => time.time === closeTime);

    for (let index = openTimeIndex; index <= closeTimeIndex; index++) {
      openingRange.push(times[index]);
    }

    return openingRange.map((time) => (
      <option key={time.displayTime} value={time.time}>
        {time.displayTime}
      </option>
    ));
  };

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const handleTimeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedTime(event.target.value);
  };

  const handlePartySizeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setPartySizeSelection(Number(event.target.value));
  };

  const handleClickAvailability = () => {
    fetchAvailability({
      slug,
      day: selectedDate,
      time: selectedTime,
      partySize: `${partySizeSelection}`,
    });
  };

  return (
    <div className="fixed w-[15%] bg-white rounded p-3 shadow">
      <div className="text-center border-b pb-2 font-bold">
        <h4 className="mr-7 text-lg">Make a Reservation</h4>
      </div>
      <div className="my-3 flex flex-col">
        <label htmlFor="">Party size</label>
        <select
          name=""
          className="py-3 border-b font-light text-reg w-28"
          value={partySizeSelection}
          onChange={handlePartySizeChange}
          id="">
          {selectOptionBuilder(partySize)}
        </select>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col w-[48%]">
          <label htmlFor="">Date</label>
          <input
            type="date"
            className="py-3 border-b font-light w-28"
            min={new Date().toISOString().split("T")[0]}
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>
        <div className="flex flex-col w-[48%]">
          <label htmlFor="">Time</label>
          <select name="" id="" className="py-3 border-b font-light" value={selectedTime} onChange={handleTimeChange}>
            {selectOptionTimeBuilder()}
          </select>
        </div>
      </div>
      <div className="mt-5">
        <button
          className="bg-red-600 rounded w-full px-4 text-white font-bold h-16"
          onClick={handleClickAvailability}
          disabled={loading}>
          {loading ? <CircularProgress color="inherit" /> : "Find a Time"}
        </button>
      </div>
      {data && data.availabilities && (
        <div className="mt-4">
          <p className="text-reg">Select a Time</p>
          <div className="flex flex-wrap mt-2">
            {data.availabilities.map((time) => (
              <div key={time.time}>
                {time.availability ? (
                  <Link
                    href={{
                      pathname: `/pages/reserve/${slug}?date=${selectedDate}T${time.time}&partySize=${partySize}`,
                      query: {
                        restaurantName: restaurant.name,
                        restaurantImage: restaurant.main_image,
                        restaurantSlug: restaurant.slug,
                        date: selectedDate,
                        time: time.time,
                        partySize: partySize,
                      }
                    }}
                    className="bg-red-600 cursor-pointer p-2 w-24 text-center text-white mb-3 rounded block mr-3">
                    <p className="text-sm-font-bold">{convertToDisplayTime(time.time as Time)}</p>
                  </Link>
                ) : (
                  <p className="bg-gray-300 p-2 w-24 text-center text-white mb-3 rounded mr-3">
                    {convertToDisplayTime(time.time as Time)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
