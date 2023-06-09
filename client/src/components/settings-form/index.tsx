export default function SettingsForm() {
  return (
    <>
      <div>
        <div className='md:grid md:grid-cols-3 md:gap-6'>
          <div className='md:col-span-1'>
            <div className='px-4 sm:px-0'>
              <h3 className='text-lg font-medium leading-6 text-white'>
                Profile
              </h3>
              <p className='mt-[-0.85rem] text-sm text-[#9CA3AF]'>
                This information will be displayed publicly so be careful what
                you share.
              </p>
            </div>
          </div>
          <div className='mt-5 md:col-span-2 md:mt-0'>
            <form action='#' method='POST'>
              <div className='shadow sm:overflow-hidden sm:rounded-md'>
                <div className='space-y-6 bg-gray-500 px-4 py-5 sm:p-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-50'>
                      Profile photo
                    </label>
                    <div className='mt-1 flex justify-center rounded-md border-2 border-dashed border-[#6B7280] px-6 pt-5 pb-6'>
                      <div className='space-y-1 text-center'>
                        <svg
                          className='mx-auto h-12 w-12 text-[#6B7280]'
                          stroke='currentColor'
                          fill='none'
                          viewBox='0 0 48 48'
                          aria-hidden='true'>
                          <path
                            d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                            strokeWidth={2}
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                        <div className='flex text-sm text-[#6B7280]'>
                          <label
                            htmlFor='file-upload'
                            className='relative flex flex-col items-center justify-center cursor-pointer rounded-md bg-transparent font-medium text-blue focus-within:outline-none focus-within:ring-2'>
                            <span>Upload a file</span>
                            <input
                              id='file-upload'
                              name='file-upload'
                              type='file'
                              className='sr-only'
                            />
                          </label>
                          <p className='pl-1'>or drag and drop</p>
                        </div>
                        <p className='text-xs text-[#6B7280]'>
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-50'>
                      Cover photo
                    </label>
                    <div className='mt-1 flex justify-center rounded-md border-2 border-dashed border-[#6B7280] px-6 pt-5 pb-6'>
                      <div className='space-y-1 text-center'>
                        <svg
                          className='mx-auto h-12 w-12 text-[#6B7280]'
                          stroke='currentColor'
                          fill='none'
                          viewBox='0 0 48 48'
                          aria-hidden='true'>
                          <path
                            d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                            strokeWidth={2}
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                        <div className='flex text-sm text-[#6B7280]'>
                          <label
                            htmlFor='file-upload'
                            className='relative flex flex-col items-center justify-center cursor-pointer rounded-md bg-transparent font-medium text-blue focus-within:outline-none focus-within:ring-2'>
                            <span>Upload a file</span>
                            <input
                              id='file-upload'
                              name='file-upload'
                              type='file'
                              className='sr-only'
                            />
                          </label>
                          <p className='pl-1'>or drag and drop</p>
                        </div>
                        <p className='text-xs text-[#6B7280]'>
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='grid grid-cols-3 gap-6'>
                    <div className='col-span-3 sm:col-span-2'>
                      <label
                        htmlFor='company-website'
                        className='block text-sm font-medium text-white'>
                        Personal Website
                      </label>
                      <div className='mt-1 flex rounded-md shadow-sm'>
                        <span className='inline-flex items-center rounded-l-md border border-r-0 bg-gray-300 px-3 text-sm text-white'>
                          http://
                        </span>
                        <input
                          type='text'
                          name='company-website'
                          id='company-website'
                          className='bg-gray-50 border rounded-r-md border-gray-300 text-gray-900 text-sm focus:ring-blue focus:border-blue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue dark:focus:border-blue'
                          placeholder='www.example.com'
                        />
                      </div>
                    </div>
                  </div>

                  <div className='grid grid-cols-3 gap-6'>
                    <div className='col-span-3 sm:col-span-2'>
                      <label
                        htmlFor='company-website'
                        className='block text-sm font-medium text-white'>
                        Linkedin
                      </label>
                      <div className='mt-1 flex rounded-md shadow-sm'>
                        <span className='inline-flex items-center rounded-l-md border border-r-0 bg-gray-300 px-3 text-sm text-white'>
                          http://
                        </span>
                        <input
                          type='text'
                          name='company-website'
                          id='company-website'
                          className='bg-gray-50 border rounded-r-md border-gray-300 text-gray-900 text-sm focus:ring-blue focus:border-blue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue dark:focus:border-blue'
                          placeholder='www.example.com'
                        />
                      </div>
                    </div>
                  </div>
                  <div className='grid grid-cols-3 gap-6'>
                    <div className='col-span-3 sm:col-span-2'>
                      <label
                        htmlFor='company-website'
                        className='block text-sm font-medium text-white'>
                        Github
                      </label>
                      <div className='mt-1 flex rounded-md shadow-sm'>
                        <span className='inline-flex items-center rounded-l-md border border-r-0 bg-gray-300 px-3 text-sm text-white'>
                          http://
                        </span>
                        <input
                          type='text'
                          name='company-website'
                          id='company-website'
                          className='bg-gray-50 border rounded-r-md border-gray-300 text-gray-900 text-sm focus:ring-blue focus:border-blue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue dark:focus:border-blue'
                          placeholder='www.example.com'
                        />
                      </div>
                    </div>
                  </div>
                  <div className='grid grid-cols-3 gap-6'>
                    <div className='col-span-3 sm:col-span-2'>
                      <label
                        htmlFor='company-website'
                        className='block text-sm font-medium text-white'>
                        Twitter
                      </label>
                      <div className='mt-1 flex rounded-md shadow-sm'>
                        <span className='inline-flex items-center rounded-l-md border border-r-0 bg-gray-300 px-3 text-sm text-white'>
                          http://
                        </span>
                        <input
                          type='text'
                          name='company-website'
                          id='company-website'
                          className='bg-gray-50 border rounded-r-md border-gray-300 text-gray-900 text-sm focus:ring-blue focus:border-blue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue dark:focus:border-blue'
                          placeholder='www.example.com'
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="bg-gray-500 px-4 py-3 text-right sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Save
                  </button>
                </div> */}
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className='hidden sm:block' aria-hidden='true'>
        <div className='py-5'>
          <div className='border-t border-gray-200' />
        </div>
      </div>

      <div className='mt-10 sm:mt-0'>
        <div className='md:grid md:grid-cols-3 md:gap-6'>
          <div className='md:col-span-1'>
            <div className='px-4 sm:px-0'>
              <h3 className='text-lg font-medium leading-6 text-white'>
                Personal Information
              </h3>
              <p className='mt-[-0.85rem] text-sm text-[#9CA3AF]'>
                Use a permanent address where you can receive mail.
              </p>
            </div>
          </div>
          <div className='mt-5 md:col-span-2 md:mt-0'>
            <form action='#' method='POST'>
              <div className='overflow-hidden shadow sm:rounded-md'>
                <div className='bg-gray-500 px-4 py-5 sm:p-6'>
                  <div className='grid grid-cols-6 gap-6'>
                    <div className='col-span-6 sm:col-span-4'>
                      <label
                        htmlFor='first-name'
                        className='block text-sm font-medium text-white'>
                        Name
                      </label>
                      <input
                        type='text'
                        name='first-name'
                        id='first-name'
                        autoComplete='given-name'
                        placeholder='Enter your name'
                        className='mt-1 bg-gray-50 border rounded-md border-gray-300 text-gray-900 text-sm focus:ring-blue focus:border-blue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue dark:focus:border-blue'
                      />
                    </div>

                    <div className='col-span-6 sm:col-span-4'>
                      <label
                        htmlFor='email-address'
                        className='block text-sm font-medium text-white'>
                        Email address
                      </label>
                      <input
                        type='text'
                        name='email-address'
                        id='email-address'
                        autoComplete='email'
                        placeholder='Enter your email address'
                        className='mt-1 bg-gray-50 border rounded-md border-gray-300 text-gray-900 text-sm focus:ring-blue focus:border-blue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue dark:focus:border-blue'
                      />
                    </div>

                    <div className='col-span-6 sm:col-span-4'>
                      <label
                        htmlFor='bio'
                        className='block text-sm font-medium text-white'>
                        Bio
                      </label>
                      <div className='mt-1'>
                        <textarea
                          rows={4}
                          name='comment'
                          id='bio'
                          placeholder='Enter your bio'
                          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50 border rounded-md border-gray-300 text-gray-900 text-sm focus:ring-blue focus:border-blue dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue dark:focus:border-blue resize-y'
                          defaultValue={''}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className='flex flex-col justify-center items-start bg-gray-500 px-4 pb-4 text-right sm:px-6'>
                  <button
                    type='submit'
                    className='cursor-pointer border-none flex items-center justify-center py-2 rounded-full w-40 bg-blue text-white font-semibold text-[1rem] leading-6'>
                    Update profile
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
