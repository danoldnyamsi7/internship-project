import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../Component/Navbar/navbar';
import Footer from '../../Component/Footer/footer';

function AgentLogin(props) {

      const [creds, setCreds] = useState({
            contact: "",
            password: ""
      })

      const [searchParams, setSearchParams] = useSearchParams();

      const navigateTo = useNavigate();

      const handleChange = (e) => {
            e.preventDefault();
            setCreds({ ...creds, [e.target.name]: e.target.value });
            console.log(creds);
      }


      const handleSubmit = (e) => {
            e.preventDefault();
            axios({
                  url: "http://localhost:8002/api/agent/signin",
                  method: "POST",
                  data: {
                        contact: creds.contact,
                        password: creds.password
                  },
                  headers: {
                        "Content-Type": "application/json"
                  }
            })
                  .then(res => {
                        const { token, agent } = res.data;
                        const { name, _id } = agent;
                        localStorage.setItem("access-token", token);
                        console.log(token, agent);
                        navigateTo("/agent/profile", {replace: true});
                  })
                  .catch(error => {
                        console.error(error);
                        alert("signin failed please try again")
                        window.location.reload();
                        navigateTo("/agent/signin", { replace: true });
                  })

      }

      return (
            <div className="agent-signin">

                  <form onSubmit={handleSubmit} className="flex flex-col transform translate-y-20 translate-x-[100%] mb-[11em] p-4 w-1/3" autoComplete="on">
                        <div className="bg-grey-lighter flex flex-col">
                              <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
                                    <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
                                          <h1 className="mb-8 text-3xl text-center">Sign in</h1>
                                          <input
                                                type="number"
                                                className="block border border-grey-light w-full p-3 rounded mb-4"
                                                name="contact"
                                                onChange={handleChange}
                                                value={creds.contact}
                                                required
                                                placeholder="contact: 6********" />

                                          <input
                                                type="password"
                                                className="block border border-grey-light w-full p-3 rounded mb-4"
                                                name="password"
                                                onChange={handleChange} 
                                                value={creds.password}
                                                required
                                                placeholder="Password" />
                                        

                                          <button
                                                type="submit"
                                                className="w-full text-center py-3 rounded bg-green-400 text-white hover:bg-green-500 focus:outline-none my-1"
                                          >Login</button>


                                    </div>
                              </div>
                        </div>

                  </form>
              
            </div>
      )
}

export default AgentLogin;