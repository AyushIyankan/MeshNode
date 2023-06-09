import Link from "next/link";

interface Props {
    title: string;
    tagId: number;
}

const TagChip = (props: Props) => {
    const { title, tagId } = props;

    return (
        <Link
            href={`/tag/${tagId}`}
            className="rounded-xl bg-navy flex flex-row py-1 px-2 box-border items-center justify-center text-white text-[12px] leading-4 no-underline">
            {title}
        </Link>
    );
};

export default TagChip;
