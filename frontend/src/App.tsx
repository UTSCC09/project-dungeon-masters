import React from "react";
import { Link, Outlet } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import Test from "./Test";

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
                <Link to="/login">Login</Link>
            </nav>
            <Outlet />
        </div>
    );
}

export default App;
