
import { Link, useNavigate } from "react-router-dom";
import Cover from "../home/Cover";
import Header from "../home/Header";
import { ReactSession } from 'react-client-session';
import axios from "axios";
import { useState } from "react";

export default function CaesarCipherLogin(props) {


    return (<>
        <Header />
        <Cover stitle='Perform Caesar Cipher For Added Security!' btitle="Cipher Time!" />
        <CaesarCipherFormLogin />
    </>);

}

function CaesarCipherFormLogin(props) {
    ReactSession.setStoreType('localStorage');

    const [answer, setAnswer] = useState('');

    const [question, setQuestion] = useState(makeid(5));

    let navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        const ans = answer;
        if (isEmpty(ans)) {
            alert('Invalid Answer. Please try again!');
            return;
        }

        const cipherkey = ReactSession.get('cipherkey')
        const requestBody = {
            input: question,
            key: parseInt(cipherkey)
        }
        // console.log(requestBody);
        axios.post('https://w7kue53xdmofgom6prybq5wxle0ykvjr.lambda-url.us-east-1.on.aws', requestBody).then((response) => {
            if (response.status === 200) {
                console.log(response);
                const ans = response.data;
                if (answer === ans) {

                    const userId = ReactSession.get("email");

                    const userData = { "userId": userId }
                    console.log("user data is");
                    console.log(userData);

                    axios.post('https://tkmt5eyheglwnytu2hojvxvquu0ucwek.lambda-url.us-east-1.on.aws', userData).then((response) => {
                        if (response.data.docInserted) {
                            alert('Login success!');
                            navigate("/");
                        }
                    }).catch((err) => {
                        console.log(err);
                        alert('Something went wrong!')
                    })
                } else {
                    alert('Wrong answer. Please try again.')
                    return;
                }
            }
        }).catch((err) => {
            console.log(err);
            alert('Something went wrong!')
        })
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setAnswer(value);
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
                                        <label className="text-black font-weight-bold" >Convert "{question}" using your Caesar Cipher Key</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12 form-group">
                                        <label className="text-black font-weight-bold" >Answer</label>
                                        <input type="text" id="answer"
                                            name="answer"
                                            onChange={(e) => handleChange(e)}
                                            className="form-control " />
                                    </div>
                                </div>
                            </form>
                            <div className="col-md-6 form-group">
                                <button className="btn btn-primary btn-block text-white" onClick={(e) => handleSubmit(e)}>Submit</button>
                            </div>
                        </div>
                        <SideNote />
                    </div>
                </div>
            </section>
        </>)

}


function SideNote(props) {

    const handleSubmit = (e) => {
        e.preventDefault();

        const email = ReactSession.get('email')
        const cipher = ReactSession.get('cipherkey')
        const requestBody = {
            email: email,
            key: cipher
        }
        axios.post('https://65ukabthl7dw7hn2g5ndg5rbpu0bmktc.lambda-url.us-east-1.on.aws/', requestBody).then((response) => {
            if (response.status === 200) {
                console.log(response);
            }
        }).catch((err) => {
            console.log(err);
        });

    }

    return (<>
        <div className="col-md-5" data-aos="fade-up" data-aos-delay="200">
            <div className="row">
                <div className="col-md-10 ml-auto contact-info">
                    <p><span className="d-block">Caesar Cipher</span> <span className="text-black"> It is a type of substitution cipher in which each letter in the plaintext is replaced by a letter some fixed number (your cipher key) of positions down the alphabet.<br></br> Use this link <a href="https://cryptii.com/pipes/caesar-cipher" target="_blank" rel="noopener noreferrer">Caesar Cipher</a> for easy substitution using your key.</span></p>
                </div>
            </div>
            <hr></hr>
            <div className="row">
                <div className="col-md-10 ml-auto contact-info">
                    <h3>Forgot your Cipher Key?</h3>
                    <button className="btn btn-primary btn-block text-white" onClick={(e) => handleSubmit(e)}>Send Cipher Key In Email</button>
                </div>
            </div>
        </div>
    </>)
}

function isEmpty(str) {
    return (!str || str.length === 0);
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}
