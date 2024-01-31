import { NavBar } from "./components/navbar/navbar";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "./pages/home";
import { ProductPage } from "./pages/test.product";
import { CategoryPage } from "./pages/test.category";
import { AboutUs } from "./pages/test.aboutUs";
import { Footer } from "./components/footer";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Axios } from "./lib/api";
import { setData } from "./redux/userSlice";
import { Required } from "./components/required";
import { RegisterUserData } from "./components/navbar/register/registerUserData";
import Cart from "./pages/cart";
import { DashboardCustomer } from "./pages/dashboardCustomer";
import { EmailVerification } from "./components/edit/verifyEmail";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "leaflet/dist/leaflet.css"
import { ResetPassword } from "./components/edit/resetPassword";
import { DashboardAdmin } from "./pages/dashboardAdmin";

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/products', element: <ProductPage /> },
  { path: '/categories', element: <CategoryPage /> },
  { path: '/about-us', element: <AboutUs /> },
  { path: '/carts', element: <Cart /> },
  { path: '/register-user/:token', element: <RegisterUserData /> },
  { path: '/verify-email/:token', element: <EmailVerification /> },
  { path: '/reset-password/:token', element: <ResetPassword /> },
  {
    element: <Required />,
    children: [
      { path: '/dashboard-customer', element: <DashboardCustomer /> },
      { path: '/dashboard-admin/profile', element: <DashboardAdmin /> },
      { path: '/dashboard-admin/user-lists', element: <DashboardAdmin /> },
      { path: '/dashboard-admin/warehouse', element: <DashboardAdmin /> },
      { path: '/dashboard-admin/products', element: <DashboardAdmin /> },
      { path: '/dashboard-admin/stocks', element: <DashboardAdmin /> },
      { path: '/dashboard-admin/orders', element: <DashboardAdmin /> },
      { path: '/dashboard-admin/payments', element: <DashboardAdmin /> },
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
        user.role == 'Super Admin' || user.role == 'Warehouse Admin' ?
        '' :
        <NavBar />
      }
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
