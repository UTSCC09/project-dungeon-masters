import React from "react";
import LoginRegisterForm from "../components/LoginRegisterForm";
import BackGround3D from "../components/3d/BackGround3D";

const LRFormWrapper = function () {
    return <BackGround3D component={<LoginRegisterForm />} />;
};

export default LRFormWrapper;
