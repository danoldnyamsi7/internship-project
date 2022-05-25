import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import Loader from '../../../Component/Loader/loader';

function OrganizerProfile() {

      const [profile, setProfile] = useState(
            {
                  bargain_price: "",
                  confirmed: "",
                  event: "",
                  reservations: [],
                  organizer_id: "",
            }
      );

      const navigateTo  = useNavigate()
      const [loader, setLoader] = useState(true);


      let event = useRef("");
      let bargain_price = useRef("");
      let date = useRef("");

      const [bookings, setBookings] = useState([]);

      const [checked, setChecked] = useState();

      const toggleAccordion = (toggle) => {
            if (checked === toggle) {
                  return setChecked(checked => null)
            } else {
                  return setChecked(checked => toggle);
            }
      }

      const fetchProfile = async () => {
            await axios({
                  method: "GET",
                  url: "http://localhost:8002/api/organizer/profile",
                  headers: {
                        "Content-Type": "application/json",
                        "oaccess_token": localStorage.getItem("oaccess-token")
                  }
            })
                  .then(async res => {
                        const response = await res.data;
                        console.log({ organizer: response.data, message: response.message })
                        setProfile(profile => response.data);
                        console.log({ profile: profile });
                  })
                  .catch(error => {
                        console.log({ message: error, error: error });
                        navigateTo("/organizer/signin");
                  })
      }
      useEffect(() => {
            setTimeout(()=>{
                  setLoader(false)
                }, 1000)
            fetchProfile()
            fetchReservations()

      }, [profile.length])

      const fetchReservations = () => {
            axios({
                  method: "GET",
                  url: "http://localhost:8002/api/organizer/reservations-list",
                  headers: {
                        "Content-Type": "application/json",
                        "oaccess_token": localStorage.getItem("oaccess-token")
                  }
            })
                  .then(response => {
                        setBookings(bookings => [...response.data.data]);
                        // console.log({ bookings: response.data.data });
                        console.log({ bookings: bookings });
                  })
                  .catch(error => {
                        alert(error.message);
                        console.log(error.message);
                  })
      }

      const handleUpdate = (id) => {
            // const target = document.getElementById(id);
            const target = document.querySelector(`[name=${id}]`);
            console.log(id, { target: target });
            target.removeAttribute("disabled");
      };

      const handleChange = (e) => {
            setProfile({ ...profile, [e.target.name]: e.target.value });
            console.log(profile, e.target.name, e.target.value);
      };

      const handleChangeReservation = (id, target, ref) => {
            const newReservation = profile.reservations.map(reservation => {
                  if (reservation._id === id) {
                        console.log({ reservationID: reservation._id })
                        console.log({ profile: profile })
                        return { ...reservation, [target]: ref.current.value }
                  }
                  return reservation
            })
            setProfile({ ...profile, reservations: [...newReservation] })

      }

      const handleRefresh = () => {
            // update the profile ressource in the database and output result
            axios({
                  method: "PATCH",
                  url: "http://localhost:8002/api/organizer/update-profile",
                  data: {
                        contact: profile.contact
                  },
                  headers: {
                        "Content-Type": "application/json",
                        oaccess_token: localStorage.getItem("oaccess-token"),
                  },
            })
                  .then((response) => {
                        console.log(response.data);
                        setProfile({ ...profile, response });
                        window.location.reload();
                  })
                  .catch((error) => {
                        console.log(error);
                        alert(error.message);
                  });
      };

      let book;
      const handleSubmit = (reservation_id) => {
            console.log(reservation_id)
            // update the organizer ressource in the database and output result
            book = profile.reservations.filter(item => {
                  console.log(item)
                  return item._id === reservation_id;
            })
            console.log('book', book[0])
            axios({
                  method: "PATCH",
                  url: `http://localhost:8002/api/organizer/update-reservation/${reservation_id}`,
                  data: {
                        ...book[0]
                  },
                  headers: {
                        "Content-Type": "application/json",
                        oaccess_token: localStorage.getItem("oaccess-token"),
                  },
            })
                  .then((response) => {
                        console.log(response.data);
                        alert(response.data.message);
                        // setAgent({...agent, halls: response})
                        window.location.reload();
                  })
                  .catch((error) => {
                        console.log(error);
                        alert(error.message);
                  });
      }

      const deleteReservation = (reservation_id) => {
            let confirmed = prompt("Enter 'OK' and Press 'OK' to delete this reservation");
            console.log(confirmed)
            if (confirmed.toLowerCase() === 'ok') {
                  axios({
                        method: "DELETE",
                        url: `http://localhost:8002/api/organizer/cancel-reservation/${reservation_id}`,
                        headers: {
                              "Content-Type": "application/json",
                              "oaccess_token": localStorage.getItem("oaccess-token")
                        }
                  })
                        .then((response) => {
                              alert(response.data.message);
                              window.location.reload();
                        })
                        .catch(error => {
                              console.log(error);
                              alert(error.message);
                        })
            } else {
                  alert("make sure you entered ok in the dialog box");
            }
      }


      return loader ? <Loader/> :(
            <div className="">
                  <section className=" px-8 mt-9 mb-4 profile-infos flex items-center justify-start ">
                        <div className="flex items-center bg-green-500 rounded shadow-lg">
                              <svg xmlns="http://www.w3.org/2000/svg" className=" hover:cursor-pointer h-1/3 w-1/3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                              </svg>
                              <div className="cursor-pointer ml-4 flex flex-col items-center justify-start capitalize ">
                                    <span className="font-bold text-white">Organizer</span>
                                    <span className="font-light text-white">{profile.contact}</span>
                              </div>
                        </div>
                  </section>

                  <hr className="leading-3 border-[1px] border-gray-300 py-1 mx-4" />

                  <section className="inputs ml-4 my-5 py-4">
                        <div className="flex items-center mx-9 my-4">

                        </div>
                        <div className="flex items-center mx-9">
                              <div className="flex items-center w-full">
                                    <label className="block  mr-4 w-[8%] text-left">
                                          Contact:
                                    </label>
                                    <input
                                          className="w-1/4 border-[1px] border-gray-500 p-1 text-bold font-semibold text-black bg-white"
                                          type="number"
                                          disabled
                                          id="contact"
                                          onChange={handleChange}
                                          placeholder={profile.contact}
                                          name="contact"

                                    />
                                    <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          onClick={() => {
                                                handleUpdate("contact");
                                          }}
                                          className="h-5 w-5 cursor-pointer focus:text-green-500 hover:text-green-500 ml-8"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                    >
                                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>

                                    <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          onClick={() => {
                                                handleRefresh();
                                          }}
                                          className="h-6 w-6 cursor-pointer hover:text-blue-500 ml-4"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                          strokeWidth={2}
                                    >
                                          <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                          />
                                    </svg>
                              </div>
                        </div>

                  </section>

                  <hr className="leading-3 border-[1px] border-gray-300 py-1 mx-4" />

                  <section className="hall-section text-left my-8 mx-4 pl-8">
                        <header className="capitalize text-3xl flex justify-between text-green-500 font-bold">Reservations</header>
                        <section className="accordion my-4">
                              {
                                    bookings.length === 0 ? (
                                          <div>
                                                <p className="text-red-500 capitalize underline">no reservations made yet!</p>
                                          </div>
                                    ) : (
                                          <div>
                                                {
                                                      bookings.map((reservation, i) => {
                                                            return (
                                                                  <div className="accordion-container overflow-x-auto my-8" key={reservation._id}>
                                                                        <div onClick={() => { toggleAccordion(i) }} className="cursor-pointer accordion-header bg-white hover:text-white hover:bg-green-500 p-4 rounded flex justify-between">
                                                                              <header className=""><span>{reservation.confirmed ? <span className="font-light mr-4 text-green-500">confirmed</span> : <span className="font-light text-red-500 mr-4">Pending:</span>}</span><span>{reservation.event}</span><span className="font-light ml-4">{reservation.date}</span></header>
                                                                              <span className="plus">
                                                                                    {
                                                                                          checked === i ? <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                                                <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                                                                          </svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                                                          </svg>
                                                                                    }
                                                                              </span>
                                                                        </div>
                                                                        <div className="accordion-content  bg-white">
                                                                              <hr className="leading-3 border-[1px] border-gray-300 " />
                                                                              {
                                                                                    checked === i &&
                                                                                    <div className="p-4 flex flex-wrap ">
                                                                                          <div className="w-2/5 mb-4">
                                                                                                <img className="cursor-pointer rounded" src={reservation.hall_id.picture} alt="" style={{
                                                                                                      width: "100%",
                                                                                                      height: "400px"
                                                                                                }} />
                                                                                          </div>


                                                                                          <div className="hall-infos w-1/2 ml-6">

                                                                                                <form className=" flex flex-col p-4" autoComplete="on">

                                                                                                      <section>
                                                                                                            <input
                                                                                                                  type="text"
                                                                                                                  className="block border border-black w-[70%] p-3 rounded mb-4"
                                                                                                                  name="hall_name"
                                                                                                                  value={reservation.hall_id.name} disabled />
                                                                                                            <input
                                                                                                                  type="text"
                                                                                                                  className="block border border-black w-[70%] p-3 rounded mb-4"
                                                                                                                  name="agent"
                                                                                                                  value={'Agent: ' + reservation.agent_id.contact} disabled />

                                                                                                            <div className="flex items-center">
                                                                                                                  <input
                                                                                                                        type="text"
                                                                                                                        className="block border border-black w-[70%] p-3 rounded mb-4"
                                                                                                                        name="event"
                                                                                                                        onChange={() => { (handleChangeReservation(reservation._id, 'event', event)) }}
                                                                                                                        defaultValue={reservation.event}
                                                                                                                        placeholder="event"
                                                                                                                        ref={event}
                                                                                                                        disabled />
                                                                                                                  <div className="flex items-center mt-[-1em]">
                                                                                                                        {reservation.confirmed === false &&
                                                                                                                              <>
                                                                                                                                    <svg
                                                                                                                                          xmlns="http://www.w3.org/2000/svg"
                                                                                                                                          onClick={() => {
                                                                                                                                                handleUpdate("event");
                                                                                                                                          }}
                                                                                                                                          className="h-5 w-5 cursor-pointer focus:text-green-500 hover:text-green-500 ml-8"
                                                                                                                                          viewBox="0 0 20 20"
                                                                                                                                          fill="currentColor"
                                                                                                                                    >
                                                                                                                                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                                                                                                    </svg>

                                                                                                                                    <svg
                                                                                                                                          xmlns="http://www.w3.org/2000/svg"
                                                                                                                                          onClick={() => {
                                                                                                                                                handleSubmit(reservation._id);
                                                                                                                                          }}
                                                                                                                                          className="h-6 w-6 cursor-pointer hover:text-blue-500 ml-4"
                                                                                                                                          fill="none"
                                                                                                                                          viewBox="0 0 24 24"
                                                                                                                                          stroke="currentColor"
                                                                                                                                          strokeWidth={2}
                                                                                                                                    >
                                                                                                                                          <path
                                                                                                                                                strokeLinecap="round"
                                                                                                                                                strokeLinejoin="round"
                                                                                                                                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                                                                                                                          />
                                                                                                                                    </svg>
                                                                                                                              </>}

                                                                                                                  </div>

                                                                                                            </div>

                                                                                                            <div className="flex items-center">
                                                                                                                  <input
                                                                                                                        type="date"
                                                                                                                        className="block border border-black w-[70%] p-3 rounded mb-4"
                                                                                                                        name="date"
                                                                                                                        onChange={() => { (handleChangeReservation(reservation._id, 'date', date)) }}
                                                                                                                        defaultValue={reservation.date}
                                                                                                                        ref={date}
                                                                                                                        disabled
                                                                                                                  />

                                                                                                                  <div className="flex items-center mt-[-1em]">
                                                                                                                        {reservation.confirmed === false && <>
                                                                                                                              <svg
                                                                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                                                                    onClick={() => {
                                                                                                                                          handleUpdate("date");
                                                                                                                                    }}
                                                                                                                                    className="h-5 w-5 cursor-pointer focus:text-green-500 hover:text-green-500 ml-8"
                                                                                                                                    viewBox="0 0 20 20"
                                                                                                                                    fill="currentColor"
                                                                                                                              >
                                                                                                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                                                                                              </svg>

                                                                                                                              <svg
                                                                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                                                                    onClick={() => {
                                                                                                                                          handleSubmit(reservation._id);
                                                                                                                                    }}
                                                                                                                                    className="h-6 w-6 cursor-pointer hover:text-blue-500 ml-4"
                                                                                                                                    fill="none"
                                                                                                                                    viewBox="0 0 24 24"
                                                                                                                                    stroke="currentColor"
                                                                                                                                    strokeWidth={2}
                                                                                                                              >
                                                                                                                                    <path
                                                                                                                                          strokeLinecap="round"
                                                                                                                                          strokeLinejoin="round"
                                                                                                                                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                                                                                                                    />
                                                                                                                              </svg>

                                                                                                                        </>}

                                                                                                                  </div>


                                                                                                            </div>
                                                                                                            <div className="flex items-center">
                                                                                                                  <input
                                                                                                                        type="Number"
                                                                                                                        className="block border border-black w-[70%] p-3 rounded mb-4 placeholder-black"
                                                                                                                        name="bargain_price"
                                                                                                                        onChange={() => { (handleChangeReservation(reservation._id, 'bargain_price', bargain_price)) }}
                                                                                                                        // defaultValue={reservation.bargain_price.toLocaleString('en-US')}
                                                                                                                        ref={bargain_price}
                                                                                                                        placeholder={'Bargain: ' + reservation.bargain_price.toLocaleString('en-US') + ' XAF'}
                                                                                                                        disabled
                                                                                                                  />

                                                                                                                  <div className="flex items-center mt-[-1em]">
                                                                                                                        {reservation.confirmed === false && <>
                                                                                                                              <svg
                                                                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                                                                    onClick={() => {
                                                                                                                                          handleUpdate("bargain_price");
                                                                                                                                    }}
                                                                                                                                    className="h-5 w-5 cursor-pointer focus:text-green-500 hover:text-green-500 ml-8"
                                                                                                                                    viewBox="0 0 20 20"
                                                                                                                                    fill="currentColor"
                                                                                                                              >
                                                                                                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                                                                                              </svg>

                                                                                                                              <svg
                                                                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                                                                    onClick={() => {
                                                                                                                                          handleSubmit(reservation._id);
                                                                                                                                    }}
                                                                                                                                    className="h-6 w-6 cursor-pointer hover:text-blue-500 ml-4"
                                                                                                                                    fill="none"
                                                                                                                                    viewBox="0 0 24 24"
                                                                                                                                    stroke="currentColor"
                                                                                                                                    strokeWidth={2}
                                                                                                                              >
                                                                                                                                    <path
                                                                                                                                          strokeLinecap="round"
                                                                                                                                          strokeLinejoin="round"
                                                                                                                                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                                                                                                                    />
                                                                                                                              </svg>
                                                                                                                        </>}


                                                                                                                  </div>


                                                                                                            </div>

                                                                                                      </section>
                                                                                                </form>

                                                                                          </div>
                                                                                          <div className="w-full">
                                                                                                {
                                                                                                      reservation.confirmed === false && <button onClick={() => { deleteReservation(reservation._id) }} className="rounded w-[40%] text-red-500 hover:border-red-500 hover:bg-red-500 p-2 hover:text-white border-2 border-gray-400">Cancel Reservation</button>
                                                                                                }
                                                                                          </div>
                                                                                    </div>
                                                                              }

                                                                        </div>
                                                                  </div>
                                                            )
                                                      })
                                                }
                                          </div>
                                    )
                              }
                        </section>
                  </section>


            </div>
      )
}

export default OrganizerProfile;