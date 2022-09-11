import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Feedback from "./feedback/Feedback";
import FeedbackAnalysis from "./feedback/FeedbackAnalysis";
import Admin from "./home/Admin";
import Home from "./home/Home";
import Logout from "./home/Logout";
import Invoice from "./kitchen/Invoice";
import InvoiceSearch from "./kitchen/InvoiceSearch";
import OrderFood from "./kitchen/OrderFood";
import OrderStatus from "./kitchen/OrderStatus";
import CaesarCipherLogin from "./login/CaesarCipherLogin";
import Login from "./login/Login";
import SecurityQuestionLogin from "./login/SecurityQuestionLogin";
import AvailableRooms from "./rooms/AvailableRooms";
import BookingInfo from "./rooms/BookingInfo";
import BookRoom from "./rooms/BookRoom";
import CaesarCipher from "./signup/CaesarCipher";
import SecurityQuestion from "./signup/SecurityQuestion";
import SignUp from "./signup/SignUp";
import BookTour from "./tours/BookTour";
import TourDetails from "./tours/TourDetails";
import Visual from "./visualization/Visual";

export default function RoutingConfig(props) {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<Home />}></Route>
                <Route exact path="/home" element={<Home />}></Route>
                <Route exact path="/login" element={<Login />}></Route>
                <Route exact path="/login/security-question" element={<SecurityQuestionLogin />}></Route>
                <Route exact path="/login/caesar-cipher" element={<CaesarCipherLogin />}></Route>
                <Route exact path="/logout" element={<Logout />}></Route>
                <Route exact path="/signup" element={<SignUp />}></Route>
                <Route exact path="/sign-up/security-question" element={<SecurityQuestion />}></Route>
                <Route exact path="/sign-up/caesar-info" element={<CaesarCipher />}></Route>
                <Route exact path="/rooms" element={<AvailableRooms />}></Route>
                <Route exact path="/book-rooms/:room_type" element={<BookRoom />}></Route>
                <Route exact path="/booking-info" element={<BookingInfo />}></Route>
                <Route exact path="/feedback" element={<Feedback />}></Route>
                <Route exact path="/feedback/analysis" element={<FeedbackAnalysis />}></Route>
                <Route exact path="/order-food/:room_id" element={<OrderFood />}></Route>
                <Route exact path="/order-food/status/:room_id" element={<OrderStatus />}></Route>
                <Route exact path="/book-tour/:duration" element={<BookTour />}></Route>
                <Route exact path="/tour/details" element={<TourDetails />}></Route>
                <Route exact path="/visual" element={<Visual />}></Route>
                <Route exact path="/admin" element={<Admin />}></Route>
                <Route exact path="/invoice/search" element={<InvoiceSearch />}></Route>
                <Route exact path="/invoice/:email/:room_id" element={<Invoice />}></Route>
            </Routes>
        </Router>
    );
}