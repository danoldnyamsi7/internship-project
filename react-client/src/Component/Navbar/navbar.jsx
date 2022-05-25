import React from 'react';
import './navbar.css';
import { HomeIcon } from '@heroicons/react/outline';
import { useNavigate, Link } from 'react-router-dom';


function Navbar() {
      const navigateTo = useNavigate();
      const token = localStorage.getItem('access-token');
      const otoken = localStorage.getItem("oaccess-token");
      const logout = () => {
            localStorage.removeItem("access-token");
            navigateTo('/',{ replace: true });
      }
      const logoutOrganizer = () => {
            localStorage.removeItem("oaccess-token");
            navigateTo('/',{ replace: true });
      }

      let bool = false;
      const toggleDropdown = () => {
            bool = !bool
            // show dropdown
            console.log(bool)
            let svg = document.getElementById("svg");
            let options = document.getElementsByClassName("options");
            if (bool) {
                  svg.classList.remove("-rotate-90");
                  svg.classList.add("rotate-0");
                  for(let i= 0; i<= options.length-1; i++){
                        options[i].classList.remove("hidden")
                  }
            } else {
                  svg.classList.remove("rotate-0");
                  svg.classList.add("-rotate-90");
                  for(let i= 0; i<= options.length-1; i++){
                        options[i].classList.add("hidden")
                  }
            }

      }

      let bool2 = false
      
      const toggleDropdown2 = () => {
            bool2 = !bool2
            // show dropdown
            console.log(bool2)
            let options = document.getElementsByClassName("options2");
            let svg2 = document.getElementById("svg2");
            if (bool2) {
                  svg2.classList.remove("-rotate-90")
                  svg2.classList.add("rotate-0");
                  options[0].classList.remove("hidden")
                  options[0].classList.add("flex","flex-col","items-start")
            } else {

                  svg2.classList.remove("rotate-0");
                  svg2.classList.add("-rotate-90");
                  options[0].classList.add("hidden")
            }

      }

      let bool3 = false

      const toggleDropdown3 = () => {
            bool3 = !bool3
            // show dropdown
            console.log(bool3)
            let options3 = document.getElementsByClassName("options3");
            let svg3 = document.getElementById("svg3");
            if (bool3) {
                  svg3.classList.remove("-rotate-90")
                  svg3.classList.add("rotate-0");
                  options3[0].classList.remove("hidden")
                  options3[0].classList.add("flex","flex-col","items-start")
            } else {

                  svg3.classList.remove("rotate-0");
                  svg3.classList.add("-rotate-90");
                  options3[0].classList.add("hidden")
            }

      }



      return (
            <nav className="nav flex justify-between items-center px-8 py-4 bg-black text-white">
                  <div className=" cursor-pointer logo-container uppercase flex justify-start content-center">
                        <span><HomeIcon className="text-white w-7" /></span>
                        <span className="text-white font-bold text-xl">Hall</span>
                        <span className="text-green-500 font-bold text-xl">Renter</span>
                  </div>
                  <div className="navLinks flex justify-end items-center w-1/2">
                        <div className=" w-auto flex justify-around">
                              <Link to="/home" className="hover:underline font-bold text-sm mx-4 ">Home</Link>
                              <Link to="/halls" className="hover:underline font-bold text-sm mx-4 ">Halls</Link>
                              {!token && <Link to="/agent/signup" className= "hover:underline font-bold text-white text-sm mr-4">Join</Link>}
                              <button onClick={toggleDropdown} type="button" className=" text-white text-sm hover:underline font-bold flex items-center">
                                    Accounts
                                    <svg className="-mr-1 ml-2 h-5 w-5 -rotate-90 svg" id="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                              </button>
                              <div className='options hidden text-left absolute mt-11 right-2 w-1/6 bg-green-600 z-40'>
                                    <button onClick={toggleDropdown2} type="button" className="text-white text-sm hover:underline font-bold flex items-center p-2 ">
                                          Organizer
                                          <svg className="-mr-1 ml-2 h-5 w-5 -rotate-90 svg" id="svg2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                          </svg>
                                    </button>
                                    <div className="hidden options2">
                                          {!otoken && <Link to="/organizer/signup" className="w-full"><li className="list-none hover:cursor-pointer  hover:bg-black p-2">Sign up</li></Link>}
                                          {/* {!token && <Link to=""><li className="list-none hover:cursor-pointer hover:bg-black p-2">Sign in</li></Link>} */}
                                          {otoken && <Link to="/organizer/profile-page" className="w-full"><li className="list-none hover:cursor-pointer hover:bg-black p-2">Profile</li></Link>}
                                          {otoken && <Link to="" className="w-full"><li onClick={logoutOrganizer} className="list-none hover:cursor-pointer hover:bg-black p-2">Sign out</li></Link>}
                                    </div>
                              </div>
                              <div className='options hidden absolute mt-11 right-20 mr-[10.5rem] w-1/6 bg-green-600 z-40'>
                                    <button onClick={toggleDropdown3} type="button" className="text-white text-sm hover:underline font-bold flex items-center p-2 ">
                                          Agent
                                          <svg className="-mr-1 ml-2 h-5 w-5 -rotate-90 svg" id="svg3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                          </svg>
                                    </button>
                                    <div className="hidden options3">
                                          {!token && <Link to="/agent/signup" className="w-full"><li className="list-none hover:cursor-pointer  hover:bg-black p-2">Sign up</li></Link>}
                                          {!token && <Link to="/agent/signin" className="w-full"><li className="list-none hover:cursor-pointer hover:bg-black p-2">Sign in</li></Link>}
                                          {token && <Link to="/agent/profile" className="w-full"><li className="list-none hover:cursor-pointer hover:bg-black p-2">Profile</li></Link>}
                                          {token && <Link to="" className="w-full"><li onClick={logout} className="list-none hover:cursor-pointer hover:bg-black p-2">Sign out</li></Link>}
                                    </div>
                              </div>
                              
                        </div>
                  </div>


            </nav>
      )
}

export default Navbar;