import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cover from "../home/Cover"
import Header from "../home/Header"
import pooldetails from "../signup/userpooldetaills.json";
import {
    CognitoUserPool,
    CognitoUserAttribute,
    CognitoUser,
    AuthenticationDetails
} from "amazon-cognito-identity-js";

import { ReactSession } from 'react-client-session';

export default function Login(props) {

    return (<>
        <Header />
        <Cover stitle='Welcome Back.' btitle="Let's Login" />
        <LoginForm />
    </>)
}

function LoginForm(props) {

    ReactSession.setStoreType('localStorage');

    const [inputValues, setInputValue] = useState({
        email: "",
        password: ""
    });

    const [validation, setValidation] = useState({
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
        console.log(inputValues.password);
        const userPool = new CognitoUserPool(pooldetails);

        const cognitoUser = new CognitoUser({ Username: inputValues.email, Pool: userPool });

        const credentials = new AuthenticationDetails({
            Username: inputValues.email,
            Password: inputValues.password
        });

        cognitoUser.authenticateUser(credentials, {

            onSuccess: function (result) {
                console.log("Inside success");
                console.log(result);
                const userData = {
                    email: result.idToken.payload.email,
                    fullname: result.idToken.payload.given_name,
                    cusno: result.idToken.payload["custom:cusno"]
                }
                ReactSession.set('email', userData.email);
                ReactSession.set('name', userData.fullname);
                ReactSession.set('user_details', userData);
                ReactSession.set('isLoggedIn', true);
                ReactSession.set('cipherkey', result.idToken.payload["custom:cipherkey"])

                navigate("/login/security-question")
            },
            onFailure: function (err) {
                alert(err.message);
                console.log(err);
            }
        });


        // return new Promise((resolve, reject) => (
        //     cognitoUser.authenticateUser(credentials, {
        //      onSuccess: (result) => resolve(console.log("success")),
        //      onFailure: (err) => reject(console.log("error")),
        //     })
        //    ));

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
                                        <label className="text-black font-weight-bold" >Email</label>
                                        <input type="email" id="email" name="email"
                                            onChange={(e) => handleChange(e)}
                                            value={inputValues.email}
                                            className="form-control " />
                                        <label className="text-black font-weight-bold" >{validation.email}</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12 form-group">
                                        <label className="text-black font-weight-bold" >Password</label>
                                        <input type="password" id="password" name="password"
                                            onChange={(e) => handleChange(e)}
                                            value={inputValues.password}
                                            className="form-control " />
                                        <label className="text-black font-weight-bold" >{validation.password}</label>
                                    </div>
                                </div>
                            </form>
                            <div className="col-md-6 form-group">
                                <button className="btn btn-primary btn-block text-white" onClick={(e) => handleSubmit(e)}>Login</button>
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
                    <p><span className="d-block">New here?</span> <span className="text-black"> Please Sign Up then!</span></p>
                    <Link to="/signup"><button className="btn btn-primary btn-block text-white">Sign Up </button></Link>
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