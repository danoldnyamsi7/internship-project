import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Footer from '../../Component/Footer/footer';


function AgentSignup() {

      const navigateTo = useNavigate();

      const [agent, setAgent] = useState({
            name: "",
            contact: "",
            nationalID: "",
            picture: "",
            password: ""
      })

      const handleChange = (e) => {
            setAgent({ ...agent, [e.target.name]: e.target.value });
      }

      const convertToBase64 = (file) => {
            return new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.readAsDataURL(file);

                  reader.onload = () => {
                        resolve(reader.result);
                  }

                  reader.onerror = (error) => {
                        reject(error)
                  }
            })
      }

      const handlePicture = async (e) => {
            e.preventDefault();
            let file = e.target.files[0];
            let base64 = await convertToBase64(file);
            setAgent(agent => ({
                  ...agent, picture: base64
            }))
            console.log({ picture: agent.picture });
      }

      const handleSubmit = (e) => {
            e.preventDefault();
            axios({
                  url: "http://localhost:8002/api/agent/register",
                  method: "POST",
                  headers: {
                        "Content-Type": "application/json"
                  },
                  data: {
                        name: agent.name,
                        contact: agent.contact,
                        password: agent.password,
                        picture: agent.picture
                  }
            })
                  .then(res => {
                        const data = res.data;
                        console.log({ agent: agent }, { data: data });
                        navigateTo("/agent/signin", { replace: true });
                  })
                  .catch(error => {
                        console.log(error);
                        alert("signup failed please try again")
                        window.location.reload();
                        navigateTo("/agent/signup", { replace: true });
                  });

      }

      return (
            <div className="agent-signup">
                  <form encType='multipart/form-data' className=" flex flex-col transform translate-x-full translate-y-20 mb-[6em] p-4 w-1/3" onSubmit={handleSubmit} autoComplete="off">

                        <div className="bg-grey-lighter flex flex-col">
                              <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
                                    <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
                                          <h1 className="mb-8 text-3xl text-center">Sign up</h1>
                                          <input
                                                type="text"
                                                className="block border border-grey-light w-full p-3 rounded mb-4"
                                                name="name"
                                                onChange={handleChange}
                                                value={agent.name}
                                                placeholder="Full Name"
                                                required />

                                          <input
                                                type="number"
                                                className="block border border-grey-light w-full p-3 rounded mb-4"
                                                name="contact"
                                                onChange={handleChange}
                                                value={agent.contact}
                                                required
                                                placeholder="contact: 6********" />

                                          <input
                                                type="password"
                                                className="block border border-grey-light w-full p-3 rounded mb-4"
                                                name="password"
                                                onChange={handleChange}
                                                value={agent.password}
                                                required
                                                placeholder="Password" />
                                          
                                          <input
                                                type="file"
                                                className="block border-none border-grey-light w-full p-3 rounded mb-4 text-gray-500"
                                                name="picture"
                                                onChange={handlePicture}
                                                required
                                                 />

                                          <button
                                                type="submit"
                                                className="w-full text-center py-3 rounded bg-green-400 text-white hover:bg-green-500 focus:outline-none my-1"
                                          >Create Account</button>

                                         
                                    </div>

                                    <div className="text-grey-dark mt-6">
                                          Already have an account?
                                          <Link to="/signin" className="ml-2 underline border-b border-blue text-blue" href="../login/">
                                                Log in
                                          </Link>.
                                    </div>
                              </div>
                        </div>
                  </form>
                  {/* <form encType='multipart/form-data' className=" transform translate-x-full translate-y-20 border-2 border-red-400 w-1/3" onSubmit={handleSubmit} autoComplete="off">
                        <header>
                              <h2 className="border-b-2 border-orange-600">create an account</h2>
                        </header>
                        <div>
                              <div>
                                    <label>Name: </label>
                                    <input type="text" name="name" onChange={handleChange} value={agent.name} />
                              </div>
                              <div>
                                    <label>Contact: </label>
                                    <input type="number" name="contact" onChange={handleChange} value={agent.contact} />
                              </div>
                              <div>
                                    <label>Password: </label>
                                    <input type="password" name="password" value={agent.password} onChange={handleChange} />
                              </div>
                              <div>
                                    <label>Profile Picture</label>
                                    <input type="file" name="picture" onChange={handlePicture} />
                              </div>
                              <div>
                                    <label>National ID: </label>
                                    <input type="number" name="nationalID" onChange={handleChange} value={agent.nationalID} />
                              </div>
                              <div>
                                    <button type="submit" className="border-0 text-white bg-orange-600 rounded">Next</button>
                              </div>
                        </div>
                  </form> */}

            </div>
      )
}

export default AgentSignup