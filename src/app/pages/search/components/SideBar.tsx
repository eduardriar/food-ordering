import { Cuisine, Location, PRICE } from "@prisma/client";
import Link from "next/link";

export const SideBar = ({
  cities,
  cuisines,
  searchParams,
}: {
  cities: Location[];
  cuisines: Cuisine[];
  searchParams: { city?: string; cuisine?: string; price?: PRICE };
}) => {
  const route = "/pages/search";
  const prices = [
    {
      price: PRICE.CHEAP,
      label: "$",
    },
    {
      price: PRICE.REGULAR,
      label: "$$",
    },
    {
      price: PRICE.EXPENSIVE,
      label: "$$$",
    },
  ];
  return (
    <div className="w-1/5 mr-5">
      <div className="border-b pb-4 flex flex-col">
        <h1 className="mb-2">Region</h1>
        {cities.map((city) => (
          <Link
            href={{
              pathname: route,
              query: {
                ...searchParams,
                city: city.name,
              },
            }}
            key={`search-city-${city.name}-${city.id}`}
            replace
            className="capitalize">
            {city.name}
          </Link>
        ))}
      </div>
      <div className="border-b pb-4 mt-3 flex flex-col">
        <h1 className="mb-2">Cuisine</h1>
        {cuisines.map((cuisine) => (
          <Link
            className="capitalize"
            href={{
              pathname: route,
              query: {
                ...searchParams,
                cuisine: cuisine.name,
              },
            }}
            key={`search-cuisine-${cuisine.name}-${cuisine.id}`}
            replace>
            {cuisine.name}
          </Link>
        ))}
      </div>
      <div className="mt-3 pb-4">
        <h1 className="mb-2">Price</h1>
        <div className="flex">
            {prices.map((price, index) => (
                <Link
                key={`${price.label}-${index}`}
                href={{
                  pathname: route,
                  query: {
                    ...searchParams,
                    price: price.price,
                  },
                }}
                className={`border w-full text-reg font-light p-2 text-center ${index === 0 ? 'rounded-l' : index === prices.length - 1 ? 'rounded-r' : ''}`}>
                {price.label}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};
