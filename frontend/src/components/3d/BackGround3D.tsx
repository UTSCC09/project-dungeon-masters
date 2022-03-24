import { ReactElement } from "react";
import { Canvas } from "react-three-fiber";
import CameraControls from "./CameraControls";
import Skybox from "./Skybox";

interface PropsType {
    path?: string; // A single path to an equirectangular background.
    paths?: string[]; // A list of six paths [px, nx, py, ny, pz, nz].
    component?: ReactElement; // A component to render in front of the background.
    autoRotate?: boolean; // Whether the background should automatically rotate.
}

const BackGround3D = function (props: PropsType) {
    const { component, path, paths, autoRotate } = props;
    return (
        <div className="fixed m-0 p-0 w-full h-full">
            <Canvas>
                <CameraControls autoRotate={autoRotate} />
                <Skybox path={path} paths={paths} />
            </Canvas>
            {component}
        </div>
    );
};

export default BackGround3D;
