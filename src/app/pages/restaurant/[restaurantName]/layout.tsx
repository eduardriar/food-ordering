import { Header } from "./components/Header";

// This is a special layout that only works for Restaurant page, 
// it works similarly to the RootLayout, but in this case it'll be used as the layout for Restaurant page
// Called Nested Layout
const RestaurantLayout = ({ children, params }: {children: React.ReactNode; params: {restaurantName: string}}) => {
  return (
    <main>
      <Header name={params.restaurantName}/>
      <div className="flex m-auto w-2/3 justify-between items-start 0 -mt-11">
        {children}
      </div>
    </main>
  );
};

export default RestaurantLayout;
