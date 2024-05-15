import { Review } from "@prisma/client";

export const calculateReviewRatingAverage = (reviews: Review[]) => {
  if (!reviews.length) return 0;

  // Array.reduce((accumulator, currentValue) => (callback), initialValue)
  // Array.reduce, in this case, will return a unique value for example doing the sum of all its items returning the total amount of reviews
  // Having that on mind the result will be the average as the result of dividing it by its length
  const initialValue = 0;
  const average =
    reviews.reduce((accumulator, review) => {
      return accumulator + review.rating;
    }, initialValue) / reviews.length;

  return Math.round(average * 100) / 100;
};
