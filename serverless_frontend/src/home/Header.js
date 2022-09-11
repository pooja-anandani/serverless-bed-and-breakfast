import { Link } from "react-router-dom";
import { ReactSession } from 'react-client-session';



export default function Header(props) {
    ReactSession.setStoreType('localStorage');

    const email = ReactSession.get('email');
    const getButtons = () => {
        const isLoggedIn = ReactSession.get('isLoggedIn');
        // console.log(isLoggedIn);
        if (isLoggedIn && isLoggedIn == true) {

            if (email && email === 'admin@serverless-hotel.com') {
                return (<>
                    <div className="col-6 col-lg-4 site-logo">
                        <Link to="/admin"><button className="btn btn-primary btn-block text-white">Admin Dashboard </button></Link>
                    </div>
                    <div className="col-6 col-lg-4 site-logo">
                        <Link to="/logout"> <button className="btn btn-primary btn-block text-white">Logout</button></Link>
                    </div>
                </>);
            }

            return (<>
                <div className="col-6 col-lg-4 site-logo">
                    <Link to="/booking-info"><button className="btn btn-primary btn-block text-white">View Bookings </button></Link>
                </div>
                <div className="col-6 col-lg-4 site-logo">
                    <Link to="/logout"> <button className="btn btn-primary btn-block text-white">Logout</button></Link>
                </div>
            </>);
        } else {
            return (<>
                <div className="col-6 col-lg-4 site-logo">
                    <Link to="/login"><button className="btn btn-primary btn-block text-white">Login </button></Link>
                </div>
                <div className="col-6 col-lg-4 site-logo">
                    <Link to="/signup"> <button className="btn btn-primary btn-block text-white">Sign Up</button></Link>
                </div>
            </>);
        }

    }

    return (<>
        <header className="site-header">
            <div className="container-fluid">
                <div className="row align-items-center">
                    <div className="col-6 col-lg-4 site-logo"><a href="/">Serverless Hotel</a></div>
                    {getButtons()}
                </div>
            </div>
        </header>
    </>)
}