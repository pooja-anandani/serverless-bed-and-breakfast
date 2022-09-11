import DatePicker from "react-datepicker"
import { useEffect, useState } from 'react'
import moment from "moment"
import { createSearchParams, Link, useNavigate } from "react-router-dom";
import { getAvailableRooms } from "../rooms/Rooms";

export default function CheckAvailability(props) {

    const [inputValues, setInputValue] = useState({
        checkin: moment(new Date()).format('YYYY-MM-DD'),
        checkout: moment(new Date()).format('YYYY-MM-DD'),
        adults: 0,
        children: 0
    });

    function handleChange(event) {
        const { name, value } = event.target;
        setInputValue({ ...inputValues, [name]: value });
    }

    let navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        const checkIn = moment(inputValues.checkin).format('YYYY/MM/DD');
        const checkOut = moment(inputValues.checkout).format('YYYY/MM/DD');

        navigate({
            pathname: "rooms",
            search: createSearchParams({
                checkin: checkIn,
                checkout: checkOut
            }).toString()
        });
    };


    return (
        <>
            <section className="section bg-light pb-0"  >
                <div className="container">
                    <div className="row check-availabilty" id="next">
                        <div className="block-32"  >
                            <form >
                                <div className="row">
                                    <div >
                                        <label htmlFor="checkin_date" className="font-weight-bold text-black">Check In</label>
                                        <div className="field-icon-wrap">
                                            <input className="form-control" type="date" id="checkin" name="checkin"
                                                value={inputValues.checkin}
                                                onChange={(e) => handleChange(e)}
                                                min="2022-01-01" max="2022-12-31" />
                                        </div>
                                    </div>

                                    <div className="col-md-6 mb-3 mb-lg-0 col-lg-3">
                                        <label htmlFor="checkout_date" className="font-weight-bold text-black">Check Out</label>
                                        <div className="field-icon-wrap">
                                            <input className="form-control" type="date" id="checkout" name="checkout"
                                                value={inputValues.checkout}
                                                onChange={(e) => handleChange(e)}
                                                min="2022-01-01" max="2022-12-31" />
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-3 mb-md-0 col-lg-3">
                                        <div className="row">
                                            <div className="col-md-6 mb-3 mb-md-0">
                                                <label htmlFor="adults" className="font-weight-bold text-black">Adults</label>
                                                <div className="field-icon-wrap">
                                                    <div className="icon"><span className="ion-ios-arrow-down"></span></div>
                                                    <select name="adults" id="adults" className="form-control"
                                                        onChange={(e) => handleChange(e)}
                                                    >
                                                        <option value="">1</option>
                                                        <option value="">2</option>
                                                        <option value="">3</option>
                                                        <option value="">4+</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-6 mb-3 mb-md-0">
                                                <label htmlFor="children" className="font-weight-bold text-black">Children</label>
                                                <div className="field-icon-wrap">
                                                    <div className="icon"><span className="ion-ios-arrow-down"></span></div>
                                                    <select name="children" id="children" className="form-control"
                                                        onChange={(e) => handleChange(e)} >
                                                        <option value="">0</option>
                                                        <option value="">1</option>
                                                        <option value="">2</option>
                                                        <option value="">3</option>
                                                        <option value="">4+</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-lg-3 align-self-end">
                                        <button className="btn btn-primary btn-block text-white" onClick={(e) => handleSubmit(e)}>Check Availabilty</button>
                                    </div>
                                </div>
                            </form>
                        </div>


                    </div>
                    <hr></hr>
                    <div className="col-md-6 col-lg-3 align-self-end">
                        <Link to="/visual"> <button className="btn btn-primary btn-block text-white" >View Our Analytics</button></Link>
                    </div>
                </div>
            </section>
        </>
    )


}