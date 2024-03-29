import { NavBar } from "./components/navbar/navbar";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "./pages/home";
import { ProductPage } from "./pages/product";
import { Footer } from "./components/footer";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { Axios } from "./lib/api";
import { setData } from "./redux/userSlice";
import { RegisterUserData } from "./components/navbar/register/registerUserData";
import Cart from "./pages/cart";
import { DashboardCustomer } from "./pages/dashboardCustomer";
import { EmailVerification } from "./components/edit/verifyEmail";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "leaflet/dist/leaflet.css"
import { ResetPassword } from "./components/edit/resetPassword";
import { DashboardAdmin } from "./pages/dashboardAdmin";
import { RequiredAdmin } from "./components/requiredAdmin";
import { RequiredCustomer } from "./components/requiredCustomer";
import { RequiredNotAdmin } from "./components/requiredNotAdmin";
import { RequiredSuperAdmin } from "./components/requiredSuperAdmin";

const router = createBrowserRouter([
  {
    element: <RequiredNotAdmin />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/products', element: <ProductPage /> },
      { path: '/products/:category', element: <ProductPage /> },
      { path: '/register-user/:token', element: <RegisterUserData /> },
      { path: '/verify-email/:token', element: <EmailVerification /> },
      { path: '/reset-password/:token', element: <ResetPassword /> },
      {
        element: <RequiredCustomer />,
        children: [
          { path: '/dashboard-customer', element: <DashboardCustomer /> },
          { path: '/carts', element: <Cart /> },
        ],
      }
    ]
  },
  {
    element: <RequiredAdmin />,
    children: [
      { path: '/dashboard-admin', element: <DashboardAdmin /> },
      { path: '/dashboard-admin/products', element: <DashboardAdmin /> },
      { path: '/dashboard-admin/stocks', element: <DashboardAdmin /> },
      { path: '/dashboard-admin/orders', element: <DashboardAdmin /> },
      { path: '/dashboard-admin/payments', element: <DashboardAdmin /> },
      {
        element: <RequiredSuperAdmin />,
        children: [
          { path: '/dashboard-admin/user', element: <DashboardAdmin /> },
          { path: '/dashboard-admin/warehouse', element: <DashboardAdmin /> }
        ],
      },
    ],
  },
]);

function App() {
  let token = localStorage.getItem("token");
  if (token == null) {
    token = localStorage.getItem("adminToken")
  }
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
      toast.success('Welcome!')
    } catch (error) {
      toast.error('Failed to keep login!')
    }
  };

  useEffect(() => {
    keepLogIn();
  }, []);

  return (
    <div className="bg-gray-100 h-screen">
      <ToastContainer />
      <div className="flex flex-col justify-between h-full">
        <div>
          { localStorage.getItem("adminToken") ? '' : <NavBar /> }
          <RouterProvider router={router} />
        </div>
        { localStorage.getItem("adminToken") ? '' : <Footer /> }
      </div>
    </div>
  );
}

export default App;
