import React from "react";
import { Link, Outlet } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import Test from "./Test";
import StyledLink from "./components/StyledLink";

function App() {
    return (
        <div className="App">
            <h1>Bookkeeper</h1>
            <nav
                style={{
                    borderBottom: "solid 1px",
                    paddingBottom: "1rem",
                }}
            >
                <StyledLink to="/login">Login</StyledLink>
                <StyledLink to="/register">Register</StyledLink>
            </nav>
            <Outlet />
        </div>
    );
}

export default App;
