import Image from "next/image";
import { times } from "../../../../../../data";

interface ReserveHeaderProps {
  restaurantName: string;
  restaurantImage: string;
  date: string;
  time: string;
  partySize: string;
}

export const ReserveHeader: React.FC<ReserveHeaderProps> = ({
  restaurantName,
  restaurantImage,
  date,
  time,
  partySize,
}) => {
  const displayTime = times.find((t) => t.time === time)?.displayTime;
  return (
    <div className="w-[100%]">
      <h3 className="font-bold">{"You're almost done!"}</h3>
      <div className="mt-5 flex">
        <Image
          src={restaurantImage}
          alt={`Image of ${restaurantName}`}
          className="w-64 h-64 rounded"
          width={"100"}
          height={"100"}
        />
        <div className="ml-4">
          <h1 className="text-3xl font-bold">{restaurantName}</h1>
          <div className="flex mt-3 flex flex-col gap-1">
            {/* <p className="mr-6">Tues, 22, 2023</p> */}
            <p className="mr-6">{new Date(date).toDateString()}</p>
            <p className="mr-6">{displayTime}</p>
            <p className="mr-6">{`${partySize} ${parseInt(partySize) > 1 ? "people" : "person"}`}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
