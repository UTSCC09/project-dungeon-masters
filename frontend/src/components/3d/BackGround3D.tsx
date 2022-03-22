import { ReactElement } from "react";
import { Canvas } from "react-three-fiber";
import CameraControls from "./CameraControls";
import Skybox from "./Skybox";

interface PropsType {
    component: ReactElement;
}

const BackGround3D = function (props: PropsType) {
    const { component } = props;
    return (
        <div className="fixed m-0 p-0 w-full h-full">
            <Canvas>
                <CameraControls />
                <Skybox
                    paths={[
                        "/assets/right.png",
                        "/assets/left.png",
                        "/assets/top.png",
                        "/assets/bottom.png",
                        "/assets/front.png",
                        "/assets/back.png",
                    ]}
                />
            </Canvas>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                {component}
            </div>
        </div>
    );
};

export default BackGround3D;
