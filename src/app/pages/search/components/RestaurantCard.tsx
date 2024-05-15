import Price from "@/app/components/Price";
import { PRICE, Restaurant, Review } from "@prisma/client";
import Link from "next/link";
import { calculateReviewRatingAverage } from "../../../../../utils/calculateReviewRatingAverage";
import Stars from "@/app/components/Stars";

interface IRestaurantCard {
  id: number;
  name: string;
  location: { name: string };
  main_image: string;
  price: PRICE;
  cuisine: { name: string };
  slug: string;
  reviews: Review[];
}

const renderRatingText = (average: number) => {
    if(average > 4) return 'Awesome';
    if(average > 3 && average <= 4) return 'Good';
    if(average > 2 && average <= 3) return 'Average';
    return 'Not bad';
}

export const RestaurantCard = ({ restaurant }: { restaurant: IRestaurantCard }) => {
    const restaurantReviewAverage = calculateReviewRatingAverage(restaurant.reviews);
    return (
    <div className="border-b flex pb-5">
      <img src={restaurant.main_image} alt="" className="w-44 rounded" />
      <div className="pl-5">
        <h2 className="text-3xl">{restaurant.name}</h2>
        <div className="flex items-start">
          <Stars rating={restaurantReviewAverage}/>
          <p className="ml-2 text-sm">{renderRatingText(restaurantReviewAverage)}</p>
        </div>
        <div className="mb-9">
          <div className="font-light flex text-reg">
            <Price price={restaurant.price} />
            <p className="mr-4 capitalize">{restaurant.cuisine.name}</p>
            <p className="mr-4 capitalize">{restaurant.location.name}</p>
          </div>
        </div>
        <div className="text-red-600">
          <Link href={`restaurant/${restaurant.slug}`}>View more information</Link>
        </div>
      </div>
    </div>
  );
};
