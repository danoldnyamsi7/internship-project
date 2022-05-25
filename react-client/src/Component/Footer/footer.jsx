import React from 'react';
import './footer.css';
import { HomeIcon } from '@heroicons/react/outline';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div className='footer bg-black m-0 pt-4 '>
      
        <div className="cursor-pointer logo-container uppercase flex justify-center content-center">
          <span><HomeIcon className="text-green-500 w-7" /></span>
          <span className="text-white font-bold text-xl">Hall</span>
          <span className="text-green-500 font-bold text-xl">Renter</span>
        </div>
        {/* <div className="mt-1 mb-3 navLinks">
          <ul className="text-white text-sm">
              <Link to="/" className=" mx-1 hover:font-bold hover:text-green-500 hover:underline">Home</Link>
              <Link to="/hall" className=" mx-1 hover:font-bold hover:text-green-500 hover:underline">Halls</Link>
              <Link to="/login" className=" mx-1 hover:font-bold hover:text-green-500 hover:underline">Login</Link>
              <Link to="/" className=" mx-1 text-white font-bold hover:text-green-500 underline">Join +</Link>
          </ul>
        </div> */}
      
      <p className="text-white text-sm">&copy; Copyright All Rights Reserved 2022.</p>
    </div>
  )
}

export default Footer;