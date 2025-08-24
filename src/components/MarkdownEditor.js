import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FiEye, FiEdit, FiMaximize2, FiMinimize2, FiInfo } from 'react-icons/fi';
import './MarkdownEditor.css';

const MarkdownEditor = ({ value, onChange, placeholder, height = '300px', maxLength = 2000 }) => {
  const [activeTab, setActiveTab] = useState('write');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

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
    const textarea = document.getElementById('markdown-textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    if (newText.length <= maxLength) {
      onChange(newText);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
      }, 0);
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
          insertMarkdown('[', '](url)');
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
                onClick={() => insertMarkdown('## ', '')}
                title="Heading"
              >
                H
              </button>
              <button
                type="button"
                className="toolbar-btn"
                onClick={() => insertMarkdown('- ', '')}
                title="Bullet List"
              >
                •
              </button>
              <button
                type="button"
                className="toolbar-btn"
                onClick={() => insertMarkdown('1. ', '')}
                title="Numbered List"
              >
                1.
              </button>
              <button
                type="button"
                className="toolbar-btn"
                onClick={() => insertMarkdown('> ', '')}
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
                onClick={() => insertMarkdown('[', '](url)')}
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
              id="markdown-textarea"
              value={value}
              onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
              onKeyDown={handleKeyDown}
              placeholder={placeholder || "Write your content here...\n\nYou can use **bold**, *italic*, [links](url), and more!"}
              className="markdown-textarea"
              maxLength={maxLength}
            />
            <div className="markdown-footer">
              <span className="char-count">
                {value.length} / {maxLength}
              </span>
            </div>
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