'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// خطوط کد C# که در ترمینال تایپ می‌شوند
const codeLines = [
  { tokens: [{ t: 'comment', v: '// 👋 Welcome to my portfolio' }] },
  { tokens: [{ t: 'plain', v: '' }] },
  {
    tokens: [
      { t: 'keyword', v: 'public class ' },
      { t: 'fn', v: 'AlirezaZamani ' },
      { t: 'plain', v: ': ' },
      { t: 'fn', v: 'Developer' },
    ],
  },
  { tokens: [{ t: 'plain', v: '{' }] },
  {
    tokens: [
      { t: 'plain', v: '  ' },
      { t: 'keyword', v: 'public string ' },
      { t: 'var', v: 'Name ' },
      { t: 'plain', v: '=> ' },
      { t: 'string', v: '"Alireza Zamani"' },
      { t: 'plain', v: ';' },
    ],
  },
  {
    tokens: [
      { t: 'plain', v: '  ' },
      { t: 'keyword', v: 'public string ' },
      { t: 'var', v: 'Role ' },
      { t: 'plain', v: '=> ' },
      { t: 'string', v: '"Senior .NET Developer"' },
      { t: 'plain', v: ';' },
    ],
  },
  {
    tokens: [
      { t: 'plain', v: '  ' },
      { t: 'keyword', v: 'public int ' },
      { t: 'var', v: 'YearsOfExp ' },
      { t: 'plain', v: '=> ' },
      { t: 'num', v: '8' },
      { t: 'plain', v: ';' },
    ],
  },
  {
    tokens: [
      { t: 'plain', v: '  ' },
      { t: 'keyword', v: 'public string[] ' },
      { t: 'var', v: 'Stack ' },
      { t: 'plain', v: '=> [' },
    ],
  },
  {
    tokens: [
      { t: 'plain', v: '    ' },
      { t: 'string', v: '".NET Core"' },
      { t: 'plain', v: ', ' },
      { t: 'string', v: '"Microservices"' },
      { t: 'plain', v: ', ' },
      { t: 'string', v: '"Blazor"' },
      { t: 'plain', v: ',' },
    ],
  },
  {
    tokens: [
      { t: 'plain', v: '    ' },
      { t: 'string', v: '"MAUI"' },
      { t: 'plain', v: ', ' },
      { t: 'string', v: '"React Native"' },
      { t: 'plain', v: ', ' },
      { t: 'string', v: '"Next.js"' },
    ],
  },
  { tokens: [{ t: 'plain', v: '  ];' }] },
  { tokens: [{ t: 'plain', v: '' }] },
  {
    tokens: [
      { t: 'plain', v: '  ' },
      { t: 'keyword', v: 'public ' },
      { t: 'fn', v: 'Task ' },
      { t: 'fn', v: 'BuildAmazingApps' },
      { t: 'plain', v: '() => ' },
      { t: 'string', v: '"🚀"' },
      { t: 'plain', v: ';' },
    ],
  },
  { tokens: [{ t: 'plain', v: '}' }] },
];

const tokenClass: Record<string, string> = {
  keyword: 'tok-keyword',
  string: 'tok-string',
  fn: 'tok-fn',
  var: 'tok-var',
  num: 'tok-num',
  comment: 'tok-comment',
  tag: 'tok-tag',
  plain: 'tok-plain',
};

// تعداد کل کاراکترها برای محاسبه پیشرفت تایپ
function totalLength(lines: typeof codeLines) {
  return lines.reduce(
    (acc, line) => acc + line.tokens.reduce((s, t) => s + t.v.length, 0) + 1, // +1 for newline
    0
  );
}

export default function CodeEditorAnimation() {
  const [charsTyped, setCharsTyped] = useState(0);
  const total = totalLength(codeLines);

  useEffect(() => {
    if (charsTyped >= total) {
      // pause then restart loop
      const t = setTimeout(() => setCharsTyped(0), 4000);
      return () => clearTimeout(t);
    }
    const speed = 28; // ms per char
    const t = setTimeout(() => setCharsTyped((c) => c + 1), speed);
    return () => clearTimeout(t);
  }, [charsTyped, total]);

  // برای رندر، هر خط رو تا حد مجاز کاراکتر تایپ‌شده نشون می‌دیم
  let remaining = charsTyped;
  const renderedLines = codeLines.map((line, lineIdx) => {
    const lineLen = line.tokens.reduce((s, t) => s + t.v.length, 0);
    if (remaining <= 0) return null;
    if (remaining >= lineLen + 1) {
      remaining -= lineLen + 1;
      return { full: true, line, lineIdx };
    } else {
      const take = remaining;
      remaining = 0;
      // build partial tokens
      let used = 0;
      const partial = [];
      for (const tok of line.tokens) {
        if (used + tok.v.length <= take) {
          partial.push(tok);
          used += tok.v.length;
        } else {
          partial.push({ t: tok.t, v: tok.v.slice(0, take - used) });
          break;
        }
      }
      return { full: false, line: { tokens: partial }, lineIdx, isCurrent: true };
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, rotateY: 6 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ duration: 0.7 }}
      className="code-card relative w-full max-w-xl shadow-[0_25px_60px_-15px_rgba(124,58,237,0.5)]"
      style={{ perspective: '1200px' }}
    >
      {/* Window header */}
      <div className="flex items-center justify-between bg-[#161b22] px-4 py-3 border-b border-[#21262d]">
        <div className="flex gap-2">
          <span className="terminal-dot bg-red-500" />
          <span className="terminal-dot bg-yellow-500" />
          <span className="terminal-dot bg-green-500" />
        </div>
        <div className="flex items-center gap-2 text-xs text-[#8b949e]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 18L22 12L16 6M8 6L2 12L8 18" />
          </svg>
          <span dir="ltr">developer.cs</span>
        </div>
        <div className="text-xs text-[#8b949e] font-mono">.NET 8</div>
      </div>

      {/* Code body */}
      <div dir="ltr" className="px-5 py-5 text-sm leading-7 font-mono min-h-[420px] bg-[#0d1117] relative overflow-hidden">
        {/* line numbers + content */}
        <div className="grid grid-cols-[2.5rem_1fr]">
          {renderedLines.map((ln, idx) => {
            if (!ln) return null;
            return (
              <div key={idx} className="contents">
                <span className="text-[#484f58] select-none text-right pr-3">{idx + 1}</span>
                <div className="whitespace-pre min-h-[1.75rem]">
                  {ln.line.tokens.map((tok, ti) => (
                    <span key={ti} className={tokenClass[tok.t] || ''}>
                      {tok.v}
                    </span>
                  ))}
                  {ln.isCurrent && <span className="caret-blink">▌</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* gradient glow at bottom */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-brand-600/10 to-transparent" />
      </div>

      <style jsx>{`
        .caret-blink {
          display: inline-block;
          color: #a78bfa;
          animation: caret-blink 1s steps(2) infinite;
          margin-left: 2px;
        }
        @keyframes caret-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>
    </motion.div>
  );
}
