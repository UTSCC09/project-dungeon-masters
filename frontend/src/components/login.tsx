import React from "react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import StyledLink from "./StyledLink";
import {UserApi, UserFields} from "../api/userApi";

interface PropsType {
    setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login = function (props: PropsType) {
    const { setShowLogin } = props;

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const navigate = useNavigate();

    const signinHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        UserApi.signIn(username, password, [UserFields._id, UserFields.username]).then((res) => {
                if (res) {
                    return res.json();
                } else {
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
                    Login
                </header>
                <div id="error" className="text-bright text-center">
                    {errorMessage}
                </div>
                <form
                    className="flex flex-col justify-center mt-5"
                    onSubmit={signinHandler}
                >
                    <input
                        className="rounded h-6 w-52 px-2 mb-6"
                        type="text"
                        placeholder="Username"
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    ></input>
                    <input
                        className="rounded h-6 w-52 px-2 mb-6"
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    ></input>
                    <button
                        className="bg-warm text-white py-3 rounded-lg mb-4"
                        type="submit"
                    >
                        Sign in
                    </button>
                    <div className="mx-auto">
                        <a
                            className="underline text-base text-bright text-opacity-75"
                            href=""
                            onClick={(e) => {
                                e.preventDefault();
                                setShowLogin(false);
                            }}
                        >
                            Do not have an account?
                        </a>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Login;
