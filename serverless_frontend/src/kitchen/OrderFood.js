import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Cover from "../home/Cover";
import Header from "../home/Header";
import { ReactSession } from 'react-client-session';
import { async } from "@firebase/util";

export default function OrderFood(props) {


    return (<>
        <Header />
        <Cover stitle='Order Food From Our Amazing Kitchen.' btitle="Welcome to Serverless Kitchen" />
        <OrderFoodForm />
    </>);

}

function OrderFoodForm(props) {
    ReactSession.setStoreType('localStorage');

    let { room_id } = useParams();
    console.log(room_id);

    const [menu, setMenu] = useState([]);

    const [menumap, setMenuMap] = useState({});
    const [order, setOrder] = useState({});

    useEffect(() => {
        axios.get('https://jxwvbh2m2visbklkd3nji57nqm0finyy.lambda-url.us-east-1.on.aws/').then((response) => {
            // console.log(response.data);
            if (response.status === 200) {
                if (response.data.statusCode === 200) {
                    const menu = response.data.menu
                    let dish, price, dishId;
                    let finalMenu = []
                    let menuMap = {}
                    for (let m in menu) {
                        dish = menu[m]['dish_name']['S']
                        price = menu[m]['price']['N']
                        dishId = menu[m]['dish_id']['N']
                        finalMenu.push({
                            dish_name: dish,
                            dish_id: dishId,
                            price: price,
                        });
                        menuMap[dishId] = {
                            dish_name: dish,
                            dish_id: dishId,
                            price: price
                        }
                    }
                    setMenu(finalMenu);
                    setMenuMap(menuMap)
                }
            } else {
                alert('Something went wrong!');
            }
        })
    }, []);

    useEffect(() => {
        if (menu || menu.length > 0) {
            return;
        }
    }, [menu])


    const handleChange = (event) => {
        const { name, value } = event.target;
        let lorder = order;
        lorder[name] = value;
    }

    let navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        const orders = order;
        let order_details = []
        for (let i in orders) {
            if (orders[i] > 0) {
                order_details.push({
                    dish_id: i,
                    quantity: orders[i]
                })
            }
        }

        console.log(order_details);
        const email = ReactSession.get('email')
        const requestBody = {
            user_id: email,
            room_id: room_id,
            order_details: order_details
        }
        console.log(requestBody);
        const toOrderStatus = '/order-food/status/' + room_id;
        axios.post('https://q7rplzgt5w6ab6rcd726pr3p3q0xkarb.lambda-url.us-east-1.on.aws/', requestBody).then((response) => {
            console.log(response);
            if (response.status === 200) {
                if (response.data.statusCode === 200) {
                    const orderId = response.data.order_id
                    ReactSession.set('order_id', orderId);
                    alert('Order placed successfully!');
                    updateStatusAndPublish();
                    navigate(toOrderStatus)
                } else {
                    alert('Something went wrong! Please try again')
                    return;
                }
            }
        }).catch((err) => {
            console.log(err);
            alert('Something went wrong! Please try again')
            return;
        })
    };

    async function updateStatusAndPublish() {
        setTimeout(() => {
            const orderId = ReactSession.get('order_id');
            const updateStatusReq = {
                "order_id": orderId,
                "status": "Done"
            }
            axios.post('https://br537nnyv4a353w7rwxkhinofq0wpzfy.lambda-url.us-east-1.on.aws/', updateStatusReq).then((response) => {
                if (response.status === 200) {
                    console.log('Update status job sent !');
                } else {
                    console.log('Update status job failed !');
                }
            }).catch((err) => {
                console.log(err);
                console.log('Update status job failed');
            })

            const email = ReactSession.get('email')
            const publishRequest = {
                "email": email,
                "order_id": orderId
            }
            axios.post('https://us-central1-serverless-project-356720.cloudfunctions.net/serverless-publisher', publishRequest).then((response) => {
                if (response.status === 200) {
                    console.log('Publish job sent !');
                } else {
                    console.log('Publish job failed!');
                }
            }).catch((err) => {
                console.log(err);
                console.log('Publish job failed!');
            });
        }, 3000);
    }


    if (!menu || menu.length < 1) {
        return (
            <div className="loader"></div>
        );
    }

    return (<>
        <section className="section contact-section" id="next">
            <div className="container">
                <div className="row">
                    <div className="col-md-7">
                        <form className="bg-white p-md-5 p-4 mb-5 border">
                            <h2>Menu</h2>
                            <hr></hr>
                            {MenuItems(menu)}
                        </form>
                        <div className="col-md-6 form-group">
                            <button className="btn btn-primary btn-block text-white" onClick={(e) => handleSubmit(e)}>Order</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>);

    function Item(props) {
        return (<>
            <div className="row">
                <div className="col-md-12 form-group">
                    <h3>{props.item.dish_name}</h3>
                    <label className="text-black font-weight-bold" > Price ${props.item.price}</label>
                    <input type="number" defaultValue={0} name={props.item.dish_id} id={props.item.dish_id}
                        onChange={(e) => handleChange(e)} min={0}
                        className="form-control" style={{ width: '80px' }} />
                    <hr></hr>
                </div>
            </div>
        </>)
    }

    function MenuItems(menu) {
        const items = menu
        let menuItems = []
        for (let item in items) {
            menuItems.push(
                <Item key={item} item={items[item]} />
            )
        }
        return menuItems;
    }
}



