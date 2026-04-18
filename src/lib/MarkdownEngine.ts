import { marked } from 'marked';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-python';

const STYLES = {
  h1: 'font-size: 2em; font-weight: bold; margin-top: 1.6em; margin-bottom: 0.6em; color: #373530; border-bottom: 1px solid #E9E9E8; padding-bottom: 0.3em; line-height: 1.3; display: block;',
  h2: 'font-size: 1.5em; font-weight: bold; margin-top: 1.5em; margin-bottom: 0.5em; color: #373530; line-height: 1.3; display: block;',
  h3: 'font-size: 1.25em; font-weight: bold; margin-top: 1.4em; margin-bottom: 0.4em; color: #373530; line-height: 1.3; display: block;',
  p: 'font-size: 16px; line-height: 1.8; margin: 1em 0; color: #373530; word-wrap: break-word; display: block;',
  strong: 'font-weight: bold !important; color: #000000 !important; display: inline !important;',
  em: 'font-style: italic !important; display: inline !important;',
  del: 'text-decoration: line-through !important; color: #787774 !important; display: inline !important;',
  u: 'text-decoration: underline !important; display: inline !important;',
  mark: 'background-color: #FAF3DD !important; color: #373530 !important; padding: 0 2px; border-radius: 2px; display: inline !important;',
  code: 'font-family: Menlo, Monaco, Consolas, monospace; font-size: 0.9em; background: #F7F6F3; padding: 0.2em 0.4em; border-radius: 3px; color: #373530; font-weight: 500; display: inline !important;',
  pre: 'background: #F7F6F3; padding: 1em; border-radius: 5px; overflow-x: auto; margin: 1.2em 0; line-height: 1.5; font-size: 14px; border: 1px solid #E9E9E8; display: block;',
  blockquote: 'margin: 1.5em 0; padding: 0.5em 1.2em; border-left: 4px solid #373530; color: #373530; background: #F1F1EF; border-radius: 3px; display: block;',
  ul: 'margin: 1em 0; padding-left: 1.5em; list-style-type: disc; display: block;',
  ol: 'margin: 1em 0; padding-left: 1.5em; list-style-type: decimal; display: block;',
  li: 'margin: 0.5em 0; line-height: 1.6; display: list-item;',
  hr: 'border: none; border-top: 1px solid #E9E9E8; margin: 2em 0; display: block;',
  a: 'color: #487CA5; text-decoration: underline; display: inline;',
  tableWrapper: 'width: 100%; overflow-x: auto; margin: 1.5em 0; border-radius: 4px; border: 1px solid #E9E9E8; display: block;',
  table: 'border-collapse: collapse; min-width: 100%; margin: 0; font-size: 14px; display: table;',
  th: 'border: 1px solid #E9E9E8; padding: 10px 14px; background: #F7F6F3; font-weight: bold; text-align: left; white-space: nowrap; display: table-cell;',
  td: 'border: 1px solid #E9E9E8; padding: 10px 14px; text-align: left; min-width: 100px; display: table-cell;',
};

export class MarkdownEngine {
  private footnotes: { title: string; url: string }[] = [];

  private renderInline(text: string): string {
    let html = text;
    const placeholders: string[] = [];

    // 1. 保护行内代码：使用特殊符号 ⦓...⦔ 避免被后续的下划线/星号正则匹配
    html = html.replace(/`([\s\S]+?)`/g, (_, code) => {
      const id = `⦓${placeholders.length}⦔`;
      placeholders.push(`<code style="${STYLES.code}">${code}</code>`);
      return id;
    });

    // 2. 保护转义字符：将 \\, \*, \_ 等转换为临时占位符，防止触发样式
    const escapePlaceholders: string[] = [];
    html = html.replace(/\\([\*\_\`\#\-\+\>\!\(\)\[\]\\])/g, (_, char) => {
      const id = `⦔${escapePlaceholders.length}⦓`;
      escapePlaceholders.push(char);
      return id;
    });

    // 3. 解析 Markdown 强调格式 (此时占位符中没有 * 或 _)
    html = html.replace(/\*\*\*([\s\S]+?)\*\*\*/g, `<strong style="${STYLES.strong}"><em style="${STYLES.em}">$1</em></strong>`);
    html = html.replace(/\*\*([\s\S]+?)\*\*/g, `<strong style="${STYLES.strong}">$1</strong>`);
    html = html.replace(/__([\s\S]+?)__/g, `<strong style="${STYLES.strong}">$1</strong>`);
    html = html.replace(/\*([\s\S]+?)\*/g, `<em style="${STYLES.em}">$1</em>`);
    html = html.replace(/_([\s\S]+?)_/g, `<em style="${STYLES.em}">$1</em>`);
    html = html.replace(/~~([\s\S]+?)~~/g, `<del style="${STYLES.del}">$1</del>`);
    html = html.replace(/==([\s\S]+?)==/g, `<mark style="${STYLES.mark}">$1</mark>`);
    html = html.replace(/<u>([\s\S]+?)<\/u>/g, `<span style="${STYLES.u}">$1</span>`);

    // 4. 解析链接
    html = html.replace(/\[([\s\S]+?)\]\(([\s\S]+?)\)/g, (_, label, href) => {
      if (href.startsWith('#')) return `<span style="${STYLES.a}">${label}</span>`;
      this.footnotes.push({ title: label, url: href });
      return `<span style="${STYLES.a}">${label}</span><sup style="font-size:10px; color:#787774; margin-left:2px;">[${this.footnotes.length}]</sup>`;
    });

    // 5. 还原转义字符
    escapePlaceholders.forEach((char, i) => {
      html = html.split(`⦔${i}⦓`).join(char);
    });

    // 6. 还原行内代码
    placeholders.forEach((val, i) => {
      html = html.split(`⦓${i}⦔`).join(val);
    });

    return html;
  }

  public render(markdown: string): string {
    this.footnotes = [];
    try {
      const tokens = marked.lexer(markdown);
      let html = '';

      tokens.forEach(token => {
        switch (token.type) {
          case 'heading':
            const hStyle = [STYLES.h1, STYLES.h2, STYLES.h3, STYLES.h3, STYLES.h3, STYLES.h3][token.depth - 1];
            html += `<h${token.depth} style="${hStyle}">${this.renderInline(token.text)}</h${token.depth}>`;
            break;
          case 'paragraph':
            html += `<p style="${STYLES.p}">${this.renderInline(token.text)}</p>`;
            break;
          case 'blockquote':
            html += `<blockquote style="${STYLES.blockquote}">${this.render(token.text)}</blockquote>`;
            break;
          case 'list':
            const tag = token.ordered ? 'ol' : 'ul';
            const lStyle = token.ordered ? STYLES.ol : STYLES.ul;
            let listBody = '';
            token.items.forEach(item => {
              const content = item.task ? `${item.checked ? '☑️' : '⬜'} ${item.text}` : item.text;
              listBody += `<li style="${STYLES.li}">${this.renderInline(content)}</li>`;
            });
            html += `<${tag} style="${lStyle}">${listBody}</${tag}>`;
            break;
          case 'code':
            let highlighted = token.text;
            try {
              if (Prism.languages[token.lang || 'javascript']) {
                highlighted = Prism.highlight(token.text, Prism.languages[token.lang || 'javascript'], token.lang || 'javascript');
              }
            } catch (e) {}
            html += `<pre style="${STYLES.pre}"><code style="font-family:inherit; white-space:pre;">${highlighted}</code></pre>`;
            break;
          case 'table':
            const header = token.header.map(c => `<th style="${STYLES.th}">${this.renderInline(c.text)}</th>`).join('');
            const rows = token.rows.map(r => `<tr>${r.map(c => `<td style="${STYLES.td}">${this.renderInline(c.text)}</td>`).join('')}</tr>`).join('');
            html += `<div style="${STYLES.tableWrapper}"><table style="${STYLES.table}"><thead><tr>${header}</tr></thead><tbody>${rows}</tbody></table></div>`;
            break;
          case 'hr':
            html += `<hr style="${STYLES.hr}" />`;
            break;
          case 'space':
            break;
          default:
            if (token.raw.startsWith(':::callout')) {
              const match = token.raw.match(/:::callout ([\s\S]+?) :::/);
              if (match) {
                const inner = match[1];
                const m = inner.match(/^([\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF])\s?([\s\S]+)$/);
                html += `<div style="margin:1em 0; padding:1.2em; background:#F1F1EF; border-radius:4px; display:flex; align-items:flex-start; gap:0.8em;">
                  <div style="font-size:1.2em;">${m ? m[1] : '💡'}</div>
                  <div style="flex:1; color:#373530; font-size:16px; line-height:1.6;">${this.renderInline(m ? m[2] : inner)}</div>
                </div>`;
              }
            }
        }
      });

      if (this.footnotes.length > 0) {
        html += '<div style="margin-top:40px; border-top:1px solid #E9E9E8; padding-top:20px; display:block;">';
        html += '<h4 style="font-size:14px; font-weight:bold; color:#787774; margin-bottom:12px; display:block;">参考资料</h4>';
        this.footnotes.forEach((fn, i) => {
          html += `<p style="font-size:12px; color:#787774; margin:6px 0; line-height:1.6; display:block;">[${i + 1}] ${fn.title}: ${fn.url}</p>`;
        });
        html += '</div>';
      }

      return html;
    } catch (e) {
      return `<p style="color:red;">Render Error: ${e}</p>`;
    }
  }
}

export const engine = new MarkdownEngine();
