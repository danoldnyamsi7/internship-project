
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// other components
import Searchbar from '../../Component/Search/searchbar';
import Loader from '../../Component/Loader/loader';


function Halls() {

  const [halls, setHalls] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchResults, setSearchResults] = React.useState([]);
  const [loader, setLoader] = useState(true);


  console.log("component started")
  const navigateTo = useNavigate();

  useEffect(() => {

    console.log("useEffect running")

    setTimeout(()=>{
      setLoader(false)
    }, 1000)
    // const abortController = new AbortController();

    const fetchHalls = () => {
    
      axios({
        method: "GET",
        url: "http://localhost:8002/api/hall",
        headers: {
          "Content-Type": "application/json"
        },
      })
        .then(async res => {
          // console.log(res.data.data);
          const list = await res.data.data;
          console.log("updated:", halls)
          setHalls(hall => list);
          /*
[{pic}, {pic}, {pic}]
want to access picture
loop throught each object
*/
        })
        .catch(error => {
          console.error(error);
        })
    }

    fetchHalls()

    console.log("unmounted")
    // return ()=>{
    //   abortController.abort()
    //   console.log("home fetch aborted")
    // }
  }, [halls])


  const gotoDetails = (hall) => {
    console.log(hall);
    if (localStorage.getItem("oaccess-token")) {
      navigateTo('/book-hall', {
        state: hall
      });
    } else {
      alert("Please create an Organizer Account then come back, thanks");
      navigateTo('/organizer/signup');
    }
  }

  // const reservation = (hall)=>{
  //   navigateTo('/hall/reservation-form', {
  //     state: hall
  //   })
  // }

  const hallList = halls.map((hall, index) => {
    return (
      <div className="w-[28%] m-2 shadow-2xl my-8 mx-4 rounded" key={hall._id}>

        <div>
          <img src={hall.picture} style={{ width: "100%", height: "300px" }} alt="" />
        </div>
        <div className="infos py-8 px-6 bg-green-500 text-white">
          <div className="flex flex-col w-full ">
            <span className=" text-left"><b>Name:</b> {hall.name}</span>
            <span className=" text-left"><b>Location:</b> {hall.location}</span>
          </div>
          <div className="flex flex-col my-4 w-full ">
            <span className=" text-left"><b>Price:</b> {hall.price.toLocaleString('en-US')} FCFA</span>
            <span className=" text-left"><b>Capacity:</b> {hall.capacity} chairs</span>
          </div>
          <div>
            <button onClick={() => { gotoDetails(hall) }} className="w-full border-2 border-gray-200 font-bold mt-4 hover:cursor-pointer p-2 rounded hover:bg-gray-200 text-green-500 bg-white"> Reserve Hall</button>
          </div>
        </div>
      </div>)
  })

  const searchResultList = searchResults.length ? (
    searchResults.map(hall => {
      return (
        <div className="w-[30%] m-2 shadow-lg my-8 mx-4 rounded" key={hall._id}>

          <div>
            <img src={hall.picture} style={{ width: "100%", height: "300px" }} alt="" />
          </div>
          <div className="infos py-8 px-6 bg-green-500 text-white">
            <div className="flex flex-col w-full ">
              <span className=" text-left"><b>Name:</b> {hall.name}</span>
              <span className=" text-left"><b>Location:</b> {hall.location}</span>
            </div>
            <div className="flex flex-col my-4 w-full ">
              <span className=" text-left"><b>Price:</b> {hall.price.toLocaleString('en-US')} FCFA</span>
              <span className=" text-left"><b>Capacity:</b> {hall.capacity} chairs</span>
            </div>
            <div>
              <button onClick={() => { gotoDetails(hall) }} className="w-full border-2 border-gray-200 font-bold mt-4 hover:cursor-pointer p-2 rounded hover:bg-gray-200 text-green-500 bg-white"> Book Hall</button>
            </div>
          </div>
        </div>
      )
    })
  ) : (
    <div className="hover:cursor-pointer font-bold text-xl text-white p-4 rounded w-1/4 bg-red-500 m-auto mt-[7em]">No Search Term entered</div>
  )

  // const gethalls = () => {
    
  //   axios.get("http://localhost:8002/api/hall")
  //     .then(res => {
  //       let list = res.data.data;
  //       setHalls(list);
  //       console.log({ res: res.data, halls: halls });
  //     })
  // }

  const searchHandler = (searchTerm) => {
    setSearchTerm(searchTerm);
    // console.log(searchTerm);
    if (searchTerm !== '') {
      const newHallList = halls.filter(hall => {
        return Object.values(hall)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      })
      console.log({ filtered: newHallList })
      setSearchResults(newHallList);
    } else {
      setSearchResults(halls)
    }
  }

  return loader ? <Loader/> :  (
    <div className="flex-1 overflow-y-auto">
      <section className="z-0 w-full shadow-xl">
        <Searchbar halls={searchTerm.length < 1 ? halls : searchResults} term={searchTerm} searchKeyword={searchHandler} />
      </section>
      <section className="halls flex flex-wrap justify-start">
        {
          halls.length === 0 ? <div className="hover:cursor-pointer font-bold text-xl text-white p-4 rounded w-1/4 bg-green-500 m-auto mt-[7em]">No ressources found</div> : searchTerm < 1 ? hallList : searchResultList
        }
      </section>
    </div>
  )
}

export default Halls;