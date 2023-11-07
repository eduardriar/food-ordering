import { PRICE } from '@prisma/client';
import React, { ReactNode } from 'react';

interface PriceProps {
    price: PRICE
}

const Price: React.FC<PriceProps> = ({price}) => {

    const PriceRenderObject = {
        "CHEAP": (
            <>
                <span>$$</span><span className="text-gray-400">$$</span>
            </>
        ),
        "REGULAR": (
            <>
                <span>$$$</span><span className="text-gray-400">$</span>
            </>
        ),
        "EXPENSIVE": (
            <>
                <span>$$$$</span>
            </>
        )
    }

    return(
        <p className="flex mr-3">{PriceRenderObject[price]}</p>
    );
}

export default Price;