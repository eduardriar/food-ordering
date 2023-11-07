import Link from "next/link";
import { Cuisine, Location, PRICE } from "@prisma/client";
import Price from "./Price";

interface RestaurantProps {
  id: number,
  name: string,
  main_image: string,
  cuisine: Cuisine,
  location: Location,
  price: PRICE,
  slug: string
}

export const RestaurantCard: React.FC<RestaurantProps> = ({...props}) => {
    return(
        <div className="w-64 h-72 m-3 rounded overflow-hidden border cursor-pointer">
              <Link href={`pages/restaurant/${props.slug}`}>
                <img
                  src={props.main_image}
                  alt=""
                  className="w-full h-36"
                />
                <div className="p-1">
                  <h3 className="font-bold text-2xl mb-2">{props.name}</h3>
                  <div className="flex items-start">
                    <div className="flex mb-2">*****</div>
                    <p className="ml-2">77 reviews</p>
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
}