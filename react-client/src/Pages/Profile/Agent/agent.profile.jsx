/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Loader from '../../../Component/Loader/loader'

function AgentProfile() {

  // get and display user profile informations
  const [agent, setAgent] = useState({
    name: "",
    contact: "",
    picture: "",
    password: "",
    _id: "",
    halls: [],
    createdAt: "",
    updateAt: "",
  });

  const [loader, setLoader] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoader(false)
    }, 1000)
  }, [])

  // const [agentHall, setAgentHall] = useState([]);

  const location = useRef("");
  const name = useRef("");
  const price = useRef("");
  const picture = useRef("");


  const [reservations, setReservations] = useState([]);
  const [valR, setValR] = useState([]);
  const [checked, setChecked] = useState();

  const navigateTo = useNavigate();

  const getAgent = () => {
    axios({
      method: "GET",
      url: "http://localhost:8002/api/agent/profile",
      headers: {
        access_token: localStorage.getItem("access-token"),
      },
    })
      .then((res) => {
        const data = res.data.data;
        console.log(data);
        setAgent(agent => data);
        console.log({ profile: agent }, { list: agent.halls });
      })
      .catch((err) => {
        console.error(err);
        navigateTo("/agent/signin");
        alert("Sorry sign into your account and try again");
      });
    //
  };

  const getPendingReservation = async () => {
    await axios({
      method: "GET",
      url: "http://localhost:8002/api/agent/pending-reservations",
      headers: {
        "Content-Type": "application/json",
        access_token: localStorage.getItem("access-token"),
      },
    })
      .then((res) => {
        const response = res.data.data;
        setReservations(reservations => response);
        console.log("pending reservation list: ", response);
      })
      .catch((error) => {
        console.log({ errorFromReservations: error });
      });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getConfirmedReservation = async () => {
    await axios({
      method: "GET",
      url: "http://localhost:8002/api/agent/validated-reservations",
      headers: {
        "Content-Type": "application/json",
        access_token: localStorage.getItem("access-token"),
      },
    })
      .then((res) => {
        const response = res.data.data;
        setValR(valR => response);
        console.log(
          "validated reservation list: ",
          { response: response },
          { valR: valR }
        );
      })
      .catch((error) => {
        console.log({ errorFromValR: error });
      });
  };

  // getAgent()

  useEffect(() => {
    getAgent();
    getPendingReservation();
    getConfirmedReservation();
    //
  }, [getAgent, getConfirmedReservation, getConfirmedReservation]);



  const cancelAppointment = async (id) => {
    console.log(id)
    // go to reservation and cancel it
    await axios({
      method: "DELETE",
      url: `http://localhost:8002/api/agent/cancel-reservation/${id}`,
      headers: {
        "Content-Type": "application/json",
        access_token: localStorage.getItem("access-token"),
      },
    })
      .then((res) => {
        console.log(res.data);
        alert("deleted successfully!");
        window.location.reload();
        // setProfile(profile);
      })
      .catch((error) => {
        console.log(error);
        alert("failed to cancel reservation");
      });
  };

  const approveAppointment = async (hall_id, reservation_id) => {
    console.log(hall_id, reservation_id);
    axios({
      method: "PATCH",
      url: `http://localhost:8002/api/agent/validate-reservation/${hall_id}`,
      headers: {
        "Content-Type": "application/json",
        access_token: localStorage.getItem("access-token"),
      },
      data: {
        reservation_id: reservation_id,
      },
    })
      .then((res) => {
        console.log(res.data);
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deleteHall = async (hall_id) => {

    let confirmed = prompt("Enter 'OK' and Press 'OK' to delete this hall");
            console.log(confirmed)
            if (confirmed.toLowerCase() === 'ok') {
                  axios({
                        method: "DELETE",
                        url: `http://localhost:8002/api/hall/delete-hall/${hall_id}`,
                        headers: {
                              "Content-Type": "application/json",
                              "access_token": localStorage.getItem("access-token")
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

  const pendingList =
    reservations.length === 0 ? (
      <div className="mt-4 text-red-500 underline">No Pending Reservations</div>
    ) : (
      reservations.map((reservation, i) => {
        return (
          <div className="accordion-container my-8" key={reservation._id}>
            <div onClick={() => { toggleAccordion(i) }} className="cursor-pointer accordion-header  hover:bg-green-500 hover:text-white bg-white p-4 rounded flex justify-between">
              <header className="flex"><span>{reservation.hall_id.name}</span><span className="font-light ml-6">{reservation.date}</span></header>
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
            <div className="accordion-content bg-white">
              <hr className="leading-3 border-[1px] border-gray-300 " />
              {
                checked === i && <div className="p-4 flex justify-between">
                  <div className="w-2/6 ">
                    <img className="cursor-pointer rounded shadow-lg" src={reservation.hall_id.picture} alt="" style={{
                      width: "100%",
                      height: "100%"
                    }} />
                  </div>

                  <div className="reservation-infos w-[60%] rounded shadow-2xl px-4">
                    <div className="flex items-center my-2 border-2 w-[70%] border-green-400 rounded p-2">
                      <label className="font-bold">Reservation Price:</label>
                      <input
                        type="text"
                        className=" text-green-500 ml-6 bg-white font-bold placeholder-black"
                        name="hall_name"
                        value={reservation.hall_id.price.toLocaleString("en-US") + " XAF"} disabled />
                    </div>
                    <div className="flex items-center my-2 border-2 w-[64%] border-green-400 rounded p-2">
                      <label className="font-bold">Bargain Price:</label>
                      <input
                        type="text"
                        className=" text-red-500 ml-6 bg-white font-bold placeholder-black"
                        name="hall_name"
                        value={reservation.bargain_price.toLocaleString("en-US") + " XAF"} disabled />
                    </div>
                    <div className="flex items-center my-2 border-2 w-[60%] border-green-400 rounded p-2">
                      <label className="font-bold">Event:</label>
                      <input
                        type="text"
                        className=" ml-6 bg-white"
                        name="hall_name"
                        value={reservation.event} disabled />
                    </div>
                    <div className="flex items-center my-2 border-2 w-[53%] border-green-400 rounded p-2">
                      <label className="font-bold">Date:</label>
                      <input
                        type="text"
                        className=" ml-6 bg-white"
                        name="hall_name"
                        value={reservation.date} disabled />
                    </div>
                    <div className="mt-4">
                      <button onClick={()=>{approveAppointment(reservation.hall_id._id, reservation._id)}} className="p-2  font-bold border-2 border-green-400 hover:bg-white  text-white hover:text-green-500 bg-green-500 rounded w-1/5">Deal</button>
                      <button onClick={()=>{cancelAppointment(reservation._id)}} className="p-2  font-bold border-2 border-red-400 hover:bg-white hover:text-red-500  text-white bg-red-500 rounded w-1/5 ml-8">Cancel</button>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        )
      })
    );

  const confirmedList =
    valR.length === 0 ? (
      <div className="mt-4 text-red-500 underline">No Confirmed Reservations</div>
    ) : (
      valR.map((v_reservation, i) => {
        console.log('val', v_reservation);
        return (
          <div>
            <div className="accordion-container my-8" key={v_reservation._id}>
            <div onClick={() => { toggleAccordion(i) }} className="cursor-pointer accordion-header  hover:bg-green-500 hover:text-white bg-white p-4 rounded flex justify-between">
              <header className="flex"><span>{v_reservation.hall_id.name}</span><span className="font-light ml-6">{v_reservation.date}</span></header>
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
            <div className="accordion-content bg-white">
              <hr className="leading-3 border-[1px] border-gray-300 " />
              {
                checked === i && <div className="p-4 flex justify-between">
                  <div className="w-2/6 ">
                    <img className="cursor-pointer rounded shadow-lg" src={v_reservation.hall_id.picture} alt="" style={{
                      width: "100%",
                      height: "100%"
                    }} />
                  </div>

                  <div className="reservation-infos w-[60%] rounded shadow-2xl px-4">
                    <div className="flex items-center my-2 border-2 w-[70%] border-green-400 rounded p-2">
                      <label className="font-bold">Reservation Price:</label>
                      <input
                        type="text"
                        className=" text-green-500 ml-6 bg-white font-bold placeholder-black"
                        name="hall_name"
                        value={v_reservation.hall_id.price.toLocaleString("en-US") + " XAF"} disabled />
                    </div>
                    <div className="flex items-center my-2 border-2 w-[64%] border-green-400 rounded p-2">
                      <label className="font-bold">Bargain Price:</label>
                      <input
                        type="text"
                        className=" text-red-500 ml-6 bg-white font-bold placeholder-black"
                        name="hall_name"
                        value={v_reservation.bargain_price.toLocaleString("en-US") + " XAF"} disabled />
                    </div>
                    <div className="flex items-center my-2 border-2 w-[60%] border-green-400 rounded p-2">
                      <label className="font-bold">Event:</label>
                      <input
                        type="text"
                        className=" ml-6 bg-white"
                        name="hall_name"
                        value={v_reservation.event} disabled />
                    </div>
                    <div className="flex items-center my-2 border-2 w-[53%] border-green-400 rounded p-2">
                      <label className="font-bold">Date:</label>
                      <input
                        type="text"
                        className=" ml-6 bg-white"
                        name="hall_name"
                        value={v_reservation.date} disabled />
                    </div>
                    
                  </div>
                </div>
              }
            </div>
          </div>
          </div>
        )
      })
    );

  const handleChange = (e) => {
    setAgent({ ...agent, [e.target.name]: e.target.value });
    console.log(agent, e.target.name, e.target.value);
  };


  const handleChange2 = (id, target, ref) => {
    const newHall = agent.halls.map(hall => {
      if (hall._id === id) {
        console.log({ hallid: hall._id })
        return { ...hall, [target]: ref.current.value }
      }
      return hall
    })
    setAgent({ ...agent, halls: [...newHall] })
    // console.log({id: id, halls:  agent.halls})
  }

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handlePicture = async (e) => {
    e.preventDefault();
    let file = e.target.files[0];
    let base64 = await convertToBase64(file);
    // setAgent({...agent, [e.target.name]: e.target.files[0]});
    setAgent((agent) => ({
      ...agent,
      picture: base64,
    }));
    // console.log({ picture: agent.picture });
  };

  const handlePicture2 = async (e, id, target, ref) => {
    e.preventDefault();
    let file = e.target.files[0];
    let base64 = await convertToBase64(file);
    function update() {
      const newHall = agent.halls.map(hall => {
        if (hall._id === id) {
          return { ...hall, picture: base64 }
        }
        return hall;
      })
      setAgent({ ...agent, halls: [...newHall] })
      console.log({ hallID: id, target: e.target.name }, agent.halls[0].picture);
    }

    update()
  };

  const handleUpdate = (id) => {
    // const target = document.getElementById(id);
    const target = document.querySelector(`[name=${id}]`);
    console.log(id, { target: target });
    target.removeAttribute("disabled");
  };

  const handleUpdate2 = (id) => {
    const target = document.getElementById(id);
    target.removeAttribute("disabled");
    console.log(id);
  };

  const handleRefresh = () => {
    // update the agent ressource in the database and output result
    axios({
      method: "PATCH",
      url: "http://localhost:8002/api/agent/update-profile",
      data: {
        name: agent.name,
        contact: agent.contact,
        nationalID: agent.nationalID,
        password: agent.password,
        picture: agent.picture,
      },
      headers: {
        "Content-Type": "application/json",
        access_token: localStorage.getItem("access-token"),
      },
    })
      .then((response) => {
        console.log(response.data);
        setAgent({ ...agent, response });
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
        alert(error.message);
      });
  };

  let hall;
  const handleRefresh2 = (hall_id) => {
    console.log(hall_id)
    // update the agent ressource in the database and output result
    hall = agent.halls.filter(item => {
      console.log(item)
      return item._id === hall_id;
    })
    console.log('hall', hall[0])
    axios({
      method: "PATCH",
      url: `http://localhost:8002/api/hall/update-hall/${hall_id}`,
      data: {
        ...hall[0]
      },
      headers: {
        "Content-Type": "application/json",
        access_token: localStorage.getItem("access-token"),
      },
    })
      .then((response) => {
        console.log(response.data);
        // setAgent({...agent, halls: response})
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
        alert(error.message);
      });
  };


  const toggleAccordion = (toggle) => {
    if (checked === toggle) {
      return setChecked(checked => null)
    } else {
      return setChecked(checked => toggle);
    }
  }

  return loader ? <Loader/> :(
    <div className="">
      <section className=" px-8 mt-9 ml-8 agent-infos flex items-center justify-start rounded bg-green-500 p-4 w-1/3  shadow-lg">
        <div className="flex items-center">
          <img
            className="cursor-pointer rounded-full object-fill "
            src={agent.picture}
            style={{
              width: "150px",
              height: "150px",
            }}
            alt=""
          />

          <div className="cursor-pointer ml-4 flex flex-col items-center justify-start capitalize text-white">
            <span className="font-bold">{agent.name}</span>
            <span className="font-light ">{agent.contact}</span>
          </div>
        </div>
      </section>

      <div className="flex mb-8 ml-8 pl-10 mt-[1px] pt-4 pb-4 bg-green-500  w-1/3 rounded text-white shadow-lg">
        <input type="file" name="picture" onChange={handlePicture} />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          onClick={() => {
            handleRefresh();
          }}
          className="h-6 w-6 cursor-pointer hover:text-gray-200 ml-4"
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

      <hr className="leading-3 border-[1px] border-gray-300 py-1 mx-4" />

      <section className="inputs ml-4 my-5 py-4">
        <div className="flex items-center mx-9 my-4">
          <div className="flex items-center w-full">
            <label className="block font-bold mr-4 w-[10%] text-left">
              Name:
            </label>
            <input
              className="w-1/4 border-[1px] border-gray-500 p-1 text-bold font-semibold text-black bg-white"
              type="text"
              disabled
              id="name"
              onChange={handleChange}
              placeholder={agent.name}
              name="name"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => {
                handleUpdate("name");
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
        <div className="flex items-center mx-9">
          <div className="flex items-center w-full">
            <label className="block font-bold mr-4 w-[10%] text-left">
              Contact:
            </label>
            <input
              className="w-1/4 border-[1px] border-gray-500 p-1 text-bold font-semibold text-black bg-white"
              type="text"
              disabled
              id="contact"
              onChange={handleChange}
              placeholder={agent.contact}
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
        <header className="capitalize text-3xl flex justify-between text-green-500 font-bold ">
          halls managed
          <button className="bg-green-500 p-2 text-sm text-white rounded"><Link to="/hall/register"> Create Hall </Link></button>
        </header>
        <section className="accordion my-4">
          {/* { accordions }  */}
          {agent.halls.length === 0 ? (
            <div className="flex items-center">
              <p className="text-red-500 capitalize">no hall registered yet!</p>
              <button className="border-0 p-2 rounded text-green-500 hover:text-green-800 underline">
                <Link to="/hall/register">Register Hall</Link>
              </button>
            </div>
          ) : (
            <div>
              {agent.halls.map((hall, i) => {
                return (
                  <div className="accordion-container my-8" key={hall._id}>
                    <div onClick={() => { toggleAccordion(i) }} className="cursor-pointer accordion-header bg-white hover:text-white hover:bg-green-500 p-4 rounded flex justify-between">
                      <header>{hall.name}</header>
                      <button onClick={() => { deleteHall(hall._id) }} className=" shadow-2xl bg-white rounded border hover:border-white hover:font-normal font-light w-[10%] text-red-500 ">Delete Hall</button>
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
                    <div className="accordion-content bg-white">
                      <hr className="leading-3 border-[1px] border-gray-300 " />
                      {
                        checked === i && <div className="p-4">
                          <div className="w-1/2 ">
                            <img className="cursor-pointer rounded border-4 border-gray-400" src={hall.picture} alt="" style={{
                              width: "50%",
                              height: "50%"
                            }} />
                          </div>
                          <div className="flex my-8 text-sm " >
                            <input type="file" name="picture" onChange={(e) => { handlePicture2(e, hall._id) }}
                              ref={picture} />
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              onClick={() => {
                                handleRefresh2(hall._id);
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

                          <hr className="leading-3 border-[1px] border-gray-300 py-1 mx-4" />

                          <div className="hall-infos px-4">
                            <div className="flex items-center text-sm my-4">
                              <div className="flex items-center mx-4 w-full">
                                <label className="block font-bold0 w-[10%] text-left">
                                  Location:
                                </label>
                                <input
                                  className="w-1/5 border-[1px] border-gray-500 p-1 text-bold font-semibold placeholder-black text-black bg-white"
                                  type="text"
                                  disabled
                                  id="location"
                                  onChange={() => { handleChange2(hall._id, 'location', location) }}
                                  placeholder={hall.location}
                                  name="location"
                                  ref={location}
                                />
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  onClick={() => {
                                    handleUpdate2("location");
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
                                    handleRefresh2(hall._id);
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
                            <div className="flex items-center text-sm my-4">
                              <div className="flex items-center mx-4 w-full">
                                <label className="block font-bold0 w-[10%] text-left">
                                  Name:
                                </label>
                                <input
                                  className="w-1/5 border-[1px] border-gray-500 p-1 text-bold font-semibold placeholder-black text-black bg-white"
                                  type="text"
                                  disabled
                                  id="hall_name"
                                  onChange={() => { handleChange2(hall._id, 'name', name) }}
                                  placeholder={hall.name}
                                  name="name"
                                  ref={name}
                                />
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  onClick={() => {
                                    handleUpdate2("hall_name");
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
                                    handleRefresh2(hall._id);
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
                            <div className="flex items-center text-sm my-4">
                              <div className="flex items-center mx-4 w-full">
                                <label className="block font-bold0 w-[10%] text-left">
                                  Price:
                                </label>
                                <input
                                  className="w-1/5 border-[1px] border-gray-500 p-1 text-bold font-semibold text-black placeholder-black bg-white"
                                  type="number"
                                  disabled
                                  id="price"
                                  onChange={() => { handleChange2(hall._id, 'price', price) }}
                                  placeholder={hall.price.toLocaleString("en-US") + " XAF"}
                                  name="price"
                                  ref={price}
                                />
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  onClick={() => {
                                    handleUpdate2("price");
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
                                    handleRefresh2(hall._id);
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
                           
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </section>

      <hr className="leading-3 border-[1px] border-gray-300 py-1 mx-4" />

      <section className="reservation-section text-left my-8 mx-4 pl-8">
        <header className="capitalize text-3xl flex text-green-500 font-bold ">Pending Reservations: <span className="pl-1 text-black">{reservations.length}</span></header>
        {pendingList}
      </section>

      <hr className="leading-3 border-[1px] border-gray-300 py-1 mx-4" />

      <section className="reservation-section text-left my-8 mx-4 pl-8">
        <header className="capitalize text-3xl flex text-green-500 font-bold ">Confirmed Reservations: <span className="pl-1 text-black">{valR.length}</span></header>
        {confirmedList}
      </section>
    </div>
  );
}

export default AgentProfile;
