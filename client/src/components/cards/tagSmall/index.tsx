/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';

interface Props {
  name: string;
  icon: string;
  id: number;
}

const TagCardSmall = (props: Props) => {
  const { name, icon, id } = props;

  return (
    <Link
      href={`/tag/${id}`}
      className='no-underline cursor-pointer [border:none] py-[8px] px-3.5 bg-gray-500 rounded-xl w-full gap-x-2 flex flex-row box-border items-center justify-start'>
      <div className='w-[37px] h-[37px] rounded-full bg-navy flex flex-row justify-center items-center'>
        <img className='w-6 h-6' alt='' src={icon} />
      </div>
      <div className='flex flex-col items-center justify-start'>
        <div className='text-mini text-white text-left'>{name}</div>
      </div>
    </Link>
  );
};

export default TagCardSmall;
