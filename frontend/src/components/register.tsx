import React from "react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas } from "react-three-fiber";
import CameraControls from "./3d/CameraControls";
import Skybox from "./3d/Skybox";
import StyledLink from "./StyledLink";
import {UserApi, UserFields} from "../api/userApi";

interface PropsType {
    setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const Register = function (props: PropsType) {
    const { setShowLogin } = props;

    const pwdConfirmRef = useRef(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const registerHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setErrorMessage("Passwords does not match!");
            return;
        }
        if (process.env.NODE_ENV && process.env.NODE_ENV !== "development") {
            if (username.length < 5) {
                setErrorMessage("Username must be at least 5 characters long.");
                return;
            }
            if (password.length < 6) {
                setErrorMessage("Password must be at least 6 characters long.");
                return;
            }
        }
        UserApi.signUp(username, password, [UserFields._id, UserFields.username])
            .then((res) => {
                if (res) {
                    return res.json();
                } else {
                    console.log("Invalid");
                    setErrorMessage("Invalid username or password!");
                }
            })
            .then((json) => {
                if (!json.errors) {
                    navigate("/");
                } else {
                    setErrorMessage(json.errors[0].message);
                }
            })
            .catch((e) => {
                console.error(e);
                setErrorMessage(String(e));
            });
    };

    return (
        <>
            <img
                className="w-24 h-24 mx-auto rounded-full mb-8"
                src={require("../assets/images/tree_480.webp")}
            ></img>
            <div className="flex flex-col w-80 mx-auto pt-4 pb-6 bg-banner items-center justify-center rounded-2xl">
                <header
                    className="text-bright text-center font-bold mb-1"
                    style={{ fontSize: 32 }}
                >
                    Register
                </header>
                <div id="error" className="text-bright text-center">
                    {errorMessage}
                </div>
                <form
                    className="flex flex-col justify-center mt-5"
                    onSubmit={registerHandler}
                >
                    <input
                        className="rounded h-6 w-52 px-2 mb-6 bg-light-grey"
                        type="text"
                        placeholder="Username"
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    ></input>
                    <input
                        className="rounded h-6 w-52 px-2 mb-6 bg-light-grey"
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    ></input>
                    <input
                        ref={pwdConfirmRef}
                        className="rounded h-6 w-52 px-2 mb-6 bg-light-grey"
                        type="password"
                        placeholder="Confirm password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    ></input>
                    <button
                        className="bg-warm text-white py-3 rounded-lg mb-4"
                        type="submit"
                    >
                        Register
                    </button>
                    <div className="mx-auto">
                        <a
                            className="underline text-base text-bright text-opacity-75"
                            href=""
                            onClick={(e) => {
                                e.preventDefault();
                                setShowLogin(true);
                            }}
                        >
                            Already have an account?
                        </a>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Register;
