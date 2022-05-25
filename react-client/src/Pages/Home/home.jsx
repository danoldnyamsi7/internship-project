//  import react tools
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../../Component/Loader/loader';
import { HomeIcon } from '@heroicons/react/outline';


function Home() {

  const [loader, setLoader] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoader(false)
    }, 1000)
  }, [])

  return loader ? <Loader /> : (
    <div className="home">

      {/* <main className="flex flex-col justify-center items-center mb-4 h-screen z-0" style={{
        backgroundImage: "url('https://media.istockphoto.com/photos/shot-of-a-group-of-businesspeople-attending-a-conference-picture-id1315048009?b=1&k=20&m=1315048009&s=170667a&w=0&h=FRsaRdYgiedRtrNT3ygNxHzIOR0v6t2Rpl44b49dAcI=')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        zIndex: -1,

      }}> */}
      <main className="flex flex-col justify-center items-center mb-4 h-screen z-0 bg-green-800">
        <div className="mb-4">
          <span className=" cursor-pointer shadow-2xl shadow-black p-4"><HomeIcon className="text-white w-[150px]" /></span>
        </div>
        <div className="  shadow-2xl shadow-black z-20  p-8 rounded">
          <div className="text-white font-[900]">
            <header className="text-4xl">
              <span>Hall</span>
              <span className="text-green-500">Renter</span>
            </header>
            <p className="text-xl mt-1 mb-8 font-normal hover:underline ">
              Hall Reservation Service in Cameroun For All Your Conferences and Events.
            </p>
          </div>
          <div className=" text-white">
            {/* <button className="rounded mx-4 border-2 border-gray-300 p-2 w-1/5 hover:bg-white hover:text-green-500 font-bold"><Link to="about">More</Link></button> */}
            <button className="rounded font-bold mx-4 border-2 border-gray-300 p-2 w-1/3 hover:shadow-2xl hover:shadow-black  bg-white text-green-500"><Link to="/halls" className="flex items-center justify-center hover:underline">
              <span><HomeIcon className="w-[35px]" /></span>
              <span> Halls</span>
            </Link>
            </button>
          </div>
        </div>
      </main>

    </div>
  )
}

export default Home;