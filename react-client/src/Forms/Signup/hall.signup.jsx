import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../Component/Navbar/navbar';
import Footer from '../../Component/Footer/footer';
import Loader from '../../Component/Loader/loader'


function HallRegistration() {

  const [hall, setHall] = useState({
    name: "",
    contact: "",
    agent: "",
    agenda: "",
    capacity: "",
    picture: "",
    location: "",
    price: '',
  })

  const [loader, setLoader] = useState(true);

  useEffect(()=>{
    setTimeout(()=>{
      setLoader(false)
    }, 1000)
  }, [])
  
  // const token = localStorage.getItem("access-token")

  const navigateTo = useNavigate();

  const handleChange = (e) => {
    e.preventDefault();
    setHall({ ...hall, [e.target.name]: e.target.value });
    console.log(hall);
  }

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        resolve(reader.result);
      }

      reader.onerror = (error) => {
        reject({ imageError: error })
      }
    })
  }

  const handleSubmit = (e) => {

    axios({
      url: "http://localhost:8002/api/hall/register",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access_token": localStorage.getItem("access-token")
      },
      data: {
        name: hall.name,
        location: hall.location,
        capacity: hall.capacity,
        picture: hall.picture,
        price: hall.price
      }
    })
      .then(res => {
        const data = res.data.data;

        setHall({ ...hall, data });
        alert("Hall Created Successfully click ok to continue");
        navigateTo("/agent/profile", { replace: true });

      })
      .catch(error => {
        console.log({ error: error });
        alert("there was a problem please try again");
        window.location.reload();
        navigateTo("/hall/register", { replace: true });
      });
    console.log(hall)

  }


  const handlePicture = async (e) => {
    e.preventDefault();
    let file = e.target.files[0];
    let base64 = await convertToBase64(file);
    // const arr = [];
    // arr.push(base64)
    // setAgent({...agent, [e.target.name]: e.target.files[0]});
    // setHall({ ...hall, picture: arr });
    setHall({ ...hall, picture: base64 });
    console.log({ picture: hall.picture });
  }

  return  (
    <div>

      <form encType='multipart/form-data' className=" flex flex-col transform translate-x-full translate-y-[10%] mb-[5em] p-4 w-1/3" onSubmit={handleSubmit} autoComplete="on">

        <div className="bg-grey-lighter flex flex-col">
          <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
            <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
              <h1 className="mb-8 text-3xl text-center">Create Hall</h1>
              <input
                type="text"
                className="block border border-grey-light w-full p-3 rounded mb-4"
                name="name"
                onChange={handleChange}
                value={hall.name}
                placeholder="Hall Name"
                required />

              <input
                type="text"
                className="block border border-grey-light w-full p-3 rounded mb-4"
                name="location"
                onChange={handleChange}
                value={hall.location}
                placeholder="location: Town, Quater"
                required />

              <input
                type="number"
                className="block border border-grey-light w-full p-3 rounded mb-4"
                name="capacity"
                onChange={handleChange}
                value={hall.capacity}
                placeholder="Hall capacity: number of chairs"
                required />
              <input
                type="number"
                className="block border border-grey-light w-full p-3 rounded mb-4"
                name="price"
                onChange={handleChange}
                value={hall.price}
                placeholder="Reservation price" 
                required
                />
              <input
                type="file"
                className="block border-none border-grey-light w-full p-3 rounded mb-4 text-gray-500"
                name="picture"
                onChange={handlePicture}
                required
                
              />

              <button
                // type="submit"
                className="w-full text-center py-3 rounded bg-green-400 text-white hover:bg-green-500 focus:outline-none my-1"
              >Create Hall</button>


            </div>

          </div>
        </div>
      </form>


    </div>
  )
}

export default HallRegistration