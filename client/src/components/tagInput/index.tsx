import React, { useState, useEffect } from 'react';

import { TAGS } from '@/constants/wallets';

interface TagInputProps {
  onTagsChange: (tags: number[]) => void;
  max: number;
}

const TagInput: React.FC<TagInputProps> = ({ onTagsChange, max }) => {
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    onTagsChange(tags.map((tag: string) => TAGS.indexOf(tag)));
  }, [tags]);

  const addTag = (tag: string) => {
    const newTags = [...tags, tag];
    setTags(newTags);
  };

  const removeTag = (tag: string) => {
    const newTags = tags.filter((t) => t !== tag);
    setTags(newTags);
  };

  return (
    <div className='space-y-2'>
      <ul className='flex flex-wrap m-0 p-0 list-none gap-4'>
        {TAGS.map((tag) => (
          <li
            key={tag}
            className={`flex px-6 py-2 rounded ${
              tags.includes(tag) ? 'bg-blue text-white' : 'bg-white text-blue'
            }`}>
            {tags.includes(tag) ? (
              <button
                className='flex justify-center items-center gap-x-2 cursor-pointer bg-transparent border-none text-inherit'
                onClick={(event) => {
                  event.preventDefault();
                  removeTag(tag);
                }}>
                {tag}
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-4 h-4'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            ) : (
              <button
                disabled={tags.length === max}
                className='flex justify-center items-center gap-x-2 cursor-pointer bg-transparent border-none text-inherit disabled:opacity-50'
                onClick={(event) => {
                  event.preventDefault();
                  addTag(tag);
                }}>
                {tag}
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-4 h-4'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M12 4.5v15m7.5-7.5h-15'
                  />
                </svg>
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TagInput;
