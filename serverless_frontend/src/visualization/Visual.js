import axios from "axios";
import { useEffect } from "react";
import Cover from "../home/Cover";
import Header from "../home/Header";


export default function Visual(props) {

    useEffect(() => {
        axios.get('https://us-central1-sdp-project-356600.cloudfunctions.net/visualization').then((response) => {
            console.log(response.status);
        }).catch((err) => {
            console.log(err);
        });

    }, []);

    return (<>
        <Header />
        <Cover stitle='Visualization' btitle='View our Analytics' />
        <KitchenAnalytics />
        <XAnalytics />
        <YAnalytics />
    </>)
}

function KitchenAnalytics(props) {
    return (
        <section className="py-5 bg-light">
            <div className="container">
                <h2>Kitchen Analytics</h2>
                <p>The below chart shows the percentage of dishes ordered from our kitchen.</p>
                <div className="row align-items-center" >
                    <iframe
                        width="1100"
                        height="600"
                        src="https://datastudio.google.com/embed/reporting/bee816f2-6177-4b44-be28-8d3fbfdf1203/page/Um1xC"
                        frameBorder="1"
                        allowFullScreen >
                    </iframe>
                </div>
            </div>
        </section>)
}

function XAnalytics(props) {
    return (
        <section className="py-5 bg-light">
            <div className="container">
                <h2>Records Analytics</h2>
                <p>The below chart shows the analytics of our records in a time frame.</p>
                <div className="row align-items-center" >
                    <iframe width="1000"
                        height="500"
                        src="https://datastudio.google.com/embed/reporting/5d7b9bb9-3177-4cc7-88eb-86845784f440/page/8Y8xC"
                        frameBorder="1"
                        // style="border:0" 
                        allowFullScreen>

                    </iframe>
                </div>
            </div>
        </section>)
}

function YAnalytics(props) {
    return (
        <section className="py-5 bg-light">
            <div className="container">
                <h2>Origin Analytics</h2>
                <p>The below chart shows the Analytics of Origin. Records from Web Interface and Chatbot</p>
                <div className="row align-items-center" >
                    <iframe
                        width="1000"
                        height="500"
                        src="https://datastudio.google.com/embed/reporting/3c08872c-e1c9-481c-a048-1f9f2b73adcf/page/DCDyC"
                        frameBorder="1"
                        allowFullScreen>
                    </iframe>
                </div>
            </div>
        </section>)
}
