import { Header } from "./components/Header";
import { SideBar } from "./components/SideBar";
import { RestaurantCard } from "./components/RestaurantCard";
import { useSearchParams } from "next/navigation";
import { PRICE, PrismaClient } from "@prisma/client";

interface SearchParams { city?: string; cuisine?: string; price?: PRICE }

const prisma = new PrismaClient();

const getLocationId = async (city: string): Promise<number> => {
  const cityLowerCase = city.toLowerCase();
  const cityCode = await prisma.location.findFirst({
    where: {
      name: cityLowerCase,
    },
    select: {
      id: true,
    },
  });

  return cityCode?.id || 0;
};

const fetchCities = async () => await prisma.location.findMany();

const fetchCuisines = async () => await prisma.cuisine.findMany();

const getCuisineId = async (cuisine: any) =>
  await prisma.cuisine.findFirst({
    where: {
      name: cuisine.name,
    },
  });

const fetchRestaurantByCity = async (searchParams: SearchParams) => {
  const whereStatement: any = {};

  if(searchParams.city){
    const cityCode = await getLocationId(searchParams.city);
    const location = {
      id: cityCode,
    }
    whereStatement.location = location;
  }

  if(searchParams.cuisine){
    const cuisine = {
      name: {
        equals: searchParams.cuisine.toLowerCase()
      }
    }
    whereStatement.cuisine = cuisine;
  }

  if(searchParams.price){
    const price = {
      equals: searchParams.price 
    }
    whereStatement.price = price
  }

  const restaurants = await prisma.restaurant.findMany({
    where: {
      ...whereStatement
    },
    select: {
      id: true,
      name: true,
      location: {
        select: {
          name: true,
        },
      },
      main_image: true,
      price: true,
      cuisine: {
        select: {
          name: true,
        },
      },
      slug: true,
      reviews: true,
    },
  });

  return restaurants;
};

const SearchPage = async ({ searchParams }: { searchParams: SearchParams }) => {
  const city = searchParams.city;
  const cuisine = searchParams.cuisine;
  const price = searchParams.price;

  const restaurantsByCity = await fetchRestaurantByCity({city, cuisine, price});
  const cities = await fetchCities();
  const cuisines = await fetchCuisines();

  return (
    <>
      <SideBar cities={cities} cuisines={cuisines} searchParams={searchParams} />
      <div className="w-5/6">
        {restaurantsByCity.length > 0 ? (
          restaurantsByCity.map((restaurant, index) => (
            <RestaurantCard key={`${index}-${restaurant.name}`} restaurant={restaurant} />
          ))
        ) : (
          <h1>Sorry, we did not found any restaurants</h1>
        )}
      </div>
    </>
  );
};

export default SearchPage;
