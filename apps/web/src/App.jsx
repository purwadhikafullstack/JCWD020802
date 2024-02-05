import { NavBar } from "./components/navbar/navbar";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "./pages/home";
import { ProductPage } from "./pages/test.product";
import { CategoryPage } from "./pages/test.category";
import { AboutUs } from "./pages/test.aboutUs";
import { Footer } from "./components/footer";
import Cart from "./pages/cart";
import Checkout from './pages/checkout';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Axios } from "./lib/api";
import { setData } from "./redux/userSlice";
import { Required } from "./components/required";
import { RegisterUserData } from "./components/navbar/register/registerUserData";
import Cart from "./pages/cart";
import { DashboardCustomer } from "./pages/dashboardCustomer";
import { NewEmailVerification } from "./components/edit/verifyNewEmail";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "leaflet/dist/leaflet.css"
import { Role } from "./components/role";
import { MyProfile } from "./components/dashboard/myProfile";
import { SideBar } from "./components/sidebar";
import { UserLists } from "./components/dashboard/userLists";
import { Warehouse } from "./components/dashboard/warehouse";
import { Product } from "./components/dashboard/product";
import { Stock } from "./components/dashboard/stock";
import { Order } from "./components/dashboard/order";
import { Payment } from "./components/dashboard/payment";

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/products', element: <ProductPage /> },
  { path: '/categories', element: <CategoryPage /> },
  { path: '/about-us', element: <AboutUs /> },
  { path: '/cart', element: <Cart /> },
  { path: '/cart/checkout', element: <Checkout /> },
  { path: '/register-user/:token', element: <RegisterUserData /> },
  { path: '/verify-new-email/:token', element: <NewEmailVerification /> },
  {
    element: <Required />,
    children: [
      { path: '/dashboard-customer', element: <DashboardCustomer /> },
      {
        element: <Role />,
        children: [
          { path: '/dashboard-admin/profile', element: <MyProfile /> },
          { path: '/dashboard-admin/user-lists', element: <UserLists /> },
          { path: '/dashboard-admin/warehouse', element: <Warehouse /> },
          { path: '/dashboard-admin/products', element: <Product /> },
          { path: '/dashboard-admin/stocks', element: <Stock /> },
          { path: '/dashboard-admin/orders', element: <Order /> },
          { path: '/dashboard-admin/payments', element: <Payment /> },
        ],
      },
    ],
  },
]);

function App() {
  const user = useSelector((state) => state.user.value);
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
      <ToastContainer />
      {
        user.role == 'Super Admin' ?
        <div className="flex gap-3">
          <SideBar />
          <MyProfile />
          {/* <RouterProvider router={router} /> */}
        </div> :
        <div>
          <NavBar />
          <RouterProvider router={router} />
        </div>
      }
    </div>
  );
}

export default App;
