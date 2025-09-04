import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FiEye, FiEdit, FiMaximize2, FiMinimize2, FiInfo } from 'react-icons/fi';
import './MarkdownEditor.css';

const MarkdownEditor = ({ value, onChange, placeholder, height = '300px', maxLength }) => {
  const [activeTab, setActiveTab] = useState('write');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const textareaRef = useRef(null);

  const markdownHelp = [
    { syntax: '**bold**', result: 'bold' },
    { syntax: '*italic*', result: 'italic' },
    { syntax: '# Heading', result: 'Heading' },
    { syntax: '- List item', result: 'Bullet list' },
    { syntax: '1. Numbered', result: 'Numbered list' },
    { syntax: '[Link](url)', result: 'Link' },
    { syntax: '`code`', result: 'Inline code' },
    { syntax: '> Quote', result: 'Blockquote' }
  ];

  const insertMarkdown = (before, after = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    // If no text is selected and we're adding paired markers (like ** for bold)
    // insert placeholder text
    const textToWrap = selectedText || (before === after ? 'text' : '');
    const newText = value.substring(0, start) + before + textToWrap + after + value.substring(end);
    
    if (!maxLength || newText.length <= maxLength) {
      onChange(newText);
      // Use requestAnimationFrame for better timing
      requestAnimationFrame(() => {
        textarea.focus();
        // Position cursor between the markers if no text was selected
        if (!selectedText && before === after) {
          const cursorPos = start + before.length;
          textarea.setSelectionRange(cursorPos, cursorPos + textToWrap.length);
        } else {
          // Position cursor after the inserted text
          const cursorPos = start + before.length + textToWrap.length + after.length;
          textarea.setSelectionRange(cursorPos, cursorPos);
        }
      });
    }
  };

  const insertLinePrefix = (prefix) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    // Find the start of the current line
    let lineStart = start;
    while (lineStart > 0 && value[lineStart - 1] !== '\n') {
      lineStart--;
    }
    
    // Check if line already has this prefix
    const currentLine = value.substring(lineStart, value.indexOf('\n', lineStart));
    if (currentLine.startsWith(prefix)) {
      // Remove the prefix
      const newText = value.substring(0, lineStart) + value.substring(lineStart + prefix.length);
      onChange(newText);
      requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(start - prefix.length, end - prefix.length);
      });
    } else {
      // Add the prefix
      const newText = value.substring(0, lineStart) + prefix + value.substring(lineStart);
      onChange(newText);
      requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(start + prefix.length, end + prefix.length);
      });
    }
  };

  const insertLink = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    // If text is selected, use it as link text
    const linkText = selectedText || 'link text';
    const newText = value.substring(0, start) + '[' + linkText + '](url)' + value.substring(end);
    
    if (!maxLength || newText.length <= maxLength) {
      onChange(newText);
      requestAnimationFrame(() => {
        textarea.focus();
        // Select the 'url' placeholder
        const urlStart = start + linkText.length + 3; // 3 for ']('
        textarea.setSelectionRange(urlStart, urlStart + 3); // Select 'url'
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          insertMarkdown('**', '**');
          break;
        case 'i':
          e.preventDefault();
          insertMarkdown('*', '*');
          break;
        case 'k':
          e.preventDefault();
          insertLink();
          break;
        default:
          break;
      }
    }
  };

  return (
    <div className={`markdown-editor ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="markdown-toolbar">
        <div className="toolbar-tabs">
          <button
            type="button"
            className={`tab-button ${activeTab === 'write' ? 'active' : ''}`}
            onClick={() => setActiveTab('write')}
          >
            <FiEdit className="mr-1" />
            Write
          </button>
          <button
            type="button"
            className={`tab-button ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            <FiEye className="mr-1" />
            Preview
          </button>
        </div>
        
        <div className="toolbar-actions">
          {activeTab === 'write' && (
            <>
              <button
                type="button"
                className="toolbar-btn"
                onClick={() => insertMarkdown('**', '**')}
                title="Bold (Ctrl+B)"
              >
                <strong>B</strong>
              </button>
              <button
                type="button"
                className="toolbar-btn"
                onClick={() => insertMarkdown('*', '*')}
                title="Italic (Ctrl+I)"
              >
                <em>I</em>
              </button>
              <button
                type="button"
                className="toolbar-btn"
                onClick={() => insertLinePrefix('## ')}
                title="Heading"
              >
                H
              </button>
              <button
                type="button"
                className="toolbar-btn"
                onClick={() => insertLinePrefix('- ')}
                title="Bullet List"
              >
                •
              </button>
              <button
                type="button"
                className="toolbar-btn"
                onClick={() => insertLinePrefix('1. ')}
                title="Numbered List"
              >
                1.
              </button>
              <button
                type="button"
                className="toolbar-btn"
                onClick={() => insertLinePrefix('> ')}
                title="Quote"
              >
                "
              </button>
              <button
                type="button"
                className="toolbar-btn"
                onClick={() => insertMarkdown('`', '`')}
                title="Code"
              >
                {'</>'}
              </button>
              <button
                type="button"
                className="toolbar-btn"
                onClick={() => insertLink()}
                title="Link (Ctrl+K)"
              >
                🔗
              </button>
              <div className="toolbar-divider" />
            </>
          )}
          
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => setShowHelp(!showHelp)}
            title="Markdown Help"
          >
            <FiInfo />
          </button>
          
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <FiMinimize2 /> : <FiMaximize2 />}
          </button>
        </div>
      </div>

      {showHelp && (
        <div className="markdown-help">
          <div className="help-grid">
            {markdownHelp.map((item, idx) => (
              <div key={idx} className="help-item">
                <code>{item.syntax}</code>
                <span>→</span>
                <span>{item.result}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="markdown-content" style={{ height: isFullscreen ? 'calc(100vh - 120px)' : height }}>
        {activeTab === 'write' ? (
          <div className="markdown-write">
            <textarea
              ref={textareaRef}
              id="markdown-textarea"
              value={value}
              onChange={(e) => onChange(maxLength ? e.target.value.slice(0, maxLength) : e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder || "Write your content here...\n\nYou can use **bold**, *italic*, [links](url), and more!"}
              className="markdown-textarea"
              maxLength={maxLength || undefined}
            />
            {maxLength && (
              <div className="markdown-footer">
                <span className="char-count">
                  {value.length} / {maxLength}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="markdown-preview">
            {value ? (
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ node, ...props }) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" />
                  ),
                }}
              >
                {value}
              </ReactMarkdown>
            ) : (
              <p className="preview-empty">Nothing to preview</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkdownEditor;