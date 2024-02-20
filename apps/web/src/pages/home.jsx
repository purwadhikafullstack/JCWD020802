import { Footer } from "../components/footer";
import { CarouselTransition } from "../components/homepage/carousel";
import { ProductCategories } from "../components/homepage/productCategories";
import { NavBar } from "../components/navbar/navbar";

export function HomePage() {
  return (
    <div className="flex flex-col justify-between h-screen">
      <div className="bg-gray-100">
        <NavBar />
        <div className="mx-auto py-5 px-2 md:px-5 w-full bg-white md:w-4/5 lg:w-3/5">  
          <CarouselTransition />
          <ProductCategories />
        </div>
      </div>
      <Footer />
    </div>
  );
}