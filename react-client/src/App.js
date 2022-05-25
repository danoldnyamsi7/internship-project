import './App.css';
import Home from './Pages/Home/home';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AgentSignup from './Forms/Signup/agent.signup';
import AgentLogin from './Forms/Login/agent.signin';
import HallRegistration from './Forms/Signup/hall.signup';
import AgentProfile from './Pages/Profile/Agent/agent.profile';
import HallDetails from './Pages/Details/hall.details';
import OrganizerSignup from './Forms/Signup/organizer.signup';
import OrganizerSignin from './Forms/Login/organizer.signin';
import OrganizerProfile from './Pages/Profile/Organizer/organizer.profile';
import ReservationForm from './Forms/Booking-Form/booking.form';
import Navbar from './Component/Navbar/navbar';
import Footer from './Component/Footer/footer';
import Halls from './Pages/Halls/halls';
import Loader from './Component/Loader/loader';


function App() {

  const [loader, setLoader] = useState(true);

  useEffect(()=>{
    setTimeout(()=>{
      setLoader(false)
    }, 7000)
  }, [])

  const token = localStorage.getItem("access-token");
  const otoken = localStorage.getItem("oaccess-token");

  return loader ? <Loader/> : (
    <div className="App">
      <Router>
        <nav className="sticky top-0 left-0 w-full">
          <Navbar />
        </nav>
        <div className="h-screen">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/halls" element={<Halls />} />
            {!token && <Route path="/agent/signup" element={<AgentSignup />} />}
            {<Route path="/agent/signin" element={<AgentLogin />} />}
            {!otoken && <Route path="/organizer/signup" element={<OrganizerSignup />} />}
            <Route path="/organizer/signin" element={<OrganizerSignin />} />
            {token && <Route path="/hall/register" element={<HallRegistration />} />}
            {token && <Route path="/agent/profile" element={<AgentProfile />} />}
            {/* {otoken && <Route path="/organizer/profile" element={<OrganizerProfile />} />} */}
            {/* <Route path="/hall/details-page" element={<HallDetails />} /> */}
            {otoken && <Route path="/organizer/profile-page" element={<OrganizerProfile />} />}
            {otoken && <Route path="/book-hall" element={<ReservationForm />} />}

          </Routes>
        </div>
        {/* <footer className="">
          <Footer />
        </footer> */}
      </Router>

    </div>
  );
}

export default App;
