import { Item } from "@prisma/client";
import { MenuCard } from "./MenuCard";

export const Menu = ({ menu }: { menu: Item[] | undefined }) => {
  return (
    <main className="bg-white mt-5">
      <div>
        <div className="mt-4 pb-1 mb-1">
          <h1 className="font-bold text-4xl">Menu</h1>
        </div>
        {menu?.length ? (
          <div className="flex flex-wrap justify-between">
            {menu?.map((item) => (
              <MenuCard item={item} key={item.name} />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-between">
            <p>This restaurant doesnt have menu</p>
          </div>
        )}
      </div>
    </main>
  );
};
