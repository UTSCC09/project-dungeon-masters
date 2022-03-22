import React from "react";
import LoginRegisterForm from "../components/LoginRegisterForm";
import BackGround3D from "../components/3d/BackGround3D";

const LRFormWrapper = function () {
    return (
        <BackGround3D
            paths={[
                "/assets/right.png",
                "/assets/left.png",
                "/assets/top.png",
                "/assets/bottom.png",
                "/assets/front.png",
                "/assets/back.png",
            ]}
            component={<LoginRegisterForm />}
        />
    );
};

export default LRFormWrapper;
