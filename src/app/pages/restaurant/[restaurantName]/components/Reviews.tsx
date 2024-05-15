import { Review } from "@prisma/client";
import { ReviewCard } from "./ReviewCard";

interface ReviewsProps {
    reviews: Review[];
}

export const Reviews: React.FC<ReviewsProps> = ({reviews}) => {
    return (
        <div>
            <h1 className="font-bold text-3xl mt-10 mb-7 borber-b pb-5">
                What {reviews.length} {reviews.length === 1 ? 'person is' : 'people are'} saying
            </h1>
            <div>
                {/* REVIEW CARD */}
                {reviews.map((review, index) => (
                    <ReviewCard review={review} key={review.id}/>
                ))}
                {/* REVIEW CARD */}
            </div>
        </div>
    );
}