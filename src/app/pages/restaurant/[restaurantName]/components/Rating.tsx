import { Review } from "@prisma/client";
import { calculateReviewRatingAverage } from "../../../../../../utils/calculateReviewRatingAverage";
import Stars from "@/app/components/Stars";

interface RatingProps {
    reviews: Review[]
}

export const Rating: React.FC<RatingProps> = ({reviews}: RatingProps) => {
    const rating = calculateReviewRatingAverage(reviews);
    const totalReviewsText = (reviews: Review[]) => {
        if(reviews.length === 0) return 'No Reviews';
        if(reviews.length === 1) return `${reviews.length} Review`;
        if(reviews.length > 1) return `${reviews.length} Reviews`;
    }
    return (
        <div className="flex items-end">
            <div className="ratings mt-2 flex items-center">
                <Stars rating={calculateReviewRatingAverage(reviews)}/>
                <p className="text-reg ml-3">{rating}</p>
            </div>
            <div>
                <p className="text-reg ml-4">{totalReviewsText(reviews)}</p>
            </div>
        </div>
    );
}