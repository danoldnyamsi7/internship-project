import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ReservationForm from '../../Forms/Booking-Form/booking.form'

function HallDetails() {
      // const abortController = new AbortController()
      const [reservation, setReservation] = useState({})
      const [hall, setHall] = useState({
            name: "",
            contact: "",
            agent: "",
            agenda: "",
            capacity: "",
            picture: [{ url: "" }],
            location: "",
            price: 0.0,
            _id: ""
      });

      const params = useLocation().state;
      console.log(params)
      useEffect(() => {
            function updater() {
                  setHall({ ...hall, ...params });
            }
            updater()
            return () => {
                  // setHall({...hall, params});
                  // abortController.abort()
            }
      }, [hall.length])
      console.log({ NH: hall })
      const url = hall.picture[0].url;



      return (
            <div>
                  <div>
                        <ReservationForm hall_id={hall._id} />
                  </div>
            </div>
      )
}

export default HallDetails