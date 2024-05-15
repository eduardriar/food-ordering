import Link from "next/link";
import { Cuisine, Location, PRICE, Review } from "@prisma/client";
import Price from "./Price";
import Stars from "./Stars";
import { calculateReviewRatingAverage } from "../../../utils/calculateReviewRatingAverage";

interface RestaurantProps {
  id: number;
  name: string;
  main_image: string;
  cuisine: Cuisine;
  location: Location;
  price: PRICE;
  slug: string;
  reviews: Review[];
}

export const RestaurantCard: React.FC<RestaurantProps> = ({ ...props }) => {
  return (
    <div className="w-64 h-72 m-3 rounded overflow-hidden border cursor-pointer">
      <Link href={`pages/restaurant/${props.slug}`}>
        <img src={props.main_image} alt="" className="w-full h-36" />
        <div className="p-1">
          <h3 className="font-bold text-2xl mb-2">{props.name}</h3>
          <div className="flex items-start">
            <Stars rating={calculateReviewRatingAverage(props.reviews)}/>
            <p className="ml-2">{`${props.reviews.length} review${props.reviews.length > 1 || props.reviews.length === 0 ? "s" : ""}`}</p>
          </div>
          <div className="flex text-reg font-light capitalize">
            <p className=" mr-3">{props.cuisine.name}</p>
            <Price price={props.price} />
            <p>{props.location.name}</p>
          </div>
          <p className="text-sm mt-1 font-bold">Booked 3 times today</p>
        </div>
      </Link>
    </div>
  );
};
