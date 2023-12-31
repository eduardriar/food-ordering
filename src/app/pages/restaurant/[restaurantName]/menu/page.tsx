import { Metadata } from "next";
import { RestaurantNavBar } from "../components/RestaurantNavBar";
import { Menu } from "./components/Menu";
import { PrismaClient } from "@prisma/client";

export const metadata: Metadata = {
  title: "Restaurant Menu",
  description: "Generated by create next app :)",
};

const prisma = new PrismaClient();

const fetchRestaurantMenu = async (slug: string) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      items: true,
    },
  });

  return restaurant;
};

const RestaurantMenu = async ({ params }: { params: { restaurantName: string } }) => {
  const restaurantName = params.restaurantName;

  const menu = await fetchRestaurantMenu(restaurantName);

  // We would change this to get the slug using prisma
  return (
    <div className="bg-white w-[100%] rounded p-3 shadow">
      <RestaurantNavBar slug={restaurantName} />
      <Menu menu={menu?.items}/>
    </div>
  );
};

export default RestaurantMenu;
