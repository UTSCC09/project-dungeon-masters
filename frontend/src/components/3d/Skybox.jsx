import { useThree } from "react-three-fiber";
import {
    CubeTextureLoader,
    EquirectangularRefractionMapping,
    TextureLoader,
} from "three";

export default function Skybox(props) {
    const { paths, path } = props;
    const { scene } = useThree();
    if (path !== undefined) {
        const loader = new TextureLoader();
        const backgroundImage = loader.load(path);
        backgroundImage.mapping = EquirectangularRefractionMapping;
        scene.background = backgroundImage;
    } else if (paths !== undefined) {
        const loader = new CubeTextureLoader();
        scene.background = loader.load(paths);
    }

    return null;
}
