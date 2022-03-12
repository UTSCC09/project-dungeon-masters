import React from "react";
import { useState, useRef } from "react";
import StyledLink from "../components/StyledLink";

export default function Register() {
    const pwdConfirmRef = useRef<HTMLInputElement>(null);
    const registerQuery = `
        query {
            // TODO: Write the graphql query
        }`;
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const registerHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setErrorMessage("Passwords does not match!");
            return;
        }
        try {
            let result: any;
            result = await fetch("http://localhost:5000/graphql/", {
                method: "POST",
                headers: {
                    "content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({
                    query: registerQuery,
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
                setErrorMessage("Invalid username or password!");
            }
        } catch (e) {
            console.error(e);
            setErrorMessage(String(e));
        }
    };

    return (
        <main className="fixed w-full h-full bg-background pt-12">
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
                        onChange={(e) => setPassword(e.target.value)}
                    ></input>
                    <button
                        className="bg-warm text-white py-3 rounded-lg mb-4"
                        type="submit"
                    >
                        Register
                    </button>
                    <div className="mx-auto">
                        <StyledLink to="/login">
                            Already have an account?
                        </StyledLink>
                    </div>
                </form>
            </div>
        </main>
    );
}
