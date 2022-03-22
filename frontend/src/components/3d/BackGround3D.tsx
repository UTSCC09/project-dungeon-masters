import { ReactElement } from "react";
import { Canvas } from "react-three-fiber";
import CameraControls from "./CameraControls";
import Skybox from "./Skybox";

interface PropsType {
    path?: string; // A single path to an equirectangular background.
    paths?: string[]; // A list of six paths [px, nx, py, ny, pz, nz].
    component?: ReactElement; // A component to render in front of the background.
}

const BackGround3D = function (props: PropsType) {
    const { component, path, paths } = props;
    return (
        <div className="fixed m-0 p-0 w-full h-full">
            <Canvas>
                <CameraControls />
                <Skybox path={path} paths={paths} />
            </Canvas>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                {component}
            </div>
        </div>
    );
};

export default BackGround3D;
