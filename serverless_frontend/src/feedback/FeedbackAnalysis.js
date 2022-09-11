import { Link, useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import Cover from "../home/Cover";
import Header from "../home/Header";
import { useEffect, useState } from "react";
import axios from "axios";

export default function FeedbackAnalysis(props) {


    return (<>
        <Header />
        <Cover stitle='Check The Analysis Of Our Feedbacks.' btitle="Feedback Anaylsis" />
        <FeedbackAnalysisSection />
    </>);

}

function FeedbackAnalysisSection(props) {

    const [positive, setPositive] = useState(0);
    const [negative, setNegative] = useState(0);

    let navigate = useNavigate();


    useEffect(() => {

        axios.get('https://us-central1-serverless-project-g16.cloudfunctions.net/feedback_analytics_fetch').then((response) => {
            if (response.status === 200) {
                // console.log(response.data);
                let postivePer = response.data.positive_feedback_prcnt;
                let negativePer = (100 - postivePer);
                postivePer = Math.round(postivePer * 100) / 100;
                negativePer = Math.round(negativePer * 100) / 100;
                // console.log(negativePer);
                setPositive(postivePer);
                setNegative(negativePer);
            } else {
                console.log('Something went wrong!');
                alert('Something went wrong');
                navigate('/');
            }
        })
    }, []);

    if (!positive && !negative) {
        return;
    }

    return (<>

        <section className="section contact-section" id="next">
            <div className="container">
                <div className="row">
                    <div className="col-md-7">
                        <form className="bg-white p-md-5 p-4 mb-5 border">
                            <div className="row">
                                <div className="col-md-12 form-group">
                                    <b><h2>Feedback Summary</h2></b>
                                    <hr></hr>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12 form-group">
                                    <h3>Positive Feedbacks Percentage : {positive}</h3>
                                    <h3>Negative Feedbacks Percentage : {negative}</h3>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="col-md-7">
                        <h2>Feedback Analysis</h2>
                        <hr></hr>
                        <div className="row">
                            <PieComponent positive={positive} negative={negative} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>)
}


function PieComponent(props) {
    const positive = props.positive;
    const negative = props.negative;
    const COLORS = ["#8884d8", "#82ca9d", "#FFBB28", "#FF8042", "#AF19FF"];
    const pieData = [
        {
            name: "Positive",
            value: positive
        },
        {
            name: "Negative",
            value: negative
        }
    ];
    const CustomTooltip = ({ active, payload, label }) => {
        if (active) {
            return (
                <div
                    className="custom-tooltip"
                    style={{
                        backgroundColor: "#ffff",
                        padding: "5px",
                        border: "1px solid #cccc"
                    }}
                >
                    <label>{`${payload[0].name} : ${payload[0].value}%`} </label>
                </div>
            );
        }
        return null;
    };

    return (
        <PieChart width={730} height={300}>
            <Pie
                data={pieData}
                color="#000000"
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
            >
                {pieData.map((entry, index) => (
                    <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                    />
                ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
        </PieChart>
    );

}