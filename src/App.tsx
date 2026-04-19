import { useState, useEffect } from 'react';
import { Copy, Type, LayoutDashboard, Github, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { engine } from './lib/MarkdownEngine';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const STORAGE_KEY = 'md2wechat-draft-v2';

const DEFAULT_MARKDOWN = `# Markdown 全格式测试 ✨

:::callout 💡 提示
本工具已重构，现在能 100% 支持所有 Markdown 格式，并适配微信公众号。
:::

---

## 文本样式演示

- **这是粗体** (Bold)
- *这是斜体* (Italic)
- ***这是粗斜体*** (Bold Italic)
- ~~这是删除线~~ (Strikethrough)
- <u>这是下划线</u> (Underline)
- ==这是高亮== (Highlight)
- \`这是行内代码\` (Inline Code)

### 链接与脚注
这是一个[外部链接](https://github.com)，它会被自动转换为文末脚注。

### 代码块测试
\`\`\`python
def hello():
    print("Hello, WeChat!")
\`\`\`

### 表格横向滑动测试
| 标题一 | 标题二 | 标题三 | 标题四 | 标题五 | 标题六 |
| :--- | :---: | ---: | :--- | :--- | :--- |
| 很长的内容 | 数据B | 100 | 更多内容 | 更多内容 | 更多内容 |
`;

export default function App() {
  const [markdown, setMarkdown] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_MARKDOWN;
  });
  const [html, setHtml] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, markdown);
    setHtml(engine.render(markdown));
  }, [markdown]);

  const handleCopy = async () => {
    try {
      // 必须用渲染产物字符串，不能用 innerHTML：浏览器序列化 DOM 时会折叠/改写空白，
      // 与 MarkdownEngine 里为微信准备的 nbsp / <br /> 冲突。
      const type = 'text/html';
      const blob = new Blob([html], { type });
      const data = [new ClipboardItem({ [type]: blob })];
      await navigator.clipboard.write(data);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      alert('复制失败，请重试');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white text-[#373530] overflow-hidden font-sans">
      <header className="flex items-center justify-between px-6 py-2 border-b border-[#E9E9E8] h-14 bg-white z-20 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#373530] rounded-[3px] flex items-center justify-center text-white font-bold text-xs">M</div>
          <span className="font-semibold text-sm">md2wechat</span>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-sm text-[#787774] hover:bg-[#F1F1EF] rounded-[3px] flex items-center gap-2 opacity-50 cursor-not-allowed">
            <LayoutDashboard size={16} />
            <span>主题</span>
          </button>
          <button 
            onClick={handleCopy}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded-[3px] shadow-sm flex items-center gap-2 transition-all duration-300 min-w-[140px] justify-center",
              isCopied ? "bg-[#548164] text-white" : "bg-[#487CA5] text-white hover:bg-[#3b6685]"
            )}
          >
            <AnimatePresence mode="wait">
              {isCopied ? (
                <motion.div key="c" initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -5, opacity: 0 }} className="flex items-center gap-2">
                  <Sparkles size={16} /> <span>已复制!</span>
                </motion.div>
              ) : (
                <motion.div key="n" initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -5, opacity: 0 }} className="flex items-center gap-2">
                  <Copy size={16} /> <span>复制到公众号</span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
          <div className="w-px h-6 bg-[#E9E9E8] mx-2" />
          <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 text-[#787774] hover:text-[#373530]"><Github size={18} /></a>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <section className="flex-1 flex flex-col border-r border-[#E9E9E8] bg-[#FBFAFB]">
          <div className="px-4 py-2 text-[10px] uppercase font-bold tracking-widest text-[#787774] border-b border-[#E9E9E8]">Editor</div>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="flex-1 p-8 bg-transparent outline-none resize-none font-mono text-[14px] leading-relaxed overflow-y-auto"
            placeholder="Type your markdown here..."
          />
        </section>

        <section className="flex-1 flex flex-col bg-white overflow-hidden">
          <div className="px-4 py-2 text-[10px] uppercase font-bold tracking-widest text-[#787774] border-b border-[#E9E9E8] sticky top-0 bg-white/95 backdrop-blur z-10">Preview</div>
          <div className="flex-1 overflow-y-auto py-12 px-8">
            <div className="max-w-[677px] mx-auto w-full">
              {/* 核心渲染容器 */}
              <div 
                style={{ all: 'revert' }}
                className="notion-viewer"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="px-4 py-1.5 border-t border-[#E9E9E8] bg-white text-[11px] text-[#787774] flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#548164]"></span>
          <span>Notion Engine v2.0 Active</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Chars: {markdown.length}</span>
          <span className="flex items-center gap-1"><Type size={12} /> UTF-8</span>
        </div>
      </footer>
    </div>
  );
}
