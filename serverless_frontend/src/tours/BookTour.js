import { Link, useNavigate, useParams } from "react-router-dom";
import Cover from "../home/Cover";
import Header from "../home/Header";

import img_1 from '../images/img_1.jpg'
import img_2 from '../images/img_2.jpg'
import img_3 from '../images/img_3.jpg'
import { useEffect, useState } from "react";
import axios from "axios";

import { ReactSession } from 'react-client-session';

export default function BookTour(props) {

    ReactSession.setStoreType('localStorage');

    return (<>
        <Header />
        <Cover stitle='Visit the Beautiful Places around our town!' btitle="Tour Service" />
        <TourForm />
    </>);

}

function TourForm(props) {

    const [tours, setTours] = useState({});
    
    let { duration } = useParams();
    
    let navigate = useNavigate();
    useEffect(() => {

        axios.get('https://us-central1-assignment-4-355219.cloudfunctions.net/tour_recommendation_api', {
            params: {
                duration: duration
            }
        }).then((response) => {
            console.log(response);
            if (response.status === 200) {
                const data = response.data;
                console.log(data);
                if (data) {
                    setTours(data);
                }
            } else {
                console.log('Something went wrong');
            }

        }).catch((err) => {
            console.log(err);
            // navigate('/');
        })
    }, []);


    if (Object.keys(tours).length === 0) {
        return (
            <div className="loader"></div>
        );
    }

    const getTours = () => {

        const toursList = tours;
        let finalToursComps = []

        if (toursList.recommendation1) {
            finalToursComps.push(<>
                <SingleTour key={1} tour={toursList.recommendation1} />
            </>)
        }

        if (toursList.recommendation2) {
            finalToursComps.push(<><SingleTour key={2} tour={toursList.recommendation2} /></>)
        }

        return finalToursComps;
    }

    console.log(tours);
    return (<>
        <section className="section blog-post-entry bg-light">
            <div className="container">
                <div className="row justify-content-center text-center mb-5">
                    <div className="col-md-7">
                        <h2 className="heading" >Tours</h2>
                        <p >Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.</p>
                    </div>
                </div>

                {getTours()}

            </div>
        </section>

    </>)
}

function SingleTour(props) {

    let navigate = useNavigate();
    const handleSubmit = (e,tour) => {
        e.preventDefault();

        ReactSession.set('tour_booking',tour);
        navigate("/tour/details")
    };

    const tour = props.tour;

    return (<>
        <div className="row">
            <div className="col-lg-4 col-md-6 col-sm-6 col-12 post"  >
                <div className="media media-custom d-block mb-4 h-100">
                    <a href="#" className="mb-4 d-block"><img src={tour.image} alt="Image placeholder" className="img-fluid" /></a>
                    <div className="media-body">
                        <span className="meta-post">Price {tour.price}</span>
                        <h2 className="mt-0 mb-3"><a href="#">{tour.name}</a></h2>
                        <p>{tour.description}</p>
                        <button className="btn btn-primary btn-block text-white" onClick={(e) => handleSubmit(e,tour)}>Book Tour</button>
                    </div>
                </div>
            </div>
        </div>
        <hr></hr>
    </>);
}