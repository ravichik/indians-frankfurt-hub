import React, { useState, useEffect, useRef } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './RichTextEditor.css';

// Custom toolbar options
const modules = {
  toolbar: {
    container: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      
      [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'align': [] }],
      
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      
      ['clean']
    ],
  },
  clipboard: {
    // Allow pasting with formatting
    matchVisual: false,
    matchers: []
  }
};

// Allowed formats
const formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background', 'script',
  'list', 'bullet', 'indent', 'direction', 'align',
  'blockquote', 'code-block',
  'link', 'image', 'video'
];

const RichTextEditor = ({ 
  value, 
  onChange, 
  placeholder = "Start writing your amazing content...", 
  height = "400px",
  readOnly = false,
  className = ""
}) => {
  const [editorHtml, setEditorHtml] = useState(value || '');
  const quillRef = useRef(null);

  useEffect(() => {
    if (value !== undefined && value !== editorHtml) {
      setEditorHtml(value);
    }
  }, [value]);

  const handleChange = (content, delta, source, editor) => {
    setEditorHtml(content);
    if (onChange) {
      onChange(content, editor.getText());
    }
  };

  const customStyle = {
    height: height,
    marginBottom: '42px' // Space for toolbar
  };

  return (
    <div className={`rich-text-editor-container ${className}`}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={editorHtml}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={readOnly}
        style={customStyle}
      />
      {!readOnly && (
        <div className="editor-footer">
          <span className="word-count">
            {editorHtml ? `${editorHtml.replace(/<[^>]*>/g, '').length} characters` : '0 characters'}
          </span>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;