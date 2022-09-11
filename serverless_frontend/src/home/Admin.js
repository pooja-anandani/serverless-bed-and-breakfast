import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InvoiceSearch from "../kitchen/InvoiceSearch";
import Cover from "./Cover";
import Header from "./Header";


export default function Admin(props) {
    return (<>
        <Header />
        <Cover stitle='Admin Page' btitle='Find Admins features here.' />
        <AdminPage />
    </>)
}

function AdminPage(props) {

    return (<>
        <Bookings />
        <hr></hr>
        <InvoiceSearch />
        <hr></hr>
        <NavButtons />
        <hr></hr>
        <ReportAnalytics />
    </>)
}

function NavButtons(props) {

    return (<>
        <section className="section contact-section" id="next">
            <div className="container">
                <h2>Analytics</h2>
                <hr></hr>
                <div className="row">
                    <div className="col-md-12 form-group">
                        <Link to='/feedback/analysis'><button className="btn btn-primary btn-block text-white">View Feedback Analysis</button></Link>
                    </div>
                </div>
                <hr></hr>
                <div className="row">
                    <div className="col-md-12 form-group">
                        <Link to='/visual'><button className="btn btn-primary btn-block text-white">View Analytics</button></Link>
                    </div>
                </div>
                {/* <hr></hr>
                <div className="row">
                    <div className="col-md-12 form-group">
                        <Link to='/invoice/search'> <button className="btn btn-primary btn-block text-white">View Invoices</button></Link>
                    </div>
                </div> */}
            </div>
        </section>
    </>);
}

function Bookings(props) {

    const [bookings, setBookings] = useState([]);
    const [isCheckOut, setIsCheckOut] = useState(false);

    useEffect(() => {
        console.log('Refreshing component');
        if (isCheckOut === false) {
            return;
        }
        setIsCheckOut(false);
    }, [isCheckOut]);

    const checkout = (b) => {
        if (isCheckOut === false) {
            setIsCheckOut(true);
        }
        bookings.splice(b, 1);
    }

    useEffect(() => {

        axios.get('https://ej2faanuhu3bdkzuw5d4zzrtvq0tyogv.lambda-url.us-east-1.on.aws/').then((response) => {
            if (response.status === 200) {
                // console.log(response);
                const data = response.data;
                setBookings(data);
            } else {
                console.log('Something went wrong');
            }
        }).catch((err) => {
            console.log(err);
            console.log('Something went wrong');
        });
    }, []);

    const getBookingComps = () => {
        let bookingComps = []
        for (let b in bookings) {
            bookingComps.push(
                <SingleBooking key={b} index={b} booking={bookings[b]} checkout={checkout} />
            )
        }
        return bookingComps;
    }

    if (!checkout) {
        return;
    }

    if (bookings && bookings.length < 1) {
        return (<>
            <section className="section contact-section" id="next">
                <div className="container">
                    <h2>Booking Management</h2>
                    <hr></hr>
                    <div className="row">
                        <h4>No Bookings Available</h4>
                    </div>
                </div>
            </section>
        </>);
    }

    return (<>
        <section className="section contact-section" id="next">
            <div className="container">
                <h2>Booking Management</h2>
                <hr></hr>
                <div className="row">
                    {getBookingComps()}
                </div>
            </div>
        </section>
    </>)
}

function SingleBooking(props) {

    const checkout = props.checkout;
    const bookingId = props.booking.booking_id;
    const roomNumber = props.booking.room_number;
    const index = props.index;
    console.log(index);
    if (!bookingId && !roomNumber) {
        return;
    }

    const handleSubmit = async (e, bookingId, roomNumber) => {
        e.preventDefault();
        if (!bookingId && !roomNumber) {
            console.log('Something went wrong');
            return;
        }

        const requestBody = {
            booking_id: bookingId,
            room_number: roomNumber
        }
        axios.patch('https://ej2faanuhu3bdkzuw5d4zzrtvq0tyogv.lambda-url.us-east-1.on.aws/', requestBody).then((response) => {
            if (response.status === 200) {
                console.log('Checkout success');
                alert('Checkout Success');
                checkout(index);
            } else {
                console.log('Something went wrong');
            }
        }).catch((err) => {
            console.log(err);
            console.log('Something went wrong');
        });
        return;
    }

    return (<>
        <div className="col-md-7">
            <h2>Booking Details For Booking ID [{props.booking.booking_number}] </h2 >
            <hr></hr>
            <div className="row">
                <div className="col-md-12 form-group">
                    <h3>Room Number : {props.booking.room_number}</h3>
                </div>
                <div className="col-md-12 form-group">
                    <h3>Check In On : {props.booking.date_from}</h3>
                </div>
                <div className="col-md-12 form-group">
                    <h3>Check Out On : {props.booking.date_to}</h3>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12 form-group">
                    <button className="btn btn-primary btn-block text-white" onClick={(e) => handleSubmit(e, bookingId, roomNumber)} >Checkout</button>
                </div>
            </div>
            <hr></hr>
        </div>
    </>)
}


function ReportAnalytics(props) {
    return (
        <section className="py-5 bg-light">
            <div className="container">
                <h2>Reports Analytics</h2>
                <p>The below chart shows the Analytics of Origin. Records from Web Interface and Chatbot</p>
                <div className="row align-items-center" >
                    <iframe width="1000" height="500" src="https://datastudio.google.com/embed/reporting/630b7244-967c-4a11-bb3b-da5dc6edef8c/page/jbVyC" 
                        frameBorder="0"
                        allowFullScreen></iframe>
                </div>
            </div>
        </section>)
}