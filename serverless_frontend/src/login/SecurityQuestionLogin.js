
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cover from "../home/Cover";
import Header from "../home/Header";
import { ReactSession } from 'react-client-session';
import axios from "axios";

export default function SecurityQuestionLogin(props) {


    return (<>
        <Header />
        <Cover stitle='Answer a Security Question For Added Security' btitle="Security Question" />
        <SecurityQuestionFormLogin />
    </>);

}

function SecurityQuestionFormLogin(props) {

    ReactSession.setStoreType('localStorage');
    const [answer, setAnswer] = useState('');
    const [question, setQuestion] = useState('');
    const [userAnswer, setUserAnswer] = useState('');

    useEffect(() => {

        const email = ReactSession.get('email')
        if (!email && isEmpty(email)) {
            alert('Something went wrong!')
            navigate('/')
            return;
        }

        // const requestBody = {
        //     user_id: "grmvishnu123@gmail.com",
        //     room_id: "601",
        //     order_details: [
        //         {
        //             dish_id: "108",
        //             quantity: "3"
        //         },
        //         {
        //             dish_id: "303",
        //             quantity: "2"
        //         }
        //     ]
        // }

        // axios.post('https://q7rplzgt5w6ab6rcd726pr3p3q0xkarb.lambda-url.us-east-1.on.aws/', requestBody)
        //     .then((response) => {
        //         console.log('HERE');
        //         console.log(response);
        //     }).catch((err) => {
        //         console.log(err);
        //     })


        axios.get('https://us-east1-serverless-project-g16.cloudfunctions.net/authentication-step2',
            {
                params: {
                    email: email,
                    task: 'READ'
                }
            }).then((response) => {
                console.log(response);
                if (response.status === 200) {
                    const ques = response.data.question;
                    const ans = response.data.answer;
                    setQuestion(ques);
                    setAnswer(ans);
                } else {
                    alert('Something went wrong! Please try again!');
                    navigate('/')
                    return;
                }
            }).catch((err) => {
                console.log(err);
                alert('Something went wrong! Please try again!');
                return;
            });

    }, []);

    useEffect(() => {

        if (question && answer) {
            return;
        }
    }, [question, answer])

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserAnswer(value);
    }

    let navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        const ans = answer;
        const userAns = userAnswer;

        if (ans === userAnswer) {
            navigate("/login/caesar-cipher")
        } else {
            alert('Wrong Answer Please try again!');
        }
    };

    if (!question && !answer) {
        return (
            <div className="loader"></div>
        );
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
                                        <h3>Security Question</h3>
                                        <hr></hr>
                                        <label className="text-black font-weight-bold" >{question}</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12 form-group">
                                        <label className="text-black font-weight-bold" >Answer</label>
                                        <input type="text" id="answer" name="answer"
                                            onChange={(e) => handleChange(e)}
                                            className="form-control " />
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
                    <p><span className="d-block">Already Registered ?</span> <span className="text-black"> Please Login then!</span></p>
                    <Link to="/login"><button classNameName="btn btn-primary btn-block text-white">Login </button></Link>
                </div>
            </div>
        </div>
    </>)
}

function isEmpty(str) {
    return (!str || str.length === 0);
}