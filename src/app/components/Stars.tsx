import React from "react";

import Image from "next/image";
import fullStar from "../../../public/icons/full-star.png";
import emptyStar from "../../../public/icons/empty-star.png";
import halfStar from "../../../public/icons/half-star.png";

export const Stars = ({ rating }: { rating: number }) => {
  const renderStars = (): React.JSX.Element[] => {
    const stars = [];

    for (let i = 0; i < 5; i++) {
      const difference = rating - i;
      if (difference >= 1) stars.push(fullStar);
      else if (difference > 0 && difference < 1) {
        if (difference <= 0.2) stars.push(emptyStar);
        else if (difference > 0.2 && difference <= 0.6) stars.push(halfStar);
        else stars.push(fullStar);
      } else if (difference <= 0) stars.push(emptyStar);
    }

    return stars.map((src, index) => (
      <Image className="w-4 h-4 mr-1" src={src} alt={`Star # ${index}`} key={`Star # ${index}`} />
    ));
  };

  return <div className="flex items-center">{renderStars()}</div>;
};

export default Stars;
