import { NavBar } from "./components/navbar/navbar";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "./pages/home";
import { ProductPage } from "./pages/test.product";
import { CategoryPage } from "./pages/test.category";
import { AboutUs } from "./pages/test.aboutUs";
import { Footer } from "./components/footer";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { Axios } from "./lib/api";
import { MyProfile } from "./components/myProfile";
import { setData } from "./redux/userSlice";
import { Required } from "./components/required";
import { RegisterUserData } from "./components/navbar/register/registerUserData";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/products", element: <ProductPage /> },
  { path: "/categories", element: <CategoryPage /> },
  { path: "/about-us", element: <AboutUs /> },
  { path: "/register-user/:token", element: <RegisterUserData /> },
  { 
    element: <Required />,
    children: [
      { path: "/my-profile", element: <MyProfile /> },     
    ]
  }
])

function App() {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const keepLogIn = async () => {
    try {
      const response = await Axios.get(
        `users/keep-login`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(setData(response.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    keepLogIn();
  }, []);

  return (
    <div>
      <NavBar />
      <RouterProvider router={router} />
      <Footer />
    </div>
  );
}

export default App;
