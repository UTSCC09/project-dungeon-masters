import React from "react";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import StyledLink from "../components/StyledLink";

const Login = function () {
    const errorRef = useRef<HTMLDivElement>(null);
    const loginQuery = `
        query {
            // TODO: Write the graphql query
        }`;
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showError, setShowError] = useState(false);

    const signinHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            let result: any;
            result = await fetch("http://localhost:5000/graphql/", {
                method: "POST",
                headers: {
                    "content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({
                    query: loginQuery,
                    variables: {
                        username,
                        password,
                    },
                }),
            });
            // TODO: Parse the graphql response?
            if (result.data) {
                // TODO: Route to some other screen?
            } else {
                if (errorRef.current !== null) {
                    errorRef.current.innerHTML =
                        "Invalid username or password!";
                }
                setShowError(true);
            }
        } catch (e) {
            console.error(e);
            if (errorRef.current !== null) {
                errorRef.current.innerHTML = String(e);
                setShowError(true);
            }
        }
    };

    return (
        <main className="mt-12">
            <img
                className="w-24 h-24 mx-auto rounded-full mb-8"
                src={require("../assets/images/tree_480.webp")}
            ></img>
            <div className="flex flex-col w-80 mx-auto pt-4 pb-6 items-center justify-center rounded-2xl bg-blue-300">
                <header
                    className="text-primary text-center font-bold mb-1"
                    style={{ fontSize: 32 }}
                >
                    Login
                </header>
                <div className="text-error text-center" ref={errorRef}></div>
                <form
                    className="flex flex-col justify-center mt-5"
                    onSubmit={signinHandler}
                >
                    <input
                        className="rounded px-2 mb-6"
                        type="text"
                        placeholder="Username"
                        onChange={(e) => setUsername(e.target.value)}
                    ></input>
                    <input
                        className="rounded px-2 mb-6"
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    ></input>
                    <button
                        className="bg-primary text-white py-3 rounded-lg mb-4"
                        type="submit"
                    >
                        Sign in
                    </button>
                    <StyledLink to="/register">
                        Don't have an account yet?
                    </StyledLink>
                    <div>{username}</div>
                    <div>{password}</div>
                </form>
            </div>
        </main>
    );
};

export default Login;
