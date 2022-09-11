import { Link, useNavigate } from "react-router-dom";
import Cover from "../home/Cover";
import Header from "../home/Header";
import { ReactSession } from 'react-client-session';
import { useEffect, useState } from "react";

export default function TourDetails(props) {


    return (<>
        <Header />
        <Cover stitle='Enjoy Your Tour.' btitle="Tour Details" />
        <TourDetailsForm />
    </>);

}

function TourDetailsForm(props) {
    ReactSession.setStoreType('localStorage');

    const [tourDetails,setTourDetails] = useState({});

    useEffect(() => {

        const tour = ReactSession.get('tour_booking');
        if(!tour){
            return;
        }
        setTourDetails(tour);
    },[]);    



    let navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/booking-info")
    };

    if(!tourDetails){
        return;
    }

    return (
        <>
            <section className="section contact-section" id="next">
                <div className="container">
                    <div className="row">
                        <div className="col-md-7">
                            <form className="bg-white p-md-5 p-4 mb-5 border">
                                <div className="row">
                                    <div className="col-md-12 form-group">
                                        <b><h2>Tour Details</h2></b>
                                    </div>
                                </div>
                                <hr></hr>
                                <div className="row">
                                    <div className="col-md-12 form-group">
                                        <h3>Destination : {tourDetails.name}</h3>
                                    </div>
                                </div>
                                <hr></hr>
                                <div className="row">
                                    <div className="col-md-12 form-group">
                                        <h3>Price : {tourDetails.price}</h3>
                                    </div>
                                </div>
                                <hr></hr>
                                <div className="row">
                                    <div className="col-md-12 form-group">
                                        <h3>Address : {tourDetails.address}</h3>
                                    </div>
                                </div>
                                <hr></hr>
                                <div className="row">
                                    <div className="col-md-12 form-group">
                                        <p>{tourDetails.description}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12 form-group">
                                    <a href="#" className="mb-4 d-block"><img src={tourDetails.image} alt="Image placeholder" className="img-fluid" /></a>
                                    </div>
                                </div>
                            </form>
                            <div className="col-md-6 form-group">
                                <button className="btn btn-primary btn-block text-white" onClick={(e) => handleSubmit(e)}>Go Back</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>)

}