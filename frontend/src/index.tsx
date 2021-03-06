import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import LRFormWrapper from "./routes/LRFromWrapper";
import { AddCampFireForm } from "./components/AddCampfire/AddCampFireForm";
import { CookiesProvider } from "react-cookie";
import Profile from "./routes/Profile";
import Lobby from "./routes/Lobby";
import BackGround3D from "./components/3d/BackGround3D";
import Credits from "./routes/Credits";

ReactDOM.render(
    <React.StrictMode>
        <CookiesProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />}></Route>
                    <Route path="/login" element={<LRFormWrapper />} />
                    <Route path="/addCampfire" element={<AddCampFireForm />} />
                    <Route path="/profile" element={<Profile />}></Route>
                    <Route path="/lobby" element={<Lobby />}>
                        <Route path=":lobbyId" element={null} />
                    </Route>
                    <Route path="/credits" element={<Credits/>}></Route>
                    <Route
                        path="*"
                        element={
                            <main style={{ padding: "1rem" }}>
                                <p>There's nothing here!</p>
                            </main>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </CookiesProvider>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
