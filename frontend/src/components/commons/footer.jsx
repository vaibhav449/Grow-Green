import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  const socialLinks = [
    { icon: <FaFacebookF />, href: '#' },
    { icon: <FaTwitter />, href: '#' },
    { icon: <FaInstagram />, href: '#' },
    { icon: <FaLinkedinIn />, href: '#' },
  ];

  const footerLinks = [
    { title: 'Shop', href: '/shop' },
    { title: 'About Us', href: '/about' },
    { title: 'FAQ', href: '/faq' },
    { title: 'Contact', href: '/contact' },
  ];

  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-white">About eShop</h4>
            <p className="text-gray-400">Your one-stop shop for everything you need. Quality products, great prices, and fast delivery.</p>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-white">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="hover:text-blue-400 transition-colors duration-200">{link.title}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Us Section */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-white">Follow Us</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a key={index} href={social.href} className="text-2xl hover:text-blue-400 transition-colors duration-200">
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-900 py-4">
        <p className="text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} eShop. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;