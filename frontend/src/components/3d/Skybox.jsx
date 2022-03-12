import { useThree } from "react-three-fiber";
import { CubeTextureLoader } from "three";

export default function Skybox(props) {
    const {
        path: [px, nx, py, ny, pz, nz],
    } = props;
    const { scene } = useThree();
    const loader = new CubeTextureLoader();
    // The CubeTextureLoader load method takes an array of urls representing all 6 sides of the cube.
    scene.background = loader.load([px, nx, py, ny, pz, nz]);

    return null;
}
