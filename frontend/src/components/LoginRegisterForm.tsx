import React from "react";
import { useState } from "react";
import Login from "./login";
import Register from "./register";

const LoginRegisterForm = function () {
    const [showLogin, setShowLogin] = useState(true);
    return showLogin ? (
        <Login setShowLogin={setShowLogin} />
    ) : (
        <Register setShowLogin={setShowLogin} />
    );
};

export default LoginRegisterForm;
