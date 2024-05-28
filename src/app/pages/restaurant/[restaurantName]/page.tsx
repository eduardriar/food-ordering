import { RestaurantNavBar } from "./components/RestaurantNavBar";
import { Title } from "./components/Title";
import { Rating } from "./components/Rating";
import { Description } from "./components/Description";
import { Images } from "./components/Images";
import { Reviews } from "./components/Reviews";
import { ReservationCard } from "./components/ReservationCard";
import { Metadata } from "next";
import { PrismaClient, Review } from "@prisma/client";
import { notFound } from "next/navigation";

interface Restaurant {
  id: number;
  name: string;
  images: string[];
  description: string;
  slug: string;
  reviews: Review[];
  party_size: number;
  open_time: string;
  close_time: string;
}

const prisma = new PrismaClient();

const fetchRestaurant = async (slug: string): Promise<Restaurant> => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
      name: true,
      images: true,
      description: true,
      slug: true,
      reviews: true,
      party_size: true,
      open_time: true,
      close_time: true,
    },
  });

  // if(!restaurant) throw new Error("Cannot find a restaurant");
  if (!restaurant) notFound();

  return restaurant;
};

// Metadata object automatically replace the head in each page where it is
export const metadata: Metadata = {
  title: "Bicono Restaurant",
  description: "Generated by create next app :)",
  icons: {
    icon: "/cutlery.ico",
  },
};

const RestaurantDetailsPage = async ({ params }: { params: { restaurantName: string } }) => {
  const restaurantName = params.restaurantName;
  const restaurant = await fetchRestaurant(restaurantName);

  return (
    <>
      <div className="bg-white w-[70%] rounded p-3 shadow">
        <RestaurantNavBar slug={restaurant.slug} />
        <Title name={restaurant.name} />
        <Rating reviews={restaurant.reviews} />
        <Description description={restaurant.description} />
        <Images images={restaurant.images} />
        <Reviews reviews={restaurant.reviews} />
      </div>
      <div className="w-[27%] relative text-reg">
        <ReservationCard
          partySize={restaurant.party_size}
          openTime={restaurant.open_time}
          closeTime={restaurant.close_time}
          slug={restaurant.slug}
        />
      </div>
    </>
  );
};

export default RestaurantDetailsPage;
