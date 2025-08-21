import React, { use, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, selectUserRole, logout } from '../../redux/store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { selectCartCount } from '../../redux/store/slices/cart/cartSelector';
const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const userRole = useSelector(selectUserRole);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };
  const noOfItems = useSelector(selectCartCount);


  // Debug logging with useEffect to track changes
  useEffect(() => {
    console.log('=== HEADER RENDER DEBUG ===');
    console.log('Current userRole:', userRole);
    console.log('Is authenticated:', isAuthenticated);
    console.log('Type of userRole:', typeof userRole);
    console.log('Type of isAuthenticated:', typeof isAuthenticated);
    console.log('==========================');
  }, [userRole, isAuthenticated]);

  const handleLogout = () => {
    console.log("Logout button clicked");
    dispatch(logout());
    navigate('/');
  }
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-gray-800">
              Grow Green
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:space-x-8">
            {/* FIXED: Corrected the logic - admins should see adminHome, regular users see Home */}
            {userRole === "admin" ?
              <Link to="/adminHome" className="text-gray-600 hover:text-blue-500 transition-colors duration-200">Admin Home</Link>
              : <Link to="/" className="text-gray-600 hover:text-blue-500 transition-colors duration-200">Home</Link>
            }


            {/* FIXED: Corrected shop logic too */}
            {userRole === "admin" ?
              <Link to="/shop" className="text-gray-600 hover:text-blue-500 transition-colors duration-200">My Shop</Link>
              : <Link to="/shop" className="text-gray-600 hover:text-blue-500 transition-colors duration-200">Shop</Link>
            }

            <Link to="/about" className="text-gray-600 hover:text-blue-500 transition-colors duration-200">About</Link>
            <Link to="/contact" className="text-gray-600 hover:text-blue-500 transition-colors duration-200">Contact</Link>
            {
              isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-blue-500 transition-colors duration-200"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link to="/login" className="text-gray-600 hover:text-blue-500 transition-colors duration-200">Login</Link>
                  <Link to="/signup" className="text-gray-600 hover:text-blue-500 transition-colors duration-200">Sign Up</Link>
                </>
              )
            }
            <Link to="/adminSignup" className="text-gray-600 hover:text-blue-500 transition-colors duration-200">Become a Seller</Link>
          </nav>

          {/* Header Icons & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-blue-500">
              <FaSearch size={20} />
            </button>
            <Link to="/login" className="text-gray-600 hover:text-blue-500">
              <FaUser size={20} />
            </Link>
            {userRole === 'user' ? (<Link to="/cart" className="relative text-gray-600 hover:text-blue-500">
              <FaShoppingCart size={20} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {noOfItems}
              </span>
            </Link>) : null}

            <div className="md:hidden">
              <button onClick={toggleMobileMenu} className="text-gray-600 hover:text-blue-500">
                {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div >

      {/* Mobile Navigation */}
      {
        isMobileMenuOpen && (
          <nav className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {/* Mobile menu should also respect user roles */}
              {userRole === "admin" ?
                <Link to="/adminHome" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100" onClick={toggleMobileMenu}>Admin Home</Link>
                : <Link to="/Home" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100" onClick={toggleMobileMenu}>Home</Link>
              }
              <Link to="/shop" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100" onClick={toggleMobileMenu}>Shop</Link>
              <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100" onClick={toggleMobileMenu}>About</Link>
              <Link to="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100" onClick={toggleMobileMenu}>Contact</Link>
            </div>
          </nav>
        )
      }
    </header >
  );
};

export default Header;