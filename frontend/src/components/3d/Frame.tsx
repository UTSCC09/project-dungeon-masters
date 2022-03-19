import { Html, useScroll } from "@react-three/drei";
import { group } from "console";
import React, { useRef } from "react";
import { useFrame } from "react-three-fiber";

interface PropsType {
    html: JSX.Element;
    height: number;
    width: number;
    scrollFactor: number;
}

export default function Frame(props: PropsType) {
    const { height, width, html, scrollFactor } = props;
    const groupRef = useRef<any>(null);
    const scroll = useScroll();
    useFrame(() => {
        if (!groupRef || !groupRef.current) return;
        groupRef.current.position.y = scroll.offset * scrollFactor;
    });
    return (
        <group {...props} ref={groupRef}>
            <mesh
                onClick={(e) => {
                    console.log("clicked");
                }}
                scale={[width, height, 0.05]}
                position={[0, 0.5, 0]}
            >
                <boxGeometry />
                <meshBasicMaterial toneMapped={false} fog={false} />
                <mesh
                    raycast={() => null}
                    scale={[0.95, 0.91, 0.93]}
                    position={[0, 0, 0.2]}
                >
                    <boxGeometry />
                    <meshStandardMaterial
                        color="#191920"
                        metalness={0.5}
                        roughness={0.5}
                    />
                </mesh>
            </mesh>
            <Html position={[0, height / 1.5, 0.0]} scale={0.12} transform>
                {html}
            </Html>
        </group>
    );
}
