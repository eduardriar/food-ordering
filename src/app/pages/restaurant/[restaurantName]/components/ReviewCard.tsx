import Stars from "@/app/components/Stars";
import { PrismaClient, Review } from "@prisma/client";

interface ReviewCardProps {
  review: Review
}

const prisma = new PrismaClient();

const fetchUser = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: {
      id 
    },
    select: {
      first_name: true,
      last_name: true
    }
  });

  return user
}

export const ReviewCard: React.FC<ReviewCardProps> = async ({review}) => {
  const user = await fetchUser(review.user_id);
  const userInitials = `${user?.first_name[0]}${user?.last_name[0]}`
  console.log(review)
  
  return (
    <div className="border-b pb-7 mb-7">
      <div className="flex">
        <div className="w-1/6 flex flex-col items-center">
          <div className="rounded-full bg-blue-400 w-16 h-16 flex items-center justify-center">
            <h2 className="text-white text-2xl">{userInitials}</h2>
          </div>
          <p className="text-center">{`${user?.first_name} ${user?.last_name}`}</p>
        </div>
        <div className="ml-10 w-5/6">
          <div className="flex items-center">
            <Stars rating={review.rating}/> 
          </div>
          <div className="mt-5">
            <p className="text-lg font-light">
              {review.text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
