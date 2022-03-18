import React from "react";
import { useState, useRef } from "react";
import { Canvas } from "react-three-fiber";
import CameraControls from "./3d/CameraControls";
import Skybox from "./3d/Skybox";
import StyledLink from "./StyledLink";

interface PropsType {
    setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const Register = function (props: PropsType) {
    const { setShowLogin } = props;

    const pwdConfirmRef = useRef(null);
    const registerQuery = `
    mutation signUp($username: String, $password: String) {
        signUp(username: $username, password: $password) {
            _id
            username
        }
    }`;
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const registerHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setErrorMessage("Passwords does not match!");
            return;
        }
        try {
            fetch("http://localhost:4000/graphql/", {
                method: "POST",
                headers: {
                    "content-type": "application/json; charset=UTF-8",
                },
                credentials: "include",
                body: JSON.stringify({
                    query: registerQuery,
                    variables: {
                        username,
                        password,
                    },
                }),
            }).then((res) => {
                // TODO: Parse the graphql response? VALID DATA RESPONSE: {"data":{"signUp":{"_id":"6234197b87ebcfe1dae1e816", "username":"test1"}}}
                if (res) {
                    // TODO: Route to some other screen?
                } else {
                    setErrorMessage("Invalid username or password!");
                }
            });
        } catch (e) {
            console.error(e);
            setErrorMessage(String(e));
        }
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
                    ></input>
                    <input
                        className="rounded h-6 w-52 px-2 mb-6 bg-light-grey"
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    ></input>
                    <input
                        ref={pwdConfirmRef}
                        className="rounded h-6 w-52 px-2 mb-6 bg-light-grey"
                        type="password"
                        placeholder="Confirm password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
