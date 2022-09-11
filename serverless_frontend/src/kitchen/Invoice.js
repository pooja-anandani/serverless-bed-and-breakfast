import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Cover from "../home/Cover";
import Header from "../home/Header";
import { ReactSession } from 'react-client-session';
import Notification from "../home/Notification";

export default function Invoice(props) {


    return (<>
        <Header />
        <Cover stitle='Order Food From Our Amazing Kitchen.' btitle="Welcome to Serverless Kitchen" />
        <OrderStatusForm />
    </>);

}

function OrderStatusForm(props) {
    ReactSession.setStoreType('localStorage');

    let { email,room_id } = useParams();
    console.log(email,room_id);

    const [menumap, setMenuMap] = useState({});

    const [orders, setOrders] = useState([]);

    const [invoice, setInvoice] = useState(0);

    useEffect(() => {
        return;
    }, [menumap, orders]);

    useEffect(() => {

        axios.get('https://jxwvbh2m2visbklkd3nji57nqm0finyy.lambda-url.us-east-1.on.aws/').then((response) => {
            // console.log(response.data);
            if (response.status === 200) {
                if (response.data.statusCode === 200) {
                    const menu = response.data.menu
                    let dish, price, dishId;
                    let menuMap = {}
                    for (let m in menu) {
                        dish = menu[m]['dish_name']['S']
                        price = menu[m]['price']['N']
                        dishId = menu[m]['dish_id']['N']

                        menuMap[dishId] = {
                            dish_name: dish,
                            dish_id: dishId,
                            price: price
                        }
                    }
                    setMenuMap(menuMap)
                }
            } else {
                alert('Something went wrong!');
            }
        });

        const requestBody = {
            "user_id": email,
            "room_id": room_id
        }
        console.log(requestBody);
        axios.post('https://k2pl7yaofqwodemxhhvvz2z2l40pvnol.lambda-url.us-east-1.on.aws/', requestBody
        ).then((response) => {
            console.log(response);
            if (response.status === 200) {
                if (response.data.statusCode === 200) {
                    const body = response.data.body;
                    const ordersList = body;
                    let finalOrdersList = []
                    for (let o in ordersList) {
                        const singleOrder = ordersList[o];
                        const status = singleOrder.order_status['S'];
                        const orderId = singleOrder.order_id['N'];

                        let finalOrderMap = {}
                        let finalOrderDetails = {}
                        const orderDetails = singleOrder.order_details['L'];
                        let dishId, quantity;
                        for (let i in orderDetails) {
                            dishId = orderDetails[i]['M']['dish_id']['N']
                            quantity = orderDetails[i]['M']['quantity']['N']
                            finalOrderDetails[dishId] = {
                                dish_id: dishId,
                                quantity: quantity
                            }
                        }
                        finalOrderMap[orderId] = {
                            order_id: orderId,
                            status: status,
                            order_details: finalOrderDetails
                        }
                        finalOrdersList.push(finalOrderMap);
                    }
                    setOrders(finalOrdersList);
                }
            }
        }).catch((err) => {
            console.log(err);
        });

        const requestBodyInvoice = {
            "userId": email,
            "roomId": room_id
        }
        axios.post('https://djdqgksrqghtko3tvdxpik626i0kirjx.lambda-url.us-east-1.on.aws/', requestBodyInvoice).then((response) => {
            if (response.status === 200) {
                const invoiceList = response.data.invoiceList;
                // console.log(invoiceList);
                if (invoiceList && invoiceList.length > 0) {
                    let finalInvoiceAmount = 0
                    for (let i in invoiceList) {
                        const singleInvoice = invoiceList[i];
                        const invoiceAmt = singleInvoice['invoice_amount']['N'];
                        finalInvoiceAmount = finalInvoiceAmount + parseInt(invoiceAmt);
                    }
                    setInvoice(finalInvoiceAmount);
                }
            } else {
                console.log('Something went wrong');
            }

        }).catch((err) => {
            console.log(err);
        });

    }, []);

    let navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/admin")
    };

    const getOrdersComps = () => {

        const ordersList = orders;
        let ordersComps = []
        for (let o in ordersList) {
            for (let k in ordersList[o]) {
                // console.log(invoice[ordersList[o][k].order_id]);
                ordersComps.push(
                    <SingleOrder key={o} menumap={menumap}
                        status={ordersList[o][k].status}
                        order_id={ordersList[o][k].order_id}
                        order={ordersList[o][k].order_details}
                        invoice={invoice} />
                );
            }
        }

        return ordersComps;
    }


    if (Object.keys(menumap).length === 0) {
        return (
            <div className="loader"></div>
        );
    }

    if (orders.length < 1) {
        return (
            <>
                <section className="section contact-section" id="next">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-7">
                                <div className="row">
                                    <div className="col-md-12 form-group">
                                        <h2>No Orders to display.</h2>
                                    </div>
                                </div>
                                <div className="col-md-6 form-group">
                                    <button className="btn btn-primary btn-block text-white" onClick={(e) => handleSubmit(e)}>Go Back</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </>
        );
    }

    return (
        <>
            <section className="section contact-section" id="next">
                <div className="container">
                    <div className="row">
                        <div className="col-md-7">
                            <b><h1>Invoice Summary </h1></b>
                            <hr></hr>
                            <div className="row">
                                <div className="col-md-12 form-group">
                                    <h3>{'Total Invoice Amount ' + ' : $' + invoice}</h3>
                                    <hr></hr>
                                </div>
                            </div>
                            <hr></hr>
                            {getOrdersComps()}
                            <div className="col-md-6 form-group">
                                <button className="btn btn-primary btn-block text-white" onClick={(e) => handleSubmit(e)}>Go Back</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>);
}

function SingleOrder(props) {
    const menumap = props.menumap;
    const order = props.order;
    const status = props.status;
    const orderId = props.order_id;
    const invoice = props.invoice;
    // console.log(invoice);
    return (<>
        <form className="bg-white p-md-5 p-4 mb-5 border">
            <div className="row">
                <div className="col-md-12 form-group">
                    <h3>Order ID : {orderId}</h3>
                </div>
            </div>
            <hr></hr>
            <div className="row">
                <div className="col-md-12 form-group">
                    <h3>Order Status : {status}</h3>
                </div>
            </div>
            <hr></hr>
            <div className="row">
                <div className="col-md-12 form-group">
                    <h3>Item Name : Quantity</h3>
                </div>
            </div>
            {GetItems(menumap, order)}
        </form>
    </>);
}

const GetItems = (menu, Order) => {
    if (Object.keys(menu).length === 0 || Object.keys(Order).length === 0) {
        return (<></>);
    }
    let Items = []
    for (let i in Order) {
        Items.push(
            <Item key={i} dish_name={menu[i]['dish_name']} quantity={Order[i]['quantity']} />
        )
    }
    return Items;
}

function Item(props) {
    return (<>
        <hr></hr>
        <div className="row">
            <div className="col-md-12 form-group">
                <h3>{props.dish_name + ' : ' + props.quantity}</h3>
            </div>
        </div>
    </>)
}

