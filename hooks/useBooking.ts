import axios from "axios";
import { useState } from "react";

export const useBooking = () => {
  const [reservation, setReservation] = useState({
    data: {},
    error: [""],
    loading: false,
  });

  const doReservation = async ({
    partySize,
    slug,
    date,
    time,
    user
  }: {
    partySize: string;
    slug: string;
    date: string;
    time: string;
    user: {
      phone: string,
      email: string,
      firstName: string,
      lastName: string,
      occasion?: string,
      request?: string,
    }
  }) => {
    console.log(date)
    setReservation((prevState) => ({
      ...prevState,
      loading: true,
    }));

    try {
      const response = await axios.post(
        `http://127.0.0.1:3000/api/restaurant/${slug}/reserve?day=${date}&time=${time}&partySize=${partySize}`,
        {
          slug: slug,
          bookerPhone: user.phone,
          bookerEmail: user.email,
          bookerFirstName: user.firstName,
          bookerLastName: user.lastName,
          bookerOccasion: user.occasion || '',
          bookerRequest: user.request || '',
        }
      );

      setReservation((prevState) => ({
        ...prevState,
        data: response.data,
        loading: false,
      }));
    } catch (error: any) {
      setReservation((prevState) => ({
        ...prevState,
        error: [error.response.data.errorMessage] || [error.message],
        loading: false,
      }));
    }
  };

  return {
    doReservation,
    reservation
  };
};
