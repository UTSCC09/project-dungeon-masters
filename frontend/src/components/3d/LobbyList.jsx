import * as THREE from "three";
import { useEffect, useRef, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
    useCursor,
    MeshReflectorMaterial,
    Image,
    Text,
    useScroll,
    ScrollControls,
    Html,
} from "@react-three/drei";

const cameraDefaultPos = [0.0, 0.2, 2.5];
const frameSpacing = 2.5;

export default function LobbyList({ lobbies, loadNextFunc, loadPrevFunc }) {
    return (
        <div className="fixed m-0 p-0 w-full h-full">
            <Canvas
                camera={{
                    fov: 90,
                    position: cameraDefaultPos,
                    rotation: [0, 0, 0],
                }}
                dpr={window.devicePixelRatio}
            >
                <Suspense fallback={null}>
                    <ScrollControls
                        pages={2}
                        distance={3}
                        damping={4}
                        horizontal
                    >
                        <color attach="background" args={["#191920"]} />
                        <fog attach="fog" args={["#191920", 0, 15]} />
                        <mesh rotation={[-Math.PI / 2, 0, 0]}>
                            <planeGeometry args={[50, 50]} />
                            <MeshReflectorMaterial color="#101010" />
                            <ambientLight intensity={5} />
                        </mesh>
                        <Frames
                            images={lobbies}
                            loadNextFunc={loadNextFunc}
                            loadPrevFunc={loadPrevFunc}
                            scrollFactor={2.5 * (lobbies.length - 1)}
                        />
                    </ScrollControls>
                </Suspense>
            </Canvas>
        </div>
    );
}

function Frames({ images, scrollFactor, ...props }) {
    const ref = useRef(null);
    const clicked = useRef(null);
    const scroll = useScroll();
    const p = new THREE.Vector3(0.5, 0.5, 2.5);
    const q = new THREE.Quaternion();
    // Set the destination of the camera to the clicked element.
    useFrame(() => {
        if (clicked.current) {
            clicked.current.parent.updateWorldMatrix(true, true);
            clicked.current.parent.localToWorld(p.set(0.5, 0.5, 1.25));
            clicked.current.parent.getWorldQuaternion(q);
        } else {
            p.set(...cameraDefaultPos);
            q.identity();
        }
    });
    // Smooth camera rotation and translation.
    useFrame((state) => {
        state.camera.position.lerp(p, 0.025);
        state.camera.quaternion.slerp(q, 0.025);
    });
    // Left and right motion of the entire list.
    useFrame(() => {
        ref.current.position.x = -scroll.offset * (2.5 * (images.length - 1));
    });
    return (
        <group
            scale={[1, 1, 1]}
            ref={ref}
            onClick={(e) => {
                e.stopPropagation();
                if (clicked.current === e.object) {
                    clicked.current = null;
                    return;
                }
                clicked.current = e.object;
            }}
            onPointerMissed={(e) => {
                e.stopPropagation();
                clicked.current = null;
            }}
        >
            {props.loadPrevFunc ? (
                <FrameTerminal
                    index={-1}
                    position={[-frameSpacing, 0, 0]}
                    loadPrevFunc={props.loadPrevFunc}
                    scrollFactor={scrollFactor}
                    url="/prev2.png"
                    {...props}
                />
            ) : null}
            {images.map((props, index) => (
                <Frame
                    key={props.campfireId}
                    index={index}
                    position={[index * frameSpacing, 0, 0]}
                    scrollFactor={scrollFactor}
                    {...props}
                />
            ))}
            {props.loadNextFunc ? (
                <FrameTerminal
                    index={images.length}
                    position={[images.length * frameSpacing, 0, 0]}
                    loadNextFunc={props.loadNextFunc}
                    url="/next2.png"
                    scrollFactor={scrollFactor}
                    {...props}
                />
            ) : null}
        </group>
    );
}

function Frame({
    index,
    ownerId,
    title,
    description,
    url,
    navigateFunc,
    scrollFactor,
    thumbnail,
    ...props
}) {
    const [hovered, setHovered] = useState(false);
    const [clicked, setClicked] = useState(false);
    const random = useRef(Math.random());
    const scroll = useScroll();
    const groupRef = useRef();
    const frame = useRef();
    const image = useRef();
    const c = new THREE.Color();
    useCursor(hovered);
    useFrame(() => {
        frame.current.material.color.lerp(
            c.set(hovered ? "orange" : "white").convertSRGBToLinear(),
            0.1
        );
        let { x, y } = image.current.scale;
        image.current.scale.x = THREE.MathUtils.lerp(
            x,
            hovered ? 0.85 : 0.92,
            0.1
        );
        image.current.scale.y = THREE.MathUtils.lerp(
            y,
            hovered ? 0.85 : 0.92,
            0.1
        );
    });
    useFrame((state) => {
        image.current.position.z =
            1.0 +
            0.3 *
                Math.sin(
                    state.clock.elapsedTime + random.current * 2 * Math.PI
                );
    });
    function linear(x) {
        const y = 0.1 * (x - index * frameSpacing);
        return y;
    }
    function quadratic(x) {
        const y = 0.05 * (x - index * frameSpacing) ** 2;
        return y;
    }
    useFrame(() => {
        groupRef.current.position.z = quadratic(scroll.offset * scrollFactor);
        groupRef.current.rotation.y = linear(scroll.offset * scrollFactor);
    });
    return (
        <group {...props} ref={groupRef}>
            <mesh
                name={ownerId}
                onPointerOver={(e) => {
                    setHovered(true);
                }}
                onPointerOut={(e) => {
                    setHovered(false);
                }}
                onClick={(e) => {
                    setClicked(true);
                }}
                onPointerMissed={(e) => {
                    setClicked(false);
                }}
                scale={[1, 1, 0.05]}
                position={[0, 0.5, 0]}
            >
                <boxGeometry />
                <meshStandardMaterial
                    color="#151515"
                    metalness={0.5}
                    roughness={0.5}
                />
                <mesh
                    ref={frame}
                    raycast={() => null}
                    scale={[0.93, 0.9, 0.93]}
                    position={[0, 0, 0.2]}
                    color="white"
                >
                    <boxGeometry />
                    <meshBasicMaterial toneMapped={false} fog={false} />
                    <Image
                        ref={image}
                        raycast={() => null}
                        position={[0, 0, 0.7]}
                        url={thumbnail == "" ?  "/assets/front.png": thumbnail}
                    />
                </mesh>
            </mesh>
            <group position={[0.6, 1, 0]}>
                <Text
                    raycast={() => null}
                    maxWidth={1}
                    position={[0, 0, 0]}
                    fontSize={0.05}
                    anchorX="left"
                    anchorY="top"
                >
                    {title}
                </Text>
                <Text
                    raycast={() => null}
                    maxWidth={0.85}
                    position={[0, -0.082, 0]}
                    fontSize={0.03}
                    anchorX="left"
                    anchorY="top"
                >
                    {ownerId}
                </Text>
                <Text
                    raycast={() => null}
                    maxWidth={0.85}
                    position={[0, -0.14, 0]}
                    fontSize={0.03}
                    anchorX="left"
                    anchorY="top"
                >
                    {description}
                </Text>
                {clicked ? (
                    <Html
                        position={[0.15, -0.85, 0]}
                        scale={0.15}
                        anchorX="left"
                        anchorY="top"
                    >
                        <button
                            className="bg-black text-white rounded-full px-4 py-1"
                            onClick={(e) => {
                                // TODO: Setup navigation
                                // navigateFunc("/")
                            }}
                        >
                            Join
                        </button>
                    </Html>
                ) : null}
            </group>
        </group>
    );
}

function FrameTerminal({ index, loadNextFunc, url, scrollFactor, ...props }) {
    const groupRef = useRef();
    const scroll = useScroll();
    function linear(x) {
        const y = 0.1 * (x - index * frameSpacing);
        return y;
    }
    function quadratic(x) {
        const y = 0.05 * (x - index * frameSpacing) ** 2;
        return y;
    }
    useFrame(() => {
        groupRef.current.position.z = quadratic(scroll.offset * scrollFactor);
        groupRef.current.rotation.y = linear(scroll.offset * scrollFactor);
    });
    return (
        <group {...props} ref={groupRef}>
            <mesh
                onClick={(e) => {
                    console.log("clicked");
                    loadNextFunc();
                    // TODO: Goto next screen?
                }}
                scale={[1, 1, 0.05]}
                position={[0, 0.5, 0]}
            >
                <boxGeometry />
                <meshStandardMaterial
                    color="#151515"
                    metalness={0.5}
                    roughness={0.5}
                />
                <mesh
                    raycast={() => null}
                    scale={[0.93, 0.9, 0.93]}
                    position={[0, 0, 0.2]}
                    color="white"
                >
                    <boxGeometry />
                    <meshBasicMaterial toneMapped={false} fog={false} />
                    <Image
                        raycast={() => null}
                        position={[0, 0, 0.7]}
                        url={url}
                    />
                </mesh>
            </mesh>
        </group>
    );
}
