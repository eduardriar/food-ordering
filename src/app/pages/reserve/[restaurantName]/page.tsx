"use client";
import { ReserveHeader } from "./components/Header";
import { Form } from "./components/Form";

interface RestaurantReservationProps {
  params: {
    restaurantName: string;
  };
  searchParams: {
    restaurantName: string;
    restaurantImage: string;
    restaurantSlug: string;
    date: string;
    time: string;
    partySize: string;
  };
}

const RestaurantReservation: React.FC<RestaurantReservationProps> = (props) => {

  return (
    <div className="border-t h-screen py-9">
      <div className="w-3/5 m-auto">
        <ReserveHeader {...props.searchParams} />
        <Form
          partySize={props.searchParams.partySize}
          date={props.searchParams.date}
          time={props.searchParams.time}
          slug={props.searchParams.restaurantSlug}
        />
      </div>
    </div>
  );
};

export default RestaurantReservation;
