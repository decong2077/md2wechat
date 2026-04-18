import { Marked, type Token } from 'marked';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-python';

/**
 * 微信极致兼容版行内样式 - 优先使用 table 替代 flex
 */
const S = {
  h1: 'font-size: 1.8em; font-weight: bold; margin-top: 1.4em; margin-bottom: 0.6em; color: #373530; border-bottom: 1px solid #E9E9E8; padding-bottom: 0.3em; line-height: 1.3; display: block;',
  h2: 'font-size: 1.4em; font-weight: bold; margin-top: 1.3em; margin-bottom: 0.5em; color: #373530; line-height: 1.3; display: block;',
  h3: 'font-size: 1.2em; font-weight: bold; margin-top: 1.2em; margin-bottom: 0.4em; color: #373530; line-height: 1.3; display: block;',
  h4: 'font-size: 1.1em; font-weight: bold; margin-top: 1.1em; margin-bottom: 0.3em; color: #373530; line-height: 1.3; display: block;',
  h5: 'font-size: 1em; font-weight: bold; margin-top: 1em; margin-bottom: 0.3em; color: #373530; line-height: 1.3; display: block;',
  h6: 'font-size: 1em; font-weight: bold; margin-top: 1em; margin-bottom: 0.3em; color: #787774; line-height: 1.3; display: block;',
  p: 'font-size: 16px; line-height: 1.8; margin: 1em 0; color: #373530; word-wrap: break-word; display: block;',
  strong: 'font-weight: bold !important; color: #000000 !important; display: inline !important;',
  em: 'font-style: italic !important; display: inline !important;',
  del: 'text-decoration: line-through !important; color: #787774 !important; display: inline !important;',
  u: 'text-decoration: underline !important; display: inline !important;',
  mark: 'background-color: #FAF3DD !important; color: #373530 !important; padding: 0 2px; border-radius: 2px; display: inline !important;',
  code: 'font-family: Menlo, Monaco, Consolas, monospace; font-size: 0.9em; background: #F7F6F3; padding: 0.2em 0.4em; border-radius: 3px; color: #373530; font-weight: 500; display: inline !important;',
  pre: 'background: #F7F6F3; padding: 1.2em; border-radius: 5px; overflow-x: auto; margin: 1.2em 0; line-height: 1.5; font-size: 14px; border: 1px solid #E9E9E8; display: block;',
  blockquote: 'margin: 1.5em 0; padding: 0.5em 1.2em; border-left: 4px solid #373530; color: #373530; background: #F1F1EF; border-radius: 3px; display: block;',
  ul: 'margin: 1em 0; padding-left: 1.5em; list-style-type: disc; display: block;',
  ol: 'margin: 1em 0; padding-left: 1.5em; list-style-type: decimal; display: block;',
  li: 'margin: 0.5em 0; line-height: 1.6; display: list-item;',
  hr: 'border: none; border-top: 1px solid #E9E9E8; margin: 2em 0; display: block;',
  a: 'color: #487CA5; text-decoration: underline; display: inline;',
  img: 'max-width: 100%; border-radius: 4px; margin: 1.5em auto; display: block;',
  // 微信后台表格滑动专用方案
  tableWrapper: 'width: 100%; overflow-x: auto; margin: 1.5em 0; border-radius: 4px; border: 1px solid #E9E9E8; display: block; -webkit-overflow-scrolling: touch;',
  table: 'border-collapse: collapse; min-width: 100%; margin: 0; font-size: 14px; display: table;',
  th: 'border: 1px solid #E9E9E8; padding: 10px 14px; background: #F7F6F3; font-weight: bold; text-align: left; white-space: nowrap; display: table-cell; color: #373530;',
  td: 'border: 1px solid #E9E9E8; padding: 10px 14px; text-align: left; min-width: 100px; display: table-cell; color: #373530;',
};

export class MarkdownEngine {
  private markedInstance: Marked;
  private footnotes: { title: string; url: string }[] = [];

  constructor() {
    this.markedInstance = new Marked();
    this.setup();
  }

  private setup() {
    const self = this;
    const extensions: any[] = [
      {
        name: 'underline',
        level: 'inline',
        start(src: string) { return src.indexOf('<u>'); },
        tokenizer(src: string) {
          const match = /^<u>([\s\S]+?)<\/u>/.exec(src);
          if (match) return { type: 'underline', raw: match[0], text: match[1] };
        },
        renderer(token: any) { return `<span style="${S.u}">${(this as any).parser.parseInline(token.tokens || [])}</span>`; }
      },
      {
        name: 'mark',
        level: 'inline',
        start(src: string) { return src.indexOf('=='); },
        tokenizer(src: string) {
          const match = /^==([\s\S]+?)==/.exec(src);
          if (match) return { type: 'mark', raw: match[0], text: match[1] };
        },
        renderer(token: any) { return `<mark style="${S.mark}">${(this as any).parser.parseInline(token.tokens || [])}</mark>`; }
      }
    ];

    this.markedInstance.use({
      gfm: true,
      breaks: true,
      extensions,
      renderer: {
        strong({ text }: any) { return `<strong style="${S.strong}">${text}</strong>`; },
        em({ text }: any) { return `<em style="${S.em}">${text}</em>`; },
        del({ text }: any) { return `<del style="${S.del}">${text}</del>`; },
        codespan({ text }: any) { return `<code style="${S.code}">${text}</code>`; },
        heading({ text, depth }: any) {
          const styles = [S.h1, S.h2, S.h3, S.h4, S.h5, S.h6];
          const style = styles[depth - 1] || S.h3;
          return `<h${depth} style="${style}">${text}</h${depth}>`;
        },
        paragraph({ text }: any) { return `<p style="${S.p}">${text}</p>`; },
        blockquote({ text }: any) { return `<blockquote style="${S.blockquote}">${text}</blockquote>`; },
        hr() { return `<hr style="${S.hr}" />`; },
        list(token: any) {
          const tag = token.ordered ? 'ol' : 'ul';
          const style = token.ordered ? S.ol : S.ul;
          const body = token.items.map((item: any) => {
            const checked = item.task ? (item.checked ? '☑️ ' : '⬜ ') : '';
            return `<li style="${S.li}">${checked}${item.text}</li>`;
          }).join('');
          return `<${tag} style="${style}">${body}</${tag}>`;
        },
        code({ text, lang }: any) {
          const language = lang || 'javascript';
          let highlighted = text;
          try {
            if (Prism.languages[language]) {
              highlighted = Prism.highlight(text, Prism.languages[language], language);
            }
          } catch (e) {}
          return `<pre style="${S.pre}"><code style="font-family:inherit; white-space:pre;">${highlighted}</code></pre>`;
        },
        link({ href, text }: any) {
          if (href.startsWith('#')) return `<span style="${S.a}">${text}</span>`;
          self.footnotes.push({ title: text, url: href });
          return `<span style="${S.a}">${text}</span><sup style="font-size:10px; color:#787774; margin-left:2px;">[${self.footnotes.length}]</sup>`;
        },
        image({ href, text, title }: any) {
          return `<img src="${href}" alt="${text}" title="${title || ''}" style="${S.img}" />`;
        },
        table({ header, rows }: any) {
          const hHtml = header.map((c: any) => `<th style="${S.th}">${c.text}</th>`).join('');
          const bHtml = rows.map((r: any) => `<tr>${r.map((c: any) => `<td style="${S.td}">${c.text}</td>`).join('')}</tr>`).join('');
          return `<section style="${S.tableWrapper}"><table style="${S.table}"><thead><tr>${hHtml}</tr></thead><tbody>${bHtml}</tbody></table></section>`;
        }
      }
    });
  }

  private renderInline(text: string): string {
    let html = text;
    const placeholders: string[] = [];
    html = html.replace(/`([\s\S]+?)`/g, (_, code) => {
      const id = `⦓${placeholders.length}⦔`;
      placeholders.push(`<code style="${S.code}">${code}</code>`);
      return id;
    });
    const escapePlaceholders: string[] = [];
    html = html.replace(/\\([\*\_\`\#\-\+\>\!\(\)\[\]\\])/g, (_, char) => {
      const id = `⦔${escapePlaceholders.length}⦓`;
      escapePlaceholders.push(char);
      return id;
    });
    html = html.replace(/\*\*\*([\s\S]+?)\*\*\*/g, `<strong style="${S.strong}"><em style="${S.em}">$1</em></strong>`);
    html = html.replace(/\*\*([\s\S]+?)\*\*/g, `<strong style="${S.strong}">$1</strong>`);
    html = html.replace(/__([\s\S]+?)__/g, `<strong style="${S.strong}">$1</strong>`);
    html = html.replace(/\*([\s\S]+?)\*/g, `<em style="${S.em}">$1</em>`);
    html = html.replace(/_([\s\S]+?)_/g, `<em style="${S.em}">$1</em>`);
    html = html.replace(/~~([\s\S]+?)~~/g, `<del style="${S.del}">$1</del>`);
    html = html.replace(/==([\s\S]+?)==/g, `<mark style="${S.mark}">$1</mark>`);
    html = html.replace(/<u>([\s\S]+?)<\/u>/g, `<span style="${S.u}">$1</span>`);
    html = html.replace(/\[([\s\S]+?)\]\(([\s\S]+?)\)/g, (_, label, href) => {
      if (href.startsWith('#')) return `<span style="${S.a}">${label}</span>`;
      this.footnotes.push({ title: label, url: href });
      return `<span style="${S.a}">${label}</span><sup style="font-size:10px; color:#787774; margin-left:2px;">[${this.footnotes.length}]</sup>`;
    });
    escapePlaceholders.forEach((char, i) => { html = html.split(`⦔${i}⦓`).join(char); });
    placeholders.forEach((val, i) => { html = html.split(`⦓${i}⦔`).join(val); });
    return html;
  }

  public render(markdown: string): string {
    this.footnotes = [];
    try {
      let content = markdown;
      const calloutBlocks: string[] = [];

      content = content.replace(/^:::callout\s+([\s\S]+?)\n:::/gm, (_, inner) => {
        const id = `__CALLOUT_BLOCK_${calloutBlocks.length}__`;
        const m = inner.match(/^([\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF])\s?([\s\S]+)$/);
        const icon = m ? m[1] : '💡';
        const text = m ? m[2] : inner;
        
        // 微信适配核心：使用 table 模拟 flex，确保背景色、圆角和对齐在粘贴后不丢失
        const tableStyle = 'width: 100%; margin: 1.5em 0; background: #F1F1EF; border-radius: 4px; border: 1px solid #E9E9E8; border-collapse: separate;';
        calloutBlocks.push(`<table style="${tableStyle}">
          <tr>
            <td style="padding: 1.2em 0.5em 1.2em 1.2em; vertical-align: top; width: 1.5em; font-size: 1.3em; line-height: 1;">${icon}</td>
            <td style="padding: 1.2em 1.2em 1.2em 0.5em; vertical-align: top; color: #373530; font-size: 16px; line-height: 1.6;">${this.renderInline(text.trim())}</td>
          </tr>
        </table>`);
        return `\n\n${id}\n\n`;
      });

      const tokens = this.markedInstance.lexer(content);
      let html = '';

      tokens.forEach((token: Token) => {
        switch (token.type) {
          case 'heading':
            const hStyle = ([S.h1, S.h2, S.h3, S.h4, S.h5, S.h6] as any)[token.depth - 1] || S.h3;
            html += `<h${token.depth} style="${hStyle}">${this.renderInline(token.text)}</h${token.depth}>`;
            break;
          case 'paragraph':
            const pText = token.text.trim();
            if (pText.startsWith('__CALLOUT_BLOCK_') && pText.endsWith('__')) {
              html += pText;
            } else {
              html += `<p style="${S.p}">${this.renderInline(token.text)}</p>`;
            }
            break;
          case 'blockquote':
            html += `<blockquote style="${S.blockquote}">${this.render(token.text)}</blockquote>`;
            break;
          case 'list':
            const tag = token.ordered ? 'ol' : 'ul';
            const lStyle = token.ordered ? S.ol : S.ul;
            let listBody = '';
            token.items.forEach((item: any) => {
              const content = item.task ? `${item.checked ? '☑️' : '⬜'} ${item.text}` : item.text;
              listBody += `<li style="${S.li}">${this.renderInline(content)}</li>`;
            });
            html += `<${tag} style="${lStyle}">${listBody}</${tag}>`;
            break;
          case 'code':
            let highlighted = token.text;
            try { if (Prism.languages[token.lang || 'javascript']) { highlighted = Prism.highlight(token.text, Prism.languages[token.lang || 'javascript'], token.lang || 'javascript'); } } catch (e) {}
            html += `<pre style="${S.pre}"><code style="font-family:inherit; white-space:pre;">${highlighted}</code></pre>`;
            break;
          case 'table':
            const header = token.header.map((c: any) => `<th style="${S.th}">${this.renderInline(c.text)}</th>`).join('');
            const rows = token.rows.map((r: any) => `<tr>${r.map((c: any) => `<td style="${S.td}">${this.renderInline(c.text)}</td>`).join('')}</tr>`).join('');
            // 使用 section 包装 table 增加微信后台的识别率
            html += `<section style="${S.tableWrapper}"><table style="${S.table}"><thead><tr>${header}</tr></thead><tbody>${rows}</tbody></table></section>`;
            break;
          case 'hr': html += `<hr style="${S.hr}" />`; break;
          default: html += token.raw;
        }
      });

      calloutBlocks.forEach((blockHtml, i) => { html = html.replace(`__CALLOUT_BLOCK_${i}__`, blockHtml); });

      if (this.footnotes.length > 0) {
        html += '<div style="margin-top:40px; border-top:1px solid #E9E9E8; padding-top:20px; display:block;">';
        html += '<h4 style="font-size:14px; font-weight:bold; color:#787774; margin-bottom:12px; display:block;">参考资料</h4>';
        this.footnotes.forEach((fn, i) => { html += `<p style="font-size:12px; color:#787774; margin:6px 0; line-height:1.6; display:block;">[${i + 1}] ${fn.title}: ${fn.url}</p>`; });
        html += '</div>';
      }
      return html;
    } catch (e) { return `<p style="color:red;">Render Error: ${e}</p>`; }
  }
}

export const engine = new MarkdownEngine();
