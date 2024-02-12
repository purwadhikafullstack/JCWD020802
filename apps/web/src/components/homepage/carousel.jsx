import { Carousel } from "@material-tailwind/react";
import { useState } from "react";
import { toast } from "react-toastify";
 
export function CarouselTransition() {
  const [carouselLists, setCarouselLists] = useState([])
  return (
    <div className="h-48 sm:h-96">
        <Carousel transition={{ duration: 1 }} className="rounded-xl">
        <img
            src="https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/pageImages/insp_block_715_en_us_16861915970.webp"
            alt="image 1"
            className="h-full w-full object-cover"
        />
        <img
            src="https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/pageImages/insp_block_585_en_us_16817232620.webp"
            alt="image 2"
            className="h-full w-full object-cover"
        />
        <img
            src="https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/pageImages/insp_block_747_en_us_16874122200.webp"
            alt="image 3"
            className="h-full w-full object-cover"
        />
        </Carousel>
    </div>
  );
}