import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../Component/Loader/loader'



function ReservationForm({ hall_id }) {
      // const hall = useLocation.state;
      const [reservation, setReservation] = useState({

            date: "",
            time: "",
            duration: "",
            event: "",
            bargain_price: "",
      });
      const navigateTo = useNavigate();

      const [loader, setLoader] = useState(true);

      const hall = useLocation().state;

      console.log({ hall: hall })

      const fetchReservation = () => {


            axios({
                  method: "POST",
                  url: `http://localhost:8002/api/hall/book-hall/${hall._id}`,
                  data: {
                        date: reservation.date,
                        event: reservation.event,
                        bargain_price: reservation.bargain_price
                  },
                  headers: {
                        "Content-Type": "application/json",
                        "oaccess_token": localStorage.getItem("oaccess-token")
                  }


            })
                  .then(async res => {
                        let response = await res.data;
                        console.log(response);
                        alert(response.message);
                        navigateTo("/organizer/profile-page");

                  })
                  .catch(error => {
                        console.log("reservation error: " + error)

                        // window.location.reload();
                        // navigateTo("/hall/book-hall");
                  })
      }

      useEffect(() => {
            fetchReservation();
            setTimeout(()=>{
                  setLoader(false)
                }, 1000)

      }, [reservation.length])

      const handleSubmit = (e) => {
            e.preventDefault();
            console.log(reservation)
            fetchReservation();
      }

      const handleChange = (e) => {
            e.preventDefault();
            setReservation({ ...reservation, [e.target.name]: e.target.value })
            console.log(reservation);
      }



      return loader ? <Loader/> : (
            <div className="flex justify-around flex-wrap">
                  <section className="hall-section w-1/4 rounded shadow-md my-10 text-left p-2 bg-white">
                        <div className="w-full flex flex-col  content-center">
                              <div className="">
                                    <img className="" style={{ width: "100%", height: "300px" }} src={hall.picture} alt="" />
                              </div>
                              <div className="flex flex-col text-white bg-green-500 px-4 py-4">
                                    <span><b> Name: </b>{hall.name}</span>
                                    <span><b>Location:</b>  {hall.location}</span>
                                    <span><b>Capacity: </b>{hall.capacity}</span>
                                    <span><b>Price:</b> {hall.price.toLocaleString('en-US')} XAF</span>
                              </div>
                        </div>
                  </section>
                  <div className="reservation w-[50%]  p-2 bg-white shadow-md my-10">
                        <form className=" flex flex-col p-4" onSubmit={handleSubmit} autoComplete="on">
                              <header className="text-2xl font-bold my-6">Reservation</header>
                              <section>
                                    <input
                                          type="text"
                                          className="block border border-grey-light w-full p-3 rounded mb-4"
                                          name="event"
                                          onChange={handleChange}
                                          value={reservation.event}
                                          placeholder="event " 
                                          required
                                          />
                                          

                                    <input
                                          type="date"
                                          className="block border border-grey-light w-full p-3 rounded mb-4"
                                          name="date"
                                          onChange={handleChange}
                                          value={reservation.date}
                                          required />

                                    <input
                                          type="Number"
                                          className="block border border-grey-light w-full p-3 rounded mb-4"
                                          name="bargain_price"
                                          onChange={handleChange}
                                          value={reservation.bargain_price.toLocaleString('en-US')}
                                          placeholder="what is your price 0.00 FCFA "
                                          required
                                          />

                                    <button
                                          type="submit"
                                          className="w-full text-center py-3 rounded bg-green-400 font-bold text-white hover:bg-green-500 focus:outline-none my-1"
                                    >Validate Reservation</button>

                              </section>
                        </form>
                  </div>

                  {/* <div className="w-full mt-8">
                        <header className="text-3xl font-bold">Other Halls</header>
                  </div> */}
            </div>

      )
}

export default ReservationForm




