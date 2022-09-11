import '../css/bootstrap.css'
import '../css/style.css'


import food1 from '../images/food-1.jpg'
import img_1 from '../images/img_1.jpg'
import img_2 from '../images/img_2.jpg'
import img_3 from '../images/img_3.jpg'
import kbackgroud from '../images/kitchen-background.jpg'
import Header from './Header'
import CheckAvailability from './CheckAvailability'
import Cover from './Cover'
import { Link, useNavigate } from 'react-router-dom'
import Notification from './Notification'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Home(props) {

    return (
        <>
            <Header />
            <Cover stitle='Welcome To Serverless Hotel' btitle='A Best Place To Stay' />
            <CheckAvailability />
            <Welcome />
            <RoomsTypes />
            <HomeRestaurantMenu />
            <HomeTours />
        </>
    );
}




function Welcome(props) {
    return (<>
        <section className="py-5 bg-light">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-md-12 col-lg-7 ml-auto order-lg-2 position-relative mb-5" >
                        <figure className="img-absolute">
                            <img src={food1} alt="Image" className="img-fluid" />
                        </figure>
                        <img src={img_1} alt="Image" className="img-fluid rounded" />
                    </div>
                    <div className="col-md-12 col-lg-4 order-lg-1" >
                        <h2 className="heading">Welcome!</h2>
                        <p className="mb-4">Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.</p>
                    </div>
                </div>
            </div>
        </section>
    </>);

}

function RoomsTypes(props) {

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
                    <div className="col-md-6 col-lg-4" >
                        <Link to="/book-rooms/deluxe">
                            <figure className="img-wrap">
                                <img src={img_1} alt="img-1" className="img-fluid mb-3" />
                            </figure>
                            <div className="p-3 text-center room-info">
                                <h2>Single Room</h2>
                                <span className="text-uppercase letter-spacing-1">90$ / per night</span>
                            </div>
                        </Link>
                    </div>

                    <div className="col-md-6 col-lg-4" >
                        <Link to="/book-rooms/family">
                            <figure className="img-wrap">
                                <img src={img_2} alt="img-2" className="img-fluid mb-3" />
                            </figure>
                            <div className="p-3 text-center room-info">
                                <h2>Family Room</h2>
                                <span className="text-uppercase letter-spacing-1">120$ / per night</span>
                            </div>
                        </Link>
                    </div>

                    <div className="col-md-6 col-lg-4" >
                        <Link to="/book-rooms/suite">
                            <figure className="img-wrap">
                                <img src={img_3} alt="img-3" className="img-fluid mb-3" />
                            </figure>
                            <div className="p-3 text-center room-info">
                                <h2>Suite Room</h2>
                                <span className="text-uppercase letter-spacing-1">250$ / per night</span>
                            </div>
                        </Link>
                    </div>


                </div>
            </div>
        </section>
    </>)
}

function HomeRestaurantMenu(props) {

    return (<>
        <section className="section bg-image overlay" style={{ backgroundImage: `url(${kbackgroud})` }}>
            <div className="container">
                <div className="row justify-content-center text-center mb-5">
                    <div className="col-md-7">
                        <h2 className="heading text-white" >Our Restaurant Menu</h2>
                        <p className="text-white"  >Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.</p>
                    </div>
                </div>
                <div className="food-menu-tabs" >
                    <h2 className="heading text-white" >Mains</h2>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="food-menu mb-5">
                                <span className="d-block text-primary h4 mb-3">$20.00</span>
                                <h3 className="text-white"><a href="#" className="text-white">Murgh Tikka Masala</a></h3>
                                <p className="text-white text-opacity-7">Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.</p>
                            </div>
                            <div className="food-menu mb-5">
                                <span className="d-block text-primary h4 mb-3">$35.00</span>
                                <h3 className="text-white"><a href="#" className="text-white">Fish Moilee</a></h3>
                                <p className="text-white text-opacity-7">Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.</p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="food-menu mb-5">
                                <span className="d-block text-primary h4 mb-3">$10.00</span>
                                <h3 className="text-white"><a href="#" className="text-white">French Toast Combo</a></h3>
                                <p className="text-white text-opacity-7">Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.</p>
                            </div>
                            <div className="food-menu mb-5">
                                <span className="d-block text-primary h4 mb-3">$8.35</span>
                                <h3 className="text-white"><a href="#" className="text-white">Vegie Omelet</a></h3>
                                <p className="text-white text-opacity-7">Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.</p>
                            </div>

                        </div>
                    </div>


                    <h2 className="heading text-white" >Desserts</h2>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="food-menu mb-5">
                                <span className="d-block text-primary h4 mb-3">$11.00</span>
                                <h3 className="text-white"><a href="#" className="text-white">Banana Split</a></h3>
                                <p className="text-white text-opacity-7">Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.</p>
                            </div>
                            <div className="food-menu mb-5">
                                <span className="d-block text-primary h4 mb-3">$72.00</span>
                                <h3 className="text-white"><a href="#" className="text-white">Sticky Toffee Pudding</a></h3>
                                <p className="text-white text-opacity-7">Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.</p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="food-menu mb-5">
                                <span className="d-block text-primary h4 mb-3">$42.00</span>
                                <h3 className="text-white"><a href="#" className="text-white">Apple Strudel</a></h3>
                                <p className="text-white text-opacity-7">Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.</p>
                            </div>
                            <div className="food-menu mb-5">
                                <span className="d-block text-primary h4 mb-3">$7.35</span>
                                <h3 className="text-white"><a href="#" className="text-white">Pancakes</a></h3>
                                <p className="text-white text-opacity-7">Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>)
}

function HomeTours(props) {

    const [recommendation1, setRecomendation1] = useState({});
    const [recommendation2, setRecomendation2] = useState({});

    const [duration, setDuration] = useState(1);
    
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
                    setRecomendation1(data.recommendation1);
                    setRecomendation2(data.recommendation2);
                }
            } else {
                console.log('Something went wrong');
            }

        }).catch((err) => {
            console.log(err);
        })
    }, []);

    useEffect(() => {


    }, [recommendation1, recommendation2]);


    if (Object.keys(recommendation1).length === 0) {
        return (
            <div className="loader"></div>
        );
    }

    // const handleChange = (e) => {
    //     e.preventDefault();
    //     const { name, value } = e.target;
    //     setDuration(value);
    //     axios.get('https://us-central1-assignment-4-355219.cloudfunctions.net/tour_recommendation_api', {
    //         params: {
    //             duration: value
    //         }
    //     }).then((response) => {
    //         console.log(response);
    //         if (response.status === 200) {
    //             const data = response.data;
    //             console.log(data);
    //             if (data) {
    //                 setRecomendation1(data.recommendation1);
    //                 setRecomendation2(data.recommendation2);
    //             }
    //         } else {
    //             console.log('Something went wrong');
    //         }

    //     }).catch((err) => {
    //         console.log(err);
    //     });
    // }

    return (<>
        <section className="section blog-post-entry bg-light">
            <div className="container">
                <div className="row justify-content-center text-center mb-5">
                    <div className="col-md-7">
                        <h2 className="heading" >Tours</h2>
                        <p >Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.</p>
                    </div>
                </div>
                {/* <form className="bg-white p-md-5 p-4 mb-5 border">
                    <div className="row">
                        <div className="col-md-6 mb-3 mb-md-0">
                            <label className="font-weight-bold text-black">Number of Days</label>
                            <div className="field-icon-wrap">
                                <div className="icon"><span className="ion-ios-arrow-down"></span></div>
                                <select name="days" id="days" className="form-control"
                                    onChange={(e) => handleChange(e)}
                                >
                                    <option value={1}>1</option>
                                    <option value={2}>2</option>
                                    <option value={3}>3</option>
                                    <option value={4}>4+</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </form> */}
                <div className="row">
                    <SingleTour tour={recommendation1} />
                    <SingleTour tour={recommendation2} />
                </div>
            </div>
        </section>
    </>)
}


function SingleTour(props) {

    const [tour, setTour] = useState(props.tour)

    useEffect(() => {
        setTour(props.tour);
    });

    return (<>
        <div className="col-lg-4 col-md-6 col-sm-6 col-12 post"  >
            <div className="media media-custom d-block mb-4 h-100">
                <a href="#" className="mb-4 d-block"><img src={tour.image} alt="Image placeholder" className="img-fluid" /></a>
                <div className="media-body">
                    <span className="meta-post">Price {tour.price}</span>
                    <h2 className="mt-0 mb-3"><a href="#">{tour.name}</a></h2>
                    <p>{tour.description}</p>
                </div>
            </div>
        </div>
    </>);
}