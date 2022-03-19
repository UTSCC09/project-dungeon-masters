import {
    FirstPersonControls,
    MeshReflectorMaterial,
    OrbitControls,
    ScrollControls,
} from "@react-three/drei";
import { url } from "inspector";
import React, { Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas } from "react-three-fiber";
import { Vector3 } from "three";
import Frame from "../components/3d/Frame";
import staticData from "../assets/staticData/lobbies";

interface PropsType {}

const cameraDefaultPos = new Vector3(0.0, 0.2, 1);

export default function Profile(props: PropsType) {
    // Dummy data. TODO: fetch from endpoint
    let username = "Aquil";
    let links = ["https://www.twitter.com/", "https://www.youtu.be.com/"];
    let description =
        "Uhhhhh... Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptate delectus in nisi asperiores excepturi, repellendus totam porro recusandae magnam reprehenderit dolorum quae nam numquam ducimus. Quod commodi vero ducimus cum!";
    let since = "1970/1/1";

    let lobbies = staticData;

    const navigate = useNavigate();

    return (
        <>
            <nav className="flex bg-gray-800 flex-row justify-between py-4 border-b-2 border-gray-900">
                <a
                    className="bg-red w-6 h-6 ml-4 bg-cover invert"
                    href="#"
                    style={{ backgroundImage: `url(/left-arrow.png)` }}
                    onClick={(e) => {
                        e.preventDefault();
                        navigate("/");
                    }}
                ></a>
            </nav>
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
                        <color attach="background" args={["#191920"]} />
                        <fog attach="fog" args={["#191920", 0, 15]} />
                        <mesh rotation={[-Math.PI / 2, 0, 0]}>
                            <planeGeometry args={[50, 50]} />
                            <MeshReflectorMaterial color="#101010" mirror={1} />
                            <ambientLight intensity={5} />
                        </mesh>
                        <ScrollControls>
                            <Frame
                                html={
                                    <UserInfoHtml
                                        username={username}
                                        links={links}
                                        description={description}
                                        since={since}
                                    />
                                }
                                height={1}
                                width={2}
                                scrollFactor={1}
                            />
                        </ScrollControls>
                    </Suspense>
                </Canvas>
            </div>
        </>
    );
}

function UserInfoHtml(props: {
    username: string;
    links: string[];
    description: string;
    since: string;
}) {
    const { username, links, description, since } = props;
    return (
        <div className="text-white w-[620px] h-[270px] ">
            <h2 className="font-bold text-3xl my-4">{username}</h2>
            <h1 className="font-semibold text-lg mb-1">Social Medias</h1>
            <ul className="list-disc italic ml-4">
                {links.map((item) => (
                    <li key={item}>
                        <a href={item} className="underline">
                            {item}
                        </a>
                    </li>
                ))}
            </ul>
            <div className="flex flex-row flex-grow mt-3">
                <div className=" border-solid border-white border-r-4 mr-2"></div>
                <p>{description}</p>
            </div>
            <p className="absolute bottom-0 right-0 text-right">
                Since: {since}
            </p>
            <a
                href="#"
                className="absolute right-0 top-0 bg-cover invert w-8 h-8"
                style={{ backgroundImage: `url(/pencil.png)` }}
            ></a>
        </div>
    );
}
