import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cover from "../home/Cover";
import Header from "../home/Header";
import pooldetails from "./userpooldetaills.json";
import {
    CognitoUserPool,
    CognitoUserAttribute,
    CognitoUser,
    AuthenticationDetails,
} from "amazon-cognito-identity-js";
import { ReactSession } from 'react-client-session';

export default function SignUp(props) {


    return (<>
        <Header />
        <Cover stitle='Glad you decided to register!' btitle="Let's Sign Up" />
        <SignUpForm />
    </>);

}

function SignUpForm(props) {

    ReactSession.setStoreType('localStorage');
    const [inputValues, setInputValue] = useState({
        fullname: "",
        email: "",
        password: ""
    });

    const [validation, setValidation] = useState({
        fullname: "",
        email: "",
        password: ""
    });

    let navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        let errors = validation;
        if (!isEmpty(errors.email) || !isEmpty(errors.password)) {
            alert('Please check if all the fields are filled and valid.');
            return;
        }

        console.log(inputValues.email);
        const userPool = new CognitoUserPool(pooldetails);

        let cusno = Math.random().toString().substring(2, 8);

        // let cipherText = Math.random().toString().substring(2, 8);
        let cipherText = Math.floor(Math.random() * 4) + 1;

        console.log(cusno);

        const attributeList = [
            new CognitoUserAttribute({
                Name: "email",
                Value: inputValues.email,
            }),
            new CognitoUserAttribute({
                Name: "given_name",
                Value: inputValues.fullname,
            }),
            new CognitoUserAttribute({
                Name: "custom:cusno",
                Value: cusno.toString(),
            }),
            new CognitoUserAttribute({
                Name: "custom:cipherkey",
                Value: cipherText.toString(),
            }),
        ];

        userPool.signUp(
            inputValues.email,
            inputValues.password,
            attributeList,
            null,
            function (err, result) {

                if (!err) {
                    console.log(result);
                    console.log("User register succesfully");
                    ReactSession.set('email', inputValues.email);
                    ReactSession.set('isLoggedIn', false);
                    ReactSession.set('cipherkey', cipherText);
                    navigate("/sign-up/security-question")
                } else {
                    console.log(err);
                    console.log("error while registering user");
                }
            }
        );
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputValue({ ...inputValues, [name]: value });

        let errors = validation;
        switch (name) {
            case 'email':
                if (!validateEmail(value)) {
                    errors.email = "Invalid Email ID";
                } else {
                    errors.email = "";
                }
                break;
            case 'password':
                if (!validatePassword(value)) {
                    errors.password = "Atleast have 8 characters, one capital letter and one number";
                } else {
                    errors.password = "";
                }
                break;
            default:
                break;
        }
        setValidation(errors);
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
                                        <label className="text-black font-weight-bold" htmlFor="fullname">Fullname</label>
                                        <input type="text" id="fullname" name="fullname"
                                            onChange={(e) => handleChange(e)}
                                            value={inputValues.fullname}
                                            className="form-control " />
                                        <label className="text-black font-weight-bold" >{validation.fullname}</label>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-12 form-group">
                                        <label className="text-black font-weight-bold" htmlFor="email">Email</label>
                                        <input type="email" id="email" name="email"
                                            onChange={(e) => handleChange(e)}
                                            value={inputValues.email}
                                            className="form-control " />
                                        <label className="text-black font-weight-bold" >{validation.email}</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12 form-group">
                                        <label className="text-black font-weight-bold" htmlFor="password">Password</label>
                                        <input type="password" id="password" name="password"
                                            onChange={(e) => handleChange(e)}
                                            value={inputValues.password}
                                            className="form-control " />
                                        <label className="text-black font-weight-bold" >{validation.password}</label>
                                    </div>
                                </div>
                            </form>
                            <div className="col-md-6 form-group">
                                <button className="btn btn-primary btn-block text-white" onClick={(e) => handleSubmit(e)}>Register</button>
                            </div>
                        </div>
                        <SideNote />
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
                    <Link to="/login"><button className="btn btn-primary btn-block text-white">Login </button></Link>
                </div>
            </div>
        </div>
    </>)
}

function validateEmail(email) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}

function validatePassword(password) {
    return String(password).match(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z]).{8,}$/

    );
}

function isEmpty(str) {
    return (!str || str.length === 0);
}