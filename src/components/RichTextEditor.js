import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = ({ value, onChange, placeholder, readOnly = false, height = '200px' }) => {
  const modules = {
    toolbar: readOnly ? false : [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'blockquote', 'code-block',
    'list', 'bullet',
    'indent',
    'link'
  ];

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={readOnly}
        style={{ height: readOnly ? 'auto' : height }}
      />
      <style jsx global>{`
        .rich-text-editor .ql-container {
          font-family: inherit;
          font-size: 14px;
        }
        
        .rich-text-editor .ql-editor {
          min-height: ${readOnly ? 'auto' : height};
          max-height: ${readOnly ? 'none' : '400px'};
          overflow-y: auto;
        }
        
        .rich-text-editor .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
        
        .rich-text-editor .ql-snow {
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
        }
        
        .rich-text-editor .ql-toolbar.ql-snow {
          border: none;
          border-bottom: 1px solid #e5e7eb;
          border-radius: 0.5rem 0.5rem 0 0;
          background: #f9fafb;
        }
        
        .rich-text-editor .ql-container.ql-snow {
          border: none;
          border-radius: 0 0 0.5rem 0.5rem;
        }
        
        /* Read-only styles */
        .rich-text-editor .ql-container.ql-disabled {
          background: transparent;
        }
        
        .rich-text-editor .ql-editor h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
        }
        
        .rich-text-editor .ql-editor h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.83em 0;
        }
        
        .rich-text-editor .ql-editor h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin: 1em 0;
        }
        
        .rich-text-editor .ql-editor ul,
        .rich-text-editor .ql-editor ol {
          padding-left: 1.5em;
          margin: 1em 0;
        }
        
        .rich-text-editor .ql-editor li {
          margin: 0.5em 0;
        }
        
        .rich-text-editor .ql-editor blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1em;
          margin: 1em 0;
          color: #6b7280;
        }
        
        .rich-text-editor .ql-editor pre {
          background: #f3f4f6;
          border-radius: 0.375rem;
          padding: 1em;
          margin: 1em 0;
          overflow-x: auto;
        }
        
        .rich-text-editor .ql-editor a {
          color: #2563eb;
          text-decoration: underline;
        }
        
        .rich-text-editor .ql-editor a:hover {
          color: #1d4ed8;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;