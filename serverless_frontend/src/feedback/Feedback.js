import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cover from "../home/Cover";
import Header from "../home/Header";
import { ReactSession } from 'react-client-session';

export default function Feedback(props) {


    return (<>
        <Header />
        <Cover stitle='Tell Us Your Experience With Us. Help Us Improve.' btitle="Feedback" />
        <FeedbackForm />
    </>);

}

function FeedbackForm(props) {
    ReactSession.setStoreType('localStorage');
    const [feedback, setFeedback] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFeedback(value);
    }


    let navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEmpty(feedback)) {
            alert('Please write a feedback before submitting!');
            return;
        }
        const email = ReactSession.get('email')
        axios.get('https://us-central1-serverless-project-g16.cloudfunctions.net/feedback_sentiment_analysis',
            {
                params: {
                    feedback: feedback,
                    email: email
                }
            }).then((response) => {
                console.log(response);
                if (response.status === 200) {

                    if (response.data.score === 0) {
                        alert('Your feedback has been submitted successfully. We will reach out to you soon with regards to your feedback. Thank You.')
                    } else if (response.data.score === 1) {
                        alert('Your feedback has been submitted successfully. Thank You for choosing us.')
                    }
                    navigate("/feedback/analysis")
                } else {
                    alert('Something went wrong! Please try again!');
                    return;
                }
            }).catch((err) => {
                console.log(err);
                alert('Something went wrong! Please try again!');
                return;
            });
    };

    return (
        <>
            <section className="section contact-section" id="next">
                <div className="container">
                    <div className="row">
                        <div className="col-md-7">
                            <form className="bg-white p-md-5 p-4 mb-5 border">
                                <div className="row">
                                    <div className="col-md-12 form-group">
                                        <label className="text-black font-weight-bold" >Tell Us About Your Experience With Us.</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12 form-group">
                                        <label className="text-black font-weight-bold" >Feedback</label>
                                        <textarea name="feedback" id="feedback" className="form-control"
                                            onChange={(e) => handleChange(e)}
                                            rows="4" cols="50" />
                                    </div>
                                </div>
                            </form>
                            <div className="col-md-6 form-group">
                                <button className="btn btn-primary btn-block text-white" onClick={(e) => handleSubmit(e)}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>)

}


function SideNote(props) {
    return (<>
        <div className="col-md-5" data-aos="fade-up" data-aos-delay="200">
            <div className="row">
                <div className="col-md-10 ml-auto contact-info">
                    <p><span className="d-block">Check Out How Other's Experience Was With Us!</span> <span className="text-black"> Feedback Anaylis</span></p>
                    <Link to="/"><button classNameName="btn btn-primary btn-block text-white">View Feedback Analysis </button></Link>
                </div>
            </div>
        </div>
    </>)
}

function isEmpty(str) {
    return (!str || str.length === 0);
}