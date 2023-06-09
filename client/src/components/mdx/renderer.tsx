/* eslint-disable react/no-children-prop */
'use client';
import { MDXProvider } from '@mdx-js/react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialOceanic } from 'react-syntax-highlighter/dist/esm/styles/prism';

const components = {
  // Add your custom components here
  h1: (props: any) => <h1 className='m-0 mb-4 text-white' {...props} />,
  h2: (props: any) => <h2 className='m-0 mb-4 text-white' {...props} />,
  h3: (props: any) => <h3 className='m-0 mb-4 text-white' {...props} />,
  h4: (props: any) => <h4 className='m-0 mb-4 text-white' {...props} />,
  h5: (props: any) => <h5 className='m-0 mb-4 text-white' {...props} />,
  h6: (props: any) => <h6 className='m-0 mb-4 text-white' {...props} />,
  p: (props: any) => (
    <p className='m-0 mb-4 text-white text-[16px] leading-6' {...props} />
  ),
  a: (props: any) => (
    <a
      className='m-0 text-white text-[16px] leading-6 underline font-semibold'
      {...props}
    />
  ),
  code({ node, inline, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <SyntaxHighlighter
        {...props}
        children={String(children).replace(/\n$/, '')}
        style={materialOceanic}
        language={match[1]}
        PreTag='div'
      />
    ) : (
      <code {...props} className={className}>
        {children}
      </code>
    );
  },
  pre: (props: any) => <pre className='my-8 rounded-sm' {...props} />,
};

interface Props {
  markdown: string;
}

const MarkdownRenderer = ({ markdown }: Props) => (
  <MDXProvider>
    <ReactMarkdown remarkPlugins={[gfm]} components={components}>
      {markdown}
    </ReactMarkdown>
  </MDXProvider>
);

export default MarkdownRenderer;
