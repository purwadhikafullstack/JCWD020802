import { CarouselTransition } from "../components/homepage/carousel";
import { ProductCategories } from "../components/homepage/productCategories";

export function HomePage() {
  return (
    <div className="px-5 py-5 sm:px-20 2xl:px-80">
      <CarouselTransition />
      <ProductCategories />
    </div>
  );
}