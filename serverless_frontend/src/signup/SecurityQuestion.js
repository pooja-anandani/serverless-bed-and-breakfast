import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cover from "../home/Cover";
import Header from "../home/Header";
import { ReactSession } from 'react-client-session';
import axios from "axios";

export default function SecurityQuestion(props) {


    return (<>
        <Header />
        <Cover stitle='Answer a Security Question For Added Security' btitle="Security Question" />
        <SecurityQuestionForm />
    </>);

}

function SecurityQuestionForm(props) {

    ReactSession.setStoreType('localStorage');
    const [error, setError] = useState('');

    const [questions, setQuestions] = useState({
        q1: {
            question: 'What was the name of your elementary / primary school?',
            id: 1,
            isSelected: false
        },
        q2: {
            question: 'In what city or town does your nearest sibling live?',
            id: 2,
            isSelected: false

        },
        q3: {
            question: 'What time of the day were you born? (hh:mm)',
            id: 3,
            isSelected: false
        },
        q4: {
            question: 'What was your favorite place to visit as a child?',
            id: 4,
            isSelected: false
        },
        q5: {
            question: 'What is your pets name?',
            id: 5,
            isSelected: false
        },
        q6: {
            question: 'In what year was your father born?',
            id: 6,
            isSelected: false
        }
    });

    const [answers, setAnswers] = useState({
        a1: {
            id: 1,
            question: 'What was the name of your elementary / primary school?',
            answer: ''
        },
        a2: {
            id: 2,
            question: 'In what city or town does your nearest sibling live?',
            answer: ''
        },
        a3: {
            id: 3,
            question: 'What time of the day were you born? (hh:mm)',
            answer: ''
        }
    });

    const handleChangeQuestions = (event) => {
        const { name, value } = event.target;

        let ans = answers;
        let ques = questions;
        console.log(ques[value]);
        switch (name) {
            case 'q1':
                ans.a1.id = ques[value].id;
                ans.a1.question = ques[value].question
                setAnswers(ans)
                ques.q1.isSelected = true
                setQuestions(ques)
                break;
            case 'q2':
                ans.a2.id = ques[value].id;
                ans.a2.question = ques[value].question
                setAnswers(ans)
                ques.q2.isSelected = true
                setQuestions(ques)
                break;
            case 'q3':
                ans.a3.id = ques[value].id;
                ans.a3.question = ques[value].question
                setAnswers(ans)
                ques.q3.isSelected = true
                setQuestions(ques)
                break;
            default:
                break;
        }

        ans = answers;
        if (ans.a1.id == ans.a2.id || ans.a1.id == ans.a3.id || ans.a2.id == ans.a3.id) {
            setError('Please select 3 different questions!');
        } else {
            setError('');
        }
    }

    const handleChangeAnswers = (event) => {
        const { name, value } = event.target;

        let ans = answers;
        switch (name) {
            case 'a1':
                ans.a1.answer = value;
                setAnswers(ans)
                break;
            case 'a2':
                ans.a2.answer = value;
                setAnswers(ans)
                break;
            case 'a3':
                ans.a3.answer = value;
                setAnswers(ans)
                break;
            default:
                break;
        }
    }


    let navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(answers);
        let ans = answers;
        if (isEmpty(ans.a1.answer) || isEmpty(ans.a2.answer) || isEmpty(ans.a3.answer)) {
            alert('Please answer all the questions!');
            return;
        }

        if (ans.a1.id == ans.a2.id || ans.a1.id == ans.a3.id || ans.a2.id == ans.a3.id) {
            alert('Please select 3 different questions!');
            return;
        }

        const email = ReactSession.get('email')
        if (!email && isEmpty(email)) {
            alert('Something went wrong!')
            navigate('/')
            return;
        }

        const ques_ans_values = {
            "q1": {
                "id": answers.a1.id,
                "question": answers.a1.question,
                "answer": answers.a1.answer
            },
            "q2": {
                "id": answers.a2.id,
                "question": answers.a2.question,
                "answer": answers.a2.answer
            },
            "q3": {
                "id": answers.a3.id,
                "question": answers.a3.question,
                "answer": answers.a3.answer
            }
        }

        axios.get('https://us-east1-serverless-project-g16.cloudfunctions.net/authentication-step2',
            {
                params: {
                    email: email,
                    task: 'WRITE',
                    ques_ans_values: ques_ans_values
                }
            }).then((response) => {
                console.log(response);
                if (response.status === 200) {
                    navigate("/sign-up/caesar-info")
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
                                        <label className="text-black font-weight-bold" >Security Question - 1</label>
                                        <select name="q1" id="q1" className="form-control"
                                            onChange={(e) => handleChangeQuestions(e)}
                                        >
                                            <option value="q1">{questions.q1.question}</option>
                                            <option value="q2">{questions.q2.question}</option>
                                            <option value="q3">{questions.q3.question}</option>
                                            <option value="q4">{questions.q4.question}</option>
                                            <option value="q5">{questions.q5.question}</option>
                                            <option value="q6">{questions.q6.question}</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12 form-group">
                                        <label className="text-black font-weight-bold" >Answer</label>
                                        <input type="text" id="a1" name="a1"
                                            onChange={(e) => handleChangeAnswers(e)}
                                            className="form-control " />
                                    </div>
                                </div>
                                <hr></hr>
                                <div className="row">
                                    <div className="col-md-12 form-group">
                                        <label className="text-black font-weight-bold" >Security Question - 2</label>
                                        <select name="q2" id="q2" className="form-control"
                                            onChange={(e) => handleChangeQuestions(e)}
                                        >
                                            <option value="q2">{questions.q2.question}</option>
                                            <option value="q3">{questions.q3.question}</option>
                                            <option value="q4">{questions.q4.question}</option>
                                            <option value="q5">{questions.q5.question}</option>
                                            <option value="q6">{questions.q6.question}</option>
                                            <option value="q1">{questions.q1.question}</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12 form-group">
                                        <label className="text-black font-weight-bold" >Answer</label>
                                        <input type="text" id="a2" name="a2"
                                            onChange={(e) => handleChangeAnswers(e)}
                                            className="form-control " />
                                    </div>
                                </div>
                                <hr></hr>
                                <div className="row">
                                    <div className="col-md-12 form-group">
                                        <label className="text-black font-weight-bold" >Security Question - 3</label>
                                        <select name="q3" id="q3" className="form-control"
                                            onChange={(e) => handleChangeQuestions(e)} >
                                            <option value="q3">{questions.q3.question}</option>
                                            <option value="q4">{questions.q4.question}</option>
                                            <option value="q5">{questions.q5.question}</option>
                                            <option value="q6">{questions.q6.question}</option>
                                            <option value="q1">{questions.q1.question}</option>
                                            <option value="q2">{questions.q2.question}</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12 form-group">
                                        <label className="text-black font-weight-bold" >Answer</label>
                                        <input type="text" id="a3" name="a3"
                                            onChange={(e) => handleChangeAnswers(e)}
                                            className="form-control " />
                                    </div>
                                </div>

                            </form>
                            <label className="text-black font-weight-bold" >{error}</label>
                            <div className="col-md-6 form-group">
                                <button className="btn btn-primary btn-block text-white" onClick={(e) => handleSubmit(e)}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>)

    function Questions() {

        return (<>
            <div className="row">
                <div className="col-md-12 form-group">
                    <select name="q1" id="q1" className="form-control"
                        onChange={(e) => handleChangeQuestions(e)}
                    >
                        <option value="">{questions.q1.question}</option>
                        <option value="">{questions.q2.question}</option>
                        <option value="">{questions.q3.question}</option>
                    </select>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12 form-group">
                    <label className="text-black font-weight-bold" >Answer</label>
                    <input type="text" id="a1" name="a1"
                        value={answers.a1.answer}
                        onChange={(e) => handleChangeAnswers(e)}
                        className="form-control " />
                </div>
            </div>
            <hr></hr>
            <div className="row">
                <div className="col-md-12 form-group">
                    <select name="q2" id="q2" className="form-control"
                        onChange={(e) => handleChangeQuestions(e)}
                    >
                        <option value="">{questions.q1.question}</option>
                        <option value="">{questions.q2.question}</option>
                        <option value="">{questions.q3.question}</option>
                    </select>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12 form-group">
                    <label className="text-black font-weight-bold" >Answer</label>
                    <input type="text" id="a2" name="a2"
                        value={answers.a2.answer}
                        onChange={(e) => handleChangeAnswers(e)}
                        className="form-control " />
                </div>
            </div>
            <hr></hr>
            <div className="row">
                <div className="col-md-12 form-group">
                    <select name="q3" id="q3" className="form-control"
                        onChange={(e) => handleChangeQuestions(e)} >
                        <option value="">{questions.q1.question}</option>
                        <option value="">{questions.q2.question}</option>
                        <option value="">{questions.q3.question}</option>
                    </select>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12 form-group">
                    <label className="text-black font-weight-bold" >Answer</label>
                    <input type="text" id="a3" name="a3"
                        value={answers.a3.answer}
                        onChange={(e) => handleChangeAnswers(e)}
                        className="form-control " />
                </div>
            </div>
        </>)
    }

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