import { Link, useNavigate } from "react-router-dom";
import Cover from "../home/Cover";
import Header from "../home/Header";
import { ReactSession } from 'react-client-session';
import { useEffect, useState } from "react";
import axios from "axios";

export default function CaesarCipher(props) {
    ReactSession.setStoreType('localStorage');

    return (<>
        <Header />
        <Cover stitle='Remember your Caesar Cipher Key' btitle="More Security!" />
        <CeasorInfo />
    </>);

    function CeasorInfo(props) {

        const [cipher, setCipher] = useState(ReactSession.get('cipherkey'));

        useEffect(() => {
            const email = ReactSession.get('email')
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

            const req = {
                userId: ReactSession.get('email'),
                cusId: ReactSession.get('cusno')
            }

            console.log(req);
            axios.post('https://3zf4cdkn32kme6au3qa5hltpf40szjsc.lambda-url.us-east-1.on.aws/', req).then((response) => {
                console.log(response);
            }).catch((err) => {
                console.log(err);
            });

        }, []);

        const cipherkey = ReactSession.get('cipherkey');
        return (
            <>
                <section className="section contact-section" id="next">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-7">
                                <div className="row">
                                    <div className="col-md-12 form-group">
                                        <h1>Caesar Cipher Key is : {cipherkey}</h1>
                                    </div>
                                </div>
                            </div>
                            <SideNote />
                        </div>
                    </div>
                </section>
            </>);
    }
}


function SideNote(props) {
    return (<>
        <div className="col-md-5" data-aos="fade-up" data-aos-delay="200">
            <div className="row">
                <div className="col-md-10 ml-auto contact-info">
                    <p><span className="d-block">Thank You For Signing Up!</span> <span className="text-black"> Let's Login Now!</span></p>
                    <Link to="/login"><button className="btn btn-primary btn-block text-white">Login </button></Link>
                </div>
            </div>
        </div>
    </>)
}
