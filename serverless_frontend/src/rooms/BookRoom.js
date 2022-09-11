import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Cover from "../home/Cover";
import Header from "../home/Header";
import * as moment from 'moment'

import { ReactSession } from 'react-client-session';
import axios from "axios";

import img_1 from '../images/img_1.jpg'
import img_2 from '../images/img_2.jpg'
import img_3 from '../images/img_3.jpg'
import { getAvailableRooms } from "./Rooms";

export default function BookRoom(props) {

    return (<>
        <Header />
        <Cover stitle='Stay In One Of Our Wonderful Rooms!' btitle="Let's Book Your Room!" />
        <BookRoomForm />
    </>)
}

function BookRoomForm(props) {
    ReactSession.setStoreType('localStorage');

    let { room_type } = useParams();
    const [roomType, setRoomType] = useState(room_type);

    const [inputValues, setInputValue] = useState({
        checkin: moment(new Date()).format('YYYY-MM-DD'),
        checkout: moment(new Date()).format('YYYY-MM-DD'),
        adults: 1,
        children: 0
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputValue({ ...inputValues, [name]: value });
        console.log(inputValues);
    }

    let navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();

        const inputs = inputValues;
        console.log(inputs);
        const adults = parseInt(inputs.adults);
        if (adults < 1) {
            alert('Please select atleast 1 adult');
            return;
        }

        const checkIn = moment(inputValues.checkin).format('YYYY/MM/DD');
        const checkOut = moment(inputValues.checkout).format('YYYY/MM/DD');
        const email = ReactSession.get('email')

        let roomNumber = 101;
        let rooms = {}
        await getAvailableRooms(checkIn, checkOut).then((res) => {
            rooms = res;
        });

        console.log(rooms);
        switch (roomType) {
            case 'deluxe':
                roomNumber = rooms['deluxe'][0]
                break;
            case 'family':
                roomNumber = rooms['family_room'][0]
                break;
            case 'suite':
                roomNumber = rooms['suite'][0]
                break;
        }
        console.log(roomNumber);
        const requestBody = {
            room_number: parseInt(roomNumber),
            from_date: checkIn,
            to_date: checkOut,
            user_id: email,
            adults: adults,
            children: parseInt(inputs.children),
            booking_origin: 'web',
            is_checkout: false
        }

        console.log(requestBody);
        axios.post('https://cyu6sjpffpdxrxaltsrw5wdjfi0lbkjn.lambda-url.us-east-1.on.aws/', requestBody).then((response) => {

            console.log(response);
            if (response.status === 200) {
                if (response.data.status_code === 201) {
                    const bookingId = response.data.body.booking_number;
                    const roomType = response.data.body.room_type;
                    ReactSession.set('booking_id', bookingId);
                    ReactSession.set('room_type', roomType);
                    ReactSession.set('room_number', roomNumber);
                    alert('Booking Successful.')
                    navigate("/booking-info")
                    return;
                } else {
                    alert('Something went wrong! Please try again')
                    return;
                }
            } else {
                alert('Something went wrong! Please try again')
                return;
            }
        }).catch((err) => {
            console.log(err);
            alert('Something went wrong! Please try again')
            return;
        })
    };


    if (!roomType) {
        return (
            <div className="loader"></div>
        );
    }

    let img, title, price;
    if (roomType === 'deluxe') {
        img = img_1
        title = 'Single Room'
        price = '90$ / PER NIGHT'
    } else if (roomType === 'family') {
        img = img_2
        title = 'Family Room'
        price = '120$ / PER NIGHT'
    } else {
        img = img_3
        title = 'Presidental Room'
        price = '250$ / PER NIGHT'
    }

    const email = ReactSession.get('email');
    if (!email || email === '') {
        return (<>
            <section className="section contact-section" id="next">
                <div className="container">
                    <div className="row">
                        <div className="col-md-7">
                            <form className="bg-white p-md-5 p-4 mb-5 border">
                                <div className="row">
                                    <h3>Please Login to Book a Room !</h3>
                                </div>
                            </form>
                            <div className="col-md-6 form-group">
                                <Link to="/login"><button className="btn btn-primary btn-block text-white">Login</button></Link>
                            </div>                            
                        </div>
                        <SideNote
                            img={img}
                            title={title}
                            price={price}
                        />
                    </div>
                </div>
            </section>
        </>);
    }
    return (<>

        <section className="section contact-section" id="next">
            <div className="container">
                <div className="row">
                    <div className="col-md-7">

                        <form className="bg-white p-md-5 p-4 mb-5 border">
                            <div className="row">
                                <div className="col-md-12 form-group">
                                    <label className="text-black font-weight-bold" >Check-In Date</label>
                                    <input className="form-control" type="date" id="checkin" name="checkin"
                                        value={inputValues.checkin}
                                        onChange={(e) => handleChange(e)}
                                        min="2022-01-01" max="2022-12-31" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12 form-group">
                                    <label className="text-black font-weight-bold" >Check-Out Date</label>
                                    <input className="form-control" type="date" id="checkout" name="checkout"
                                        value={inputValues.checkout}
                                        onChange={(e) => handleChange(e)}
                                        min="2022-01-01" max="2022-12-31" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3 mb-md-0">
                                    <label className="font-weight-bold text-black">Adults</label>
                                    <div className="field-icon-wrap">
                                        <div className="icon"><span className="ion-ios-arrow-down"></span></div>
                                        <select name="adults" id="adults" className="form-control"
                                            onChange={(e) => handleChange(e)}
                                        >
                                            <option value={1}>1</option>
                                            <option value={2}>2</option>
                                            <option value={3}>3</option>
                                            <option value={4}>4+</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3 mb-md-0">
                                    <label className="font-weight-bold text-black">Children</label>
                                    <div className="field-icon-wrap">
                                        <div className="icon"><span className="ion-ios-arrow-down"></span></div>
                                        <select name="children" id="children" className="form-control"
                                            onChange={(e) => handleChange(e)}
                                        >
                                            <option value={0}>0</option>
                                            <option value={1}>1</option>
                                            <option value={2}>2</option>
                                            <option value={3}>3</option>
                                            <option value={4}>4+</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <div className="col-md-6 form-group">
                            <button className="btn btn-primary btn-block text-white" onClick={(e) => handleSubmit(e)}>Book Room</button>
                        </div>
                    </div>
                    <SideNote
                        img={img}
                        title={title}
                        price={price}
                    />
                </div>
            </div>
        </section>

    </>)

}

function SideNote(props) {

    return (<>
        <div className="col-md-5">
            <div className="row">
                <figure className="img-wrap">
                    <img src={props.img} alt="img-1" className="img-fluid mb-3" />
                </figure>
                <div className="p-3 text-center room-info">
                    <h2>{props.title}</h2>
                    <span className="text-uppercase letter-spacing-1">{props.price}</span>
                </div>
                <div className="col-md-10 ml-auto contact-info">
                    <p><span className="d-block">Want A Different Room?</span> <span className="text-black"> Check our other rooms!</span></p>
                    <Link to="/rooms"><button className="btn btn-primary btn-block text-white">Go Back </button></Link>
                </div>
            </div>
        </div>
    </>)
}










