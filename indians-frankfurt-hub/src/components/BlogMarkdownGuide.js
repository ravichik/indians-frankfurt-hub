import React, { useState } from 'react';
import { FiInfo, FiX, FiCopy, FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const BlogMarkdownGuide = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const examples = [
    {
      title: 'Headers',
      markdown: `# H1 Header - Main Title
## H2 Header - Section Title
### H3 Header - Subsection
#### H4 Header - Sub-subsection`,
      description: 'Use headers to structure your content'
    },
    {
      title: 'Text Formatting',
      markdown: `**Bold text** for emphasis
*Italic text* for subtle emphasis
***Bold and italic***
~~Strikethrough text~~
\`inline code\` for technical terms`,
      description: 'Format text to improve readability'
    },
    {
      title: 'Lists',
      markdown: `**Bullet List:**
- First item
- Second item
  - Nested item
  - Another nested item

**Numbered List:**
1. First step
2. Second step
   a. Sub-step
   b. Another sub-step`,
      description: 'Organize information with lists'
    },
    {
      title: 'Links & Images',
      markdown: `[Link text](https://example.com)
![Alt text for image](https://example.com/image.jpg)
[Link with title](https://example.com "Hover text")`,
      description: 'Add links and images to enrich content'
    },
    {
      title: 'Quotes & Code Blocks',
      markdown: `> This is a blockquote
> It can span multiple lines
> 
> With paragraphs

\`\`\`javascript
// Code block with syntax highlighting
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\``,
      description: 'Quote sources and show code examples'
    },
    {
      title: 'Tables',
      markdown: `| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
| Data 4   | Data 5   | Data 6   |`,
      description: 'Present data in organized tables'
    },
    {
      title: 'Horizontal Rule & Line Breaks',
      markdown: `First paragraph

---

Second section (after horizontal rule)

Line with  
forced break (two spaces at end)`,
      description: 'Separate sections and control spacing'
    },
    {
      title: 'Advanced Tips',
      markdown: `**Emoji Support:** 🎉 😊 🚀

**Task Lists:**
- [x] Completed task
- [ ] Pending task

**Footnotes:**
Here's a sentence with a footnote[^1].
[^1]: This is the footnote.

**HTML Support:**
<kbd>Ctrl</kbd> + <kbd>C</kbd>
<mark>Highlighted text</mark>`,
      description: 'Advanced formatting options'
    }
  ];

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors text-sm font-medium"
        type="button"
      >
        <FiInfo className="mr-1.5" />
        Markdown Guide
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Markdown Formatting Guide
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                <p className="text-gray-600 mb-6">
                  Use these markdown formatting options to create beautiful, well-structured blog posts:
                </p>

                <div className="space-y-6">
                  {examples.map((example, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{example.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{example.description}</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(example.markdown, index)}
                          className="p-2 hover:bg-white rounded-lg transition-colors"
                          title="Copy to clipboard"
                        >
                          {copiedIndex === index ? (
                            <FiCheck className="w-4 h-4 text-green-600" />
                          ) : (
                            <FiCopy className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                      </div>
                      <pre className="bg-white border rounded-lg p-3 text-sm overflow-x-auto">
                        <code>{example.markdown}</code>
                      </pre>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-primary-50 rounded-lg">
                  <h3 className="font-semibold text-primary-900 mb-2">
                    💡 Pro Tips for Better Blog Posts
                  </h3>
                  <ul className="space-y-2 text-sm text-primary-800">
                    <li>• Use headers to create a clear structure and table of contents</li>
                    <li>• Break long content into sections with horizontal rules (---)</li>
                    <li>• Use bullet points for easy-to-scan information</li>
                    <li>• Add images to make your posts more engaging</li>
                    <li>• Use code blocks with language specification for syntax highlighting</li>
                    <li>• Keep paragraphs short for better readability</li>
                    <li>• Use blockquotes to highlight important information or quotes</li>
                    <li>• Add emojis to make your content more friendly and engaging</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BlogMarkdownGuide;