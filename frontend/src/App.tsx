import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./App.css";

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
                <Link to="/main">Main</Link>
            </nav>
            <Outlet />
        </div>
    );
}

export default App;
