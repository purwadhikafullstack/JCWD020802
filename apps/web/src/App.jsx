import { NavBar } from "./components/navbar/navbar";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "./pages/home";
import { ProductPage } from "./pages/test.product";
import { CategoryPage } from "./pages/test.category";
import { AboutUs } from "./pages/test.aboutUs";
import { Footer } from "./components/footer";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/products", element: <ProductPage /> },
  { path: "/categories", element: <CategoryPage /> },
  { path: "/about-us", element: <AboutUs /> },     
])

function App() {
  return (
    <div>
      <NavBar />
      <RouterProvider router={router} />
      <Footer />
    </div>
  );
}

export default App;
