import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

import Header from './components/commons/header';
import Footer from './components/commons/footer';
import HomePage from './pages/Home';
import ContactUs from './pages/ContactUs';
import About from './pages/About';
import Shop from './pages/Shop';
import Login from './pages/login';
import Cart from './pages/Cart';
import Signup from './pages/SignUp'
import AdminSignupPage from './pages/adminSignup'
import AdminHome from './pages/adminHome';
import AddProduct from './pages/AddProduct';

// Layout component to wrap all pages with Header and Footer
function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <Outlet /> {/* This renders the current page component */}
      </main>
      <Footer />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />
      },
      {
        path: "/about",
        element: <About />
      },
      {
        path: "/contact",
        element: <ContactUs />
      },
      {
        path: "/shop",
        element: <Shop />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/cart",
        element: <Cart />
      },
      {
        path:"/signup",
        element:<Signup/>
      },
      {
        path:"/adminSignup",
        element:<AdminSignupPage/>
      },
      {
        path:"/adminHome",
        element:<AdminHome/>
      },
      {
        path:"/admin/addProduct",
        element:<AddProduct/>
      }
    ]
  }
]);

function App() {
  return (
   
    <RouterProvider router={router} />


  );
}

export default App;