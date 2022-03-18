import React from "react";
import { Link } from "react-router-dom";

interface PropsType {
    to: string;
    children: string;
}

export default function StyledLink(props: PropsType) {
    return (
        <div className="underline text-base text-bright text-opacity-75">
            <Link to={props.to}>{props.children}</Link>
        </div>
    );
}
