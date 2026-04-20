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
 * 提供两套主题：notion（默认）和 elegant（淡雅）
 */

export type Theme = 'notion' | 'elegant';

// Notion 风格 - 默认主题，清晰干练
const THEME_NOTION = {
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
  pre: 'background: #F7F6F3; padding: 1.2em; border-radius: 5px; overflow-x: auto; margin: 1.2em 0; line-height: 1.5; font-size: 14px; border: 1px solid #E9E9E8; display: block; white-space: pre-wrap; word-wrap: break-word;',
  codeBlock: 'font-family: Menlo, Monaco, Consolas, monospace; white-space: pre-wrap; word-wrap: break-word; display: block;',
  blockquote: 'margin: 1.5em 0; padding: 0.5em 1.2em; border-left: 4px solid #373530; color: #373530; background: #F1F1EF; border-radius: 3px; display: block;',
  ul: 'margin: 1em 0; padding-left: 1.5em; list-style-type: disc; display: block;',
  ol: 'margin: 1em 0; padding-left: 1.5em; list-style-type: decimal; display: block;',
  ulNested: 'margin: 0.35em 0; padding-left: 1.5em; display: block;',
  olNested: 'margin: 0.35em 0; padding-left: 1.5em; list-style-type: decimal; display: block;',
  li: 'margin: 0.5em 0; line-height: 1.6; display: list-item;',
  hr: 'border: none; border-top: 1px solid #E9E9E8; margin: 2em 0; display: block;',
  a: 'color: #487CA5; text-decoration: underline; display: inline;',
  img: 'max-width: 100%; border-radius: 4px; margin: 1.5em auto; display: block;',
  tableWrapper: 'width: 100%; overflow-x: auto; margin: 1.5em 0; border-radius: 4px; border: 1px solid #E9E9E8; display: block; -webkit-overflow-scrolling: touch;',
  table: 'border-collapse: collapse; min-width: 100%; margin: 0; font-size: 14px; display: table;',
  th: 'border: 1px solid #E9E9E8; padding: 10px 14px; background: #F7F6F3; font-weight: bold; text-align: left; white-space: nowrap; display: table-cell; color: #373530;',
  td: 'border: 1px solid #E9E9E8; padding: 10px 14px; text-align: left; min-width: 100px; display: table-cell; color: #373530;',
};

// Elegant 风格 - 淡雅主题，更柔和优雅
const THEME_ELEGANT = {
  h1: 'font-size: 1.8em; font-weight: 700; margin-top: 1.6em; margin-bottom: 0.5em; color: #2C2C2A; border-bottom: 1px solid #E5E5E3; padding-bottom: 0.35em; line-height: 1.25; display: block; letter-spacing: -0.01em;',
  h2: 'font-size: 1.45em; font-weight: 600; margin-top: 1.5em; margin-bottom: 0.45em; color: #3A3A38; line-height: 1.3; display: block; letter-spacing: -0.005em;',
  h3: 'font-size: 1.2em; font-weight: 600; margin-top: 1.4em; margin-bottom: 0.4em; color: #444442; line-height: 1.35; display: block;',
  h4: 'font-size: 1.1em; font-weight: 500; margin-top: 1.3em; margin-bottom: 0.35em; color: #4A4A48; line-height: 1.4; display: block;',
  h5: 'font-size: 1em; font-weight: 500; margin-top: 1.2em; margin-bottom: 0.3em; color: #525250; line-height: 1.4; display: block;',
  h6: 'font-size: 0.95em; font-weight: 500; margin-top: 1.1em; margin-bottom: 0.3em; color: #6B6B69; line-height: 1.4; display: block;',
  p: 'font-size: 16px; line-height: 1.9; margin: 1.2em 0; color: #3D3D3B; word-wrap: break-word; display: block;',
  strong: 'font-weight: 600 !important; color: #1A1A18 !important; display: inline !important;',
  em: 'font-style: italic !important; color: #4A4A48 !important; display: inline !important;',
  del: 'text-decoration: line-through !important; color: #8A8A88 !important; display: inline !important;',
  u: 'text-decoration: underline !important; text-decoration-color: #9A9A98 !important; display: inline !important;',
  mark: 'background-color: #FEF3C7 !important; color: #3D3D3B !important; padding: 0.15em 0.3em; border-radius: 3px; display: inline !important;',
  code: 'font-family: Menlo, Monaco, Consolas, "SF Mono", monospace; font-size: 0.88em; background: #F5F5F3; padding: 0.2em 0.5em; border-radius: 4px; color: #4A4A48; font-weight: 500; display: inline !important;',
  pre: 'background: #FAFAF8; padding: 1.4em; border-radius: 6px; overflow-x: auto; margin: 1.5em 0; line-height: 1.65; font-size: 14px; border: 1px solid #EDEDEB; display: block; white-space: pre-wrap; word-wrap: break-word;',
  codeBlock: 'font-family: Menlo, Monaco, Consolas, "SF Mono", monospace; white-space: pre-wrap; word-wrap: break-word; display: block;',
  blockquote: 'margin: 1.8em 0; padding: 0.8em 1.4em; border-left: 3px solid #C5C5C3; color: #525250; background: #FAFAF8; border-radius: 0 4px 4px 0; display: block;',
  ul: 'margin: 1.2em 0; padding-left: 1.8em; list-style-type: disc; display: block;',
  ol: 'margin: 1.2em 0; padding-left: 1.8em; list-style-type: decimal; display: block;',
  ulNested: 'margin: 0.5em 0; padding-left: 1.5em; display: block;',
  olNested: 'margin: 0.5em 0; padding-left: 1.5em; list-style-type: decimal; display: block;',
  li: 'margin: 0.6em 0; line-height: 1.7; display: list-item; color: #3D3D3B;',
  hr: 'border: none; border-top: 1px solid #E5E5E3; margin: 2.5em 0; display: block;',
  a: 'color: #2563AB; text-decoration: underline; text-decoration-color: #93C5FD; display: inline;',
  img: 'max-width: 100%; border-radius: 6px; margin: 1.5em auto; display: block;',
  tableWrapper: 'width: 100%; overflow-x: auto; margin: 1.5em 0; border-radius: 6px; border: 1px solid #EDEDEB; display: block; -webkit-overflow-scrolling: touch;',
  table: 'border-collapse: collapse; min-width: 100%; margin: 0; font-size: 14px; display: table;',
  th: 'border: 1px solid #EDEDEB; padding: 12px 16px; background: #FAFAF8; font-weight: 600; text-align: left; white-space: nowrap; display: table-cell; color: #3A3A38;',
  td: 'border: 1px solid #EDEDEB; padding: 12px 16px; text-align: left; min-width: 100px; display: table-cell; color: #3D3D3B;',
};

const THEMES: Record<Theme, typeof THEME_NOTION> = {
  notion: THEME_NOTION,
  elegant: THEME_ELEGANT,
};

/** 与 src/index.css 中 Prism 主题一致；补充常见 token，供微信粘贴（无外链 CSS）时保留配色 */
const PRISM_STYLES: Record<string, string> = {
  comment: 'color: #787774;',
  prolog: 'color: #787774;',
  doctype: 'color: #787774;',
  cdata: 'color: #787774;',
  punctuation: 'color: #373530;',
  operator: 'color: #373530;',
  entity: 'color: #373530;',
  url: 'color: #448BBA;',
  variable: 'color: #373530;',
  property: 'color: #EB5757;',
  tag: 'color: #EB5757;',
  boolean: 'color: #EB5757;',
  number: 'color: #EB5757;',
  constant: 'color: #EB5757;',
  symbol: 'color: #EB5757;',
  deleted: 'color: #EB5757;',
  string: 'color: #448BBA;',
  char: 'color: #448BBA;',
  'attr-value': 'color: #448BBA;',
  'attr-name': 'color: #487CA5;',
  'template-string': 'color: #448BBA;',
  'template-punctuation': 'color: #373530;',
  regex: 'color: #548164;',
  keyword: 'color: #487CA5;',
  builtin: 'color: #D9730D;',
  'class-name': 'color: #D9730D;',
  function: 'color: #D9730D;',
  important: 'color: #487CA5; font-weight: bold;',
  atrule: 'color: #487CA5;',
  rule: 'color: #487CA5;',
  selector: 'color: #487CA5;',
  inserted: 'color: #548164;',
};

const PRISM_STYLE_KEYS = Object.keys(PRISM_STYLES).sort((a, b) => b.length - a.length);

const DEFAULT_TOKEN_STYLE = 'color: #373530;';

/** 将 Prism 的 class="token …" 转为行内 style，避免微信后台丢弃外链样式后失色 */
function prismHtmlToInlineStyles(html: string): string {
  return html.replace(/<span\s+class="([^"]*)">/gi, (_, classList: string) => {
    const classes = classList.split(/\s+/).filter(Boolean);
    if (!classes.includes('token')) {
      return `<span class="${classList}">`;
    }
    const types = classes.filter((c) => c !== 'token');
    let style = DEFAULT_TOKEN_STYLE;
    for (const key of PRISM_STYLE_KEYS) {
      if (types.includes(key)) {
        style = PRISM_STYLES[key];
        break;
      }
    }
    return `<span style="${style}">`;
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** 微信后台易折叠空格、忽略换行：仅改写标签外的文本节点 */
function preserveCodeWhitespaceForWeChat(html: string): string {
  return html.split(/(<[^>]*>)/g).map((seg) => {
    if (seg.startsWith('<')) return seg;
    return seg
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/ /g, '\u00a0')
      .replace(/\t/g, '\u00a0\u00a0\u00a0\u00a0')
      .replace(/\n/g, '<br />');
  }).join('');
}


const NESTED_UL_MARKERS = ['circle', 'square', 'disc'] as const;

export class MarkdownEngine {
  private markedInstance: Marked;
  private footnotes: { title: string; url: string }[] = [];
  private currentTheme: Theme = 'notion';

  constructor() {
    this.markedInstance = new Marked();
    this.setup();
  }

  /** 获取当前主题的样式配置 */
  private get S() {
    return THEMES[this.currentTheme];
  }

  /** 切换主题 */
  public setTheme(theme: Theme) {
    this.currentTheme = theme;
  }

  /** 获取当前主题名称 */
  public getTheme(): Theme {
    return this.currentTheme;
  }

  /** 无序列表嵌套时轮换 bullet，便于区分层级 */
  private listContainerStyle(ordered: boolean, depth: number): string {
    if (ordered) {
      return depth === 0 ? this.S.ol : this.S.olNested;
    }
    if (depth === 0) return this.S.ul;
    const marker = NESTED_UL_MARKERS[Math.min(depth - 1, NESTED_UL_MARKERS.length - 1)];
    return `${this.S.ulNested} list-style-type: ${marker};`;
  }

  /** 递归渲染 list_item.tokens（含嵌套 list、GFM checkbox、多段 paragraph） */
  private renderListItemInner(item: any, depth: number): string {
    const tokens: any[] | undefined = item.tokens;
    if (!tokens || tokens.length === 0) {
      const check = item.task ? (item.checked ? '☑️ ' : '⬜ ') : '';
      return `${check}${this.renderInline(item.text || '')}`;
    }
    let out = '';
    for (const t of tokens) {
      switch (t.type) {
        case 'checkbox':
          out += t.checked ? '☑️ ' : '⬜ ';
          break;
        case 'text':
          out += this.renderInline(t.text || '');
          break;
        case 'paragraph':
          out += `<span style="display:block;margin:0.25em 0;">${this.renderInline(t.text || '')}</span>`;
          break;
        case 'list':
          out += this.renderListHtml(t, depth + 1);
          break;
        case 'space':
          break;
        default:
          out += this.renderInline(t.text ?? t.raw ?? '');
      }
    }
    return out;
  }

  private renderListHtml(listToken: any, depth: number): string {
    const tag = listToken.ordered ? 'ol' : 'ul';
    const style = this.listContainerStyle(!!listToken.ordered, depth);
    const startAttr =
      listToken.ordered && listToken.start != null && Number(listToken.start) !== 1
        ? ` start="${Number(listToken.start)}"`
        : '';
    const body = listToken.items
      .map((item: any) => `<li style="${this.S.li}">${this.renderListItemInner(item, depth)}</li>`)
      .join('');
    return `<${tag}${startAttr} style="${style}">${body}</${tag}>`;
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
        renderer(token: any) { return `<span style="${self.S.u}">${(this as any).parser.parseInline(token.tokens || [])}</span>`; }
      },
      {
        name: 'mark',
        level: 'inline',
        start(src: string) { return src.indexOf('=='); },
        tokenizer(src: string) {
          const match = /^==([\s\S]+?)==/.exec(src);
          if (match) return { type: 'mark', raw: match[0], text: match[1] };
        },
        renderer(token: any) { return `<mark style="${self.S.mark}">${(this as any).parser.parseInline(token.tokens || [])}</mark>`; }
      }
    ];

    this.markedInstance.use({
      gfm: true,
      breaks: true,
      extensions,
      renderer: {
        strong({ text }: any) { return `<strong style="${self.S.strong}">${text}</strong>`; },
        em({ text }: any) { return `<em style="${self.S.em}">${text}</em>`; },
        del({ text }: any) { return `<del style="${self.S.del}">${text}</del>`; },
        codespan({ text }: any) { return `<code style="${self.S.code}">${text}</code>`; },
        heading({ text, depth }: any) {
          const styles = [self.S.h1, self.S.h2, self.S.h3, self.S.h4, self.S.h5, self.S.h6];
          const style = styles[depth - 1] || self.S.h3;
          return `<h${depth} style="${style}">${text}</h${depth}>`;
        },
        paragraph({ text }: any) { return `<p style="${self.S.p}">${text}</p>`; },
        blockquote({ text }: any) { return `<blockquote style="${self.S.blockquote}">${text}</blockquote>`; },
        hr() { return `<hr style="${self.S.hr}" />`; },
        list(token: any) {
          return self.renderListHtml(token, 0);
        },
        code({ text, lang }: any) {
          return self.buildCodeBlockHtml(text, lang);
        },
        link({ href, text }: any) {
          if (href.startsWith('#')) return `<span style="${self.S.a}">${text}</span>`;
          self.footnotes.push({ title: text, url: href });
          return `<span style="${self.S.a}">${text}</span><sup style="font-size:10px; color:#787774; margin-left:2px;">[${self.footnotes.length}]</sup>`;
        },
        image({ href, text, title }: any) {
          return `<img src="${href}" alt="${text}" title="${title || ''}" style="${self.S.img}" />`;
        },
        table({ header, rows }: any) {
          const hHtml = header.map((c: any) => `<th style="${self.S.th}">${c.text}</th>`).join('');
          const bHtml = rows.map((r: any) => `<tr>${r.map((c: any) => `<td style="${self.S.td}">${c.text}</td>`).join('')}</tr>`).join('');
          return `<section style="${self.S.tableWrapper}"><table style="${self.S.table}"><thead><tr>${hHtml}</tr></thead><tbody>${bHtml}</tbody></table></section>`;
        }
      }
    });
  }

  private renderInline(text: string): string {
    let html = text;
    const placeholders: string[] = [];
    html = html.replace(/`([\s\S]+?)`/g, (_, code) => {
      const id = `⦓${placeholders.length}⦔`;
      placeholders.push(`<code style="${this.S.code}">${code}</code>`);
      return id;
    });
    const escapePlaceholders: string[] = [];
    html = html.replace(/\\([\*\_\`\#\-\+\>\!\(\)\[\]\\])/g, (_, char) => {
      const id = `⦔${escapePlaceholders.length}⦓`;
      escapePlaceholders.push(char);
      return id;
    });
    html = html.replace(/\*\*\*([\s\S]+?)\*\*\*/g, `<strong style="${this.S.strong}"><em style="${this.S.em}">$1</em></strong>`);
    html = html.replace(/\*\*([\s\S]+?)\*\*/g, `<strong style="${this.S.strong}">$1</strong>`);
    html = html.replace(/__([\s\S]+?)__/g, `<strong style="${this.S.strong}">$1</strong>`);
    html = html.replace(/\*([\s\S]+?)\*/g, `<em style="${this.S.em}">$1</em>`);
    html = html.replace(/_([\s\S]+?)_/g, `<em style="${this.S.em}">$1</em>`);
    html = html.replace(/~~([\s\S]+?)~~/g, `<del style="${this.S.del}">$1</del>`);
    html = html.replace(/==([\s\S]+?)==/g, `<mark style="${this.S.mark}">$1</mark>`);
    html = html.replace(/<u>([\s\S]+?)<\/u>/g, `<span style="${this.S.u}">$1</span>`);
    html = html.replace(/\[([\s\S]+?)\]\(([\s\S]+?)\)/g, (_, label, href) => {
      if (href.startsWith('#')) return `<span style="${this.S.a}">${label}</span>`;
      this.footnotes.push({ title: label, url: href });
      return `<span style="${this.S.a}">${label}</span><sup style="font-size:10px; color:#787774; margin-left:2px;">[${this.footnotes.length}]</sup>`;
    });
    escapePlaceholders.forEach((char, i) => { html = html.split(`⦔${i}⦓`).join(char); });
    placeholders.forEach((val, i) => { html = html.split(`⦓${i}⦔`).join(val); });
    return html;
  }

  private buildCodeBlockHtml(raw: string, lang: string | undefined): string {
    const language = lang || 'javascript';
    let inner: string;
    try {
      if (Prism.languages[language]) {
        inner = Prism.highlight(raw, Prism.languages[language], language);
        inner = prismHtmlToInlineStyles(inner);
        inner = preserveCodeWhitespaceForWeChat(inner);
      } else {
        inner = preserveCodeWhitespaceForWeChat(escapeHtml(raw));
      }
    } catch {
      inner = preserveCodeWhitespaceForWeChat(escapeHtml(raw));
    }
    return `<pre style="${this.S.pre}"><code style="${this.S.codeBlock}">${inner}</code></pre>`;
  }

  public render(markdown: string, isNested = false): string {
    if (!isNested) this.footnotes = [];
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
            const hStyle = ([this.S.h1, this.S.h2, this.S.h3, this.S.h4, this.S.h5, this.S.h6] as any)[token.depth - 1] || this.S.h3;
            html += `<h${token.depth} style="${hStyle}">${this.renderInline(token.text)}</h${token.depth}>`;
            break;
          case 'paragraph':
            const pText = token.text.trim();
            if (pText.startsWith('__CALLOUT_BLOCK_') && pText.endsWith('__')) {
              html += pText;
            } else {
              html += `<p style="${this.S.p}">${this.renderInline(token.text)}</p>`;
            }
            break;
          case 'blockquote':
            html += `<blockquote style="${this.S.blockquote}">${this.render(token.text, true)}</blockquote>`;
            break;
          case 'list':
            html += this.renderListHtml(token, 0);
            break;
          case 'code':
            html += this.buildCodeBlockHtml(token.text, token.lang);
            break;
          case 'table':
            const header = token.header.map((c: any) => `<th style="${this.S.th}">${this.renderInline(c.text)}</th>`).join('');
            const rows = token.rows.map((r: any) => `<tr>${r.map((c: any) => `<td style="${this.S.td}">${this.renderInline(c.text)}</td>`).join('')}</tr>`).join('');
            // 使用 section 包装 table 增加微信后台的识别率
            html += `<section style="${this.S.tableWrapper}"><table style="${this.S.table}"><thead><tr>${header}</tr></thead><tbody>${rows}</tbody></table></section>`;
            break;
          case 'hr': html += `<hr style="${this.S.hr}" />`; break;
          default: html += token.raw;
        }
      });

      calloutBlocks.forEach((blockHtml, i) => { html = html.replace(`__CALLOUT_BLOCK_${i}__`, blockHtml); });

      if (!isNested && this.footnotes.length > 0) {
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
