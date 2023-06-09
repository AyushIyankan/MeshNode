/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useState } from "react";

interface Props {
    name: string;
    description: string;
    icon: string;
    id: number;
}

const TagCardLarge = (props: Props) => {
    const { name, description, icon, id } = props;

    return (
        <Link
            href={`/tag/${id}`}
            className="cursor-pointer [border:none] p-6 bg-gray-500 rounded-xl w-full gap-x-2 flex flex-col justify-center box-border no-underline">
            <div className="flex flex-col items justify-center">
                <div className="w-[max-content] rounded-sm bg-navy flex flex-row justify-center items-center gap-x-2 px-4 py-2 mb-4">
                    <img className="w-4 h-4" alt="" src={icon} />
                    <span className="text-white text-base leading-6">
                        {name}
                    </span>
                </div>
                <div>
                    <p className="text-sm leading-6 text-silver-100 m-0">
                        {description.slice(0, 160) + "..."}{" "}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default TagCardLarge;
