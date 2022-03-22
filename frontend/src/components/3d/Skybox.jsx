import { useThree } from "react-three-fiber";
import {
    CubeTextureLoader,
    EquirectangularRefractionMapping,
    TextureLoader,
} from "three";

export default function Skybox(props) {
    const {
        paths: [px, nx, py, ny, pz, nz],
        path,
    } = props;
    const { scene } = useThree();
    if (path !== undefined) {
        const loader = new TextureLoader();
        const backgroundImage = loader.load(path);
        backgroundImage.mapping = EquirectangularRefractionMapping;
        scene.background = backgroundImage;
    } else {
        const loader = new CubeTextureLoader();
        scene.background = loader.load([px, nx, py, ny, pz, nz]);
    }

    return null;
}
