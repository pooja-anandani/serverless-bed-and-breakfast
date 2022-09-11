import { useState } from "react";
import { useNavigate } from "react-router-dom";



export default function InvoiceSearch(props) {

    const [inputValues, setInputValue] = useState({
        email: "",
        roomid: ""
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputValue({ ...inputValues, [name]: value });
    }

    let navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        const to = '/invoice/' + inputValues.email + '/' + inputValues.roomid;
        console.log(to);
        navigate(to);
    }

    return (<>
        <section className="section contact-section" id="next">
            <div className="container">
                <div className="row">
                    <div className="col-md-7">
                        <h3>Invoice Search</h3>
                        <form className="bg-white p-md-5 p-4 mb-5 border">
                            <div className="row">
                                <div className="col-md-12 form-group">
                                    <label className="text-black font-weight-bold" >Email</label>
                                    <input type="email" id="email" name="email"
                                        onChange={(e) => handleChange(e)}
                                        value={inputValues.email}
                                        className="form-control " />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12 form-group">
                                    <label className="text-black font-weight-bold" >Room ID</label>
                                    <input type="text" id="roomid" name="roomid"
                                        onChange={(e) => handleChange(e)}
                                        value={inputValues.roomid}
                                        className="form-control " />
                                </div>
                            </div>
                        </form>
                        <div className="col-md-6 form-group">
                            <button className="btn btn-primary btn-block text-white" onClick={(e) => handleSubmit(e)}>Search</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>)
}