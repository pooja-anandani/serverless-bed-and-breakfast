import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Cover from "../home/Cover";
import Header from "../home/Header";
import { getAvailableRooms } from "./Rooms";

import img_1 from '../images/img_1.jpg'
import img_2 from '../images/img_2.jpg'
import img_3 from '../images/img_3.jpg'

export default function AvailableRooms(props) {

    return (<>
        <Header />
        <Cover stitle='Stay In One Of Our Wonderful Rooms!' btitle="Let's Find You A Perfect Room!" />
        <RoomsTypes />
    </>)

}


function RoomsTypes(props) {

    // let { checkin, checkout } = useParams();

    const [searchParams] = useSearchParams();

    const checkin = searchParams.get('checkin');
    const checkout = searchParams.get('checkout');

    const [rooms, setRooms] = useState({});

    useEffect(() => {
        getAvailableRooms(checkin, checkout).then((res) => {
            setRooms(res);
        });
    }, []);

    if (Object.keys(rooms).length === 0) {
        return (
            <div className="loader"></div>
        );
    }


    return (<>
        <section className="section">
            <div className="container">
                <div className="row justify-content-center text-center mb-5">
                    <div className="col-md-7">
                        <h2 className="heading" >Rooms &amp; Suites</h2>
                        <p  >Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.</p>
                    </div>
                </div>
                <div className="row">

                    <DeluxeRoom rooms={rooms['deluxe']} />
                    <Suite rooms={rooms['suite']} />
                    <FamilyRoom rooms={rooms['family_room']} />

                </div>
            </div>
        </section>
    </>)

    function DeluxeRoom(props) {
        const rooms = props.rooms;      

        const getHtml = () => {
            if (rooms && rooms.length < 1) {

                return (
                    <div className="col-md-6 col-lg-4" >
                        <figure className="img-wrap">
                            <img src={img_1} alt="img-1" className="img-fluid mb-3" />
                        </figure>
                        <div className="p-3 text-center room-info">
                            <h2>Deluxe Room</h2>
                            <span className="text-uppercase letter-spacing-1">90$ / per night</span>
                            <hr></hr>
                            <span className="text-uppercase letter-spacing-1">No Rooms Available</span>
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className="col-md-6 col-lg-4" >
                        <Link to="/book-rooms/deluxe">
                            <figure className="img-wrap">
                                <img src={img_1} alt="img-1" className="img-fluid mb-3" />
                            </figure>
                            <div className="p-3 text-center room-info">
                                <h2>Deluxe Room</h2>
                                <span className="text-uppercase letter-spacing-1">90$ / per night</span>
                                <hr></hr>
                                <span className="text-uppercase letter-spacing-1">{rooms.length} Rooms Available</span>
                            </div>
                        </Link>
                    </div>);
            }
        }

        return (getHtml());
    }

    function Suite(props) {
        const rooms = props.rooms;

        const getHtml = () => {
            if (rooms && rooms.length < 1) {

                return (
                    <div className="col-md-6 col-lg-4" >
                        <figure className="img-wrap">
                            <img src={img_3} alt="img-3" className="img-fluid mb-3" />
                        </figure>
                        <div className="p-3 text-center room-info">
                            <h2>Suite Room</h2>
                            <span className="text-uppercase letter-spacing-1">250$ / per night</span>
                            <hr></hr>
                            <span className="text-uppercase letter-spacing-1">No Rooms Available</span>
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className="col-md-6 col-lg-4" >
                        <Link to="/book-rooms/suite">
                            <figure className="img-wrap">
                                <img src={img_3} alt="img-3" className="img-fluid mb-3" />
                            </figure>
                            <div className="p-3 text-center room-info">
                                <h2>Suite Room</h2>
                                <span className="text-uppercase letter-spacing-1">250$ / per night</span>
                                <hr></hr>
                                <span className="text-uppercase letter-spacing-1">{rooms.length} Rooms Available</span>
                            </div>
                        </Link>
                    </div>);
            }
        }


        return (getHtml());
    }

    function FamilyRoom(props) {
        const rooms = props.rooms;

        const getHtml = () => {
            if (rooms && rooms.length < 1) {

                return (
                    <div className="col-md-6 col-lg-4" >                        
                            <figure className="img-wrap">
                                <img src={img_2} alt="img-2" className="img-fluid mb-3" />
                            </figure>
                            <div className="p-3 text-center room-info">
                                <h2>Family Room</h2>
                                <span className="text-uppercase letter-spacing-1">120$ / per night</span>
                                <hr></hr>
                                <span className="text-uppercase letter-spacing-1">No Rooms Available</span>
                            </div>
                    </div>
                );
            } else {
                return (
                    <div className="col-md-6 col-lg-4" >
                        <Link to="/book-rooms/family">
                            <figure className="img-wrap">
                                <img src={img_2} alt="img-2" className="img-fluid mb-3" />
                            </figure>
                            <div className="p-3 text-center room-info">
                                <h2>Family Room</h2>
                                <span className="text-uppercase letter-spacing-1">120$ / per night</span>
                                <hr></hr>
                                <span className="text-uppercase letter-spacing-1">{rooms.length} Rooms Available</span>
                            </div>
                        </Link>
                    </div>);
            }
        }

        return (getHtml());
    }
}