import axios from "axios";
import { useState } from "react";

interface AvailabilityTime {
  availabilities: {
    time: string;
    availability: boolean;
  }[]
}

interface Availability {
  data: AvailabilityTime;
  error: string[];
  loading: boolean;
}

const useAvailability = () => {
  const [availability, setAvailability] = useState<Availability>({
    data: {} as AvailabilityTime,
    error: [""],
    loading: false,
  });

  const fetchAvailability = async ({
    slug,
    day,
    time,
    partySize,
  }: {
    slug: string;
    day: string;
    time: string;
    partySize: string;
  }) => {
    
    setAvailability((prevState) => ({
      ...prevState,
      loading: true,
    }));

    try {
      console.log(day)
      const response = await axios.get(`http://127.0.0.1:3000/api/restaurant/${slug}/availability`, {
        params: {
          day,
          time,
          partySize,
        },
      });

      setAvailability((prevState) => ({
        ...prevState,
        data: response.data,
        loading: false,
      }));
    } catch (error: any) {
      setAvailability((prevState) => ({
        ...prevState,
        error: [error.response.data.errorMessage] || [error.message],
        loading: false,
      }));
    }
  };

  return { availability, fetchAvailability };
};

export default useAvailability;
