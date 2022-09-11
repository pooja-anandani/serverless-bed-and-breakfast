import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cover from "../home/Cover";
import Header from "../home/Header";
import { ReactSession } from 'react-client-session';
import axios from "axios";
import moment from "moment";

export default function BookingInfo(props) {


    return (<>
        <Header />
        <Cover stitle='Manage Your Booking' btitle="Order Food or Book Tours Here!" />
        <BookingInfoForm />
    </>);

}

function BookingInfoForm(props) {
    ReactSession.setStoreType('localStorage');

    const [rooms, setRooms] = useState([]);

    useEffect(() => {

        const email = ReactSession.get('email');
        const requestBody = {
            user_id: email
        }
        axios.post('https://ej2faanuhu3bdkzuw5d4zzrtvq0tyogv.lambda-url.us-east-1.on.aws/', requestBody).then((response) => {
            if (response.status === 200) {
                console.log(response);
                if (response.data && response.data.length > 0) {
                    const roomList = response.data;
                    console.log(roomList);
                    let finalRoomList = []
                    for (let r in roomList) {
                        if (roomList[r] && !roomList[r].is_checkout) {
                            finalRoomList.push(roomList[r]);
                        }
                    }
                    setRooms(finalRoomList);
                }
            } else {
                console.log('somethiing went wrong!');
            }
        }
        ).catch((err) => {
            console.log(err);
        });

    }, []);


    const getBookings = () => {
        const roomList = rooms;
        let roomComps = []
        for (let r in roomList) {
            roomComps.push(
                <>
                    <React.Fragment key={roomList[r].booking_id}>
                        <BookingDetails room={roomList[r]} />
                        <hr></hr>
                    </React.Fragment>
                </>

            )
        }
        return roomComps;
    }

    const getDuration = () => {
        const roomList = rooms;
        if (roomList.length > 0) {
            const room = roomList[0];
            const from = room.date_from;
            const to = room.date_to;

            const startDate = moment(from);
            const timeEnd = moment(to);
            const diff = timeEnd.diff(startDate);
            const diffDuration = moment.duration(diff);
            let duration = diffDuration.days();
            if(!duration || duration < 1){
                duration = 1;
            }
            return duration;
        } else {
            return 1;
        }
    }

    if (rooms && rooms.length < 1) {
        return (
            <>
                <section className="section contact-section" id="next">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-7">
                                <h2>No Bookings Available.</h2>
                            </div>
                        </div>
                    </div>
                </section>
            </>);
    }

    // console.log(rooms);
    return (
        <>
            <section className="section contact-section" id="next">
                <div className="container">
                    <div className="row">
                        {getBookings()}
                        <SideNote />
                    </div>
                </div>
            </section>

            <hr></hr>

            <section className="section contact-section" id="next">
                <div className="container">
                    <div className="row">
                        <SideNoteTour duration={getDuration()} />
                    </div>
                </div>
            </section>
        </>);

    function BookingDetails(props) {
        const room = props.room;
        const roomNum = room.room_number;
        const toOrderFood = '/order-food/' + roomNum;
        const toOrderStatus = '/order-food/status/' + roomNum;
        return (<>
            <div className="col-md-7">
                <h2>Booking Details For Booking ID [{room.booking_number}] </h2 >
                <hr></hr>
                <div className="row">
                    <div className="col-md-12 form-group">
                        <h3>Room Number : {room.room_number}</h3>
                    </div>
                    <div className="col-md-12 form-group">
                        <h3>Check In On : {room.date_from}</h3>
                    </div>
                    <div className="col-md-12 form-group">
                        <h3>Check Out On : {room.date_to}</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 form-group">
                        <h3>Number of Adults : {room.adults}</h3>
                    </div>
                    <div className="col-md-12 form-group">
                        <h3>Number of Children : {room.children}</h3>
                    </div>
                    <div className="col-md-12 form-group">
                        <h3>Booked Through : {room.booking_origin === 'web' ? 'Web Interface' : 'Chatbot'}</h3>
                    </div>
                </div>
                <hr></hr>
                <div className="row">
                    <div className="col-md-12 form-group">
                        <h3>Order Food From Our Amazing Kitchen</h3>
                        <Link to={toOrderFood}><button className="btn btn-primary btn-block text-white">Order Food</button></Link>
                    </div>
                </div>
                <hr></hr>
                <div className="row">
                    <div className="col-md-12 form-group">
                        <h3> View the status of your Order</h3>
                        <Link to={toOrderStatus}><button className="btn btn-primary btn-block text-white">View Order Status</button></Link>
                    </div>
                </div>
                <hr></hr>
                <hr></hr>
                <br></br><br></br>
            </div>
        </>)
    }

}



function SideNoteOrderFood(props) {
    return (<>
        <div className="col-md-5" data-aos="fade-up" data-aos-delay="200">
            <div className="row">
                <div className="col-md-10 ml-auto contact-info">
                    <p><span className="d-block">Hungry ?</span> <span className="text-black"> Order Food From Our Amazing Kitchen</span></p>
                    <Link to="/order-food"><button className="btn btn-primary btn-block text-white">Order Food</button></Link>
                </div>
            </div>
        </div>
    </>)
}

function SideNoteTour(props) {
    const duration = props.duration;
    const toBookTour = '/book-tour/' + duration;
    return (<>
        <div className="col-md-5" data-aos="fade-up" data-aos-delay="200">
            <div className="row">
                <div className="col-md-10 ml-auto contact-info">
                    <p><span className="d-block">Want to look around?</span> <span className="text-black"> Check our personalized tours!</span></p>
                    <Link to={toBookTour}><button className="btn btn-primary btn-block text-white">Book Tours</button></Link>
                </div>
            </div>
        </div>
        <div className="col-md-5">
            <div className="row">
                <div className="col-md-10 ml-auto contact-info">
                    <p><span className="d-block">Booked Tour?</span> <span className="text-black"> View the details of your Tour</span></p>
                    <Link to="/tour/details"><button className="btn btn-primary btn-block text-white">View Tour Details</button></Link>
                </div>
            </div>
        </div>
    </>)
}


function SideNote(props) {
    return (<>
        <div className="col-md-5">
            <div className="row">
                <div className="col-md-10 ml-auto contact-info">
                    <p><span className="d-block">Tell Us How We Did!</span> <span className="text-black"> Give Us A Feedback, So that we'll do better!</span></p>
                    <Link to="/feedback"><button className="btn btn-primary btn-block text-white">Give Feedback</button></Link>
                </div>
            </div>
        </div>
    </>)
}
