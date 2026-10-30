'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  TIANJI_MODULES,
  HEXAGRAMS,
  FENGSHUI_ENTRIES,
  TIANJI_EPISODES,
  TIANJI_QUOTES,
  TIANJI_STATS,
} from '@/lib/nihai/tianji';
import { SANJI_CATEGORIES, NI_HAIXIA_BIO } from '@/lib/nihai';

export default function TianjiPage() {
  const [activeTab, setActiveTab] = useState<'modules' | 'hexagrams' | 'fengshui' | 'episodes' | 'quotes'>('modules');
  const [searchHex, setSearchHex] = useState('');

  const filteredHexagrams = searchHex.trim()
    ? HEXAGRAMS.filter(h => h.name.includes(searchHex.trim()) || h.composition.includes(searchHex.trim()) || h.meaning.includes(searchHex.trim()))
    : HEXAGRAMS;

  return (
    <div style={{ background: 'var(--bg-page, #0d0a08)', color: 'var(--tx-0, #f5ecd7)', minHeight: '100vh', fontFamily: '"STSong", "Songti SC", serif' }}>
      {/* 顶栏导航 */}
      <header className="px-6 py-4 flex items-center justify-between border-b"
        style={{ borderColor: 'rgba(184,146,42,0.18)', background: 'rgba(13,10,8,0.85)', backdropFilter: 'blur(8px)', position: 'sticky', top: 0, zIndex: 30 }}>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xs tracking-[0.25em] no-underline" style={{ color: 'var(--ac, #b8922a)' }}>
            ← 首页
          </Link>
          <span style={{ opacity: 0.3 }}>|</span>
          <div className="flex items-center gap-2 text-xs">
            {SANJI_CATEGORIES.map(cat => (
              <Link
                key={cat.key}
                href={cat.href}
                className="px-2.5 py-1 rounded text-xs no-underline transition-all"
                style={{
                  color: cat.key === 'tianji' ? '#fff' : 'var(--tx-3, #a89878)',
                  background: cat.key === 'tianji' ? 'var(--ac, #b8922a)' : 'transparent',
                  border: cat.key === 'tianji' ? '1px solid var(--ac, #b8922a)' : '1px solid transparent',
                  fontWeight: cat.key === 'tianji' ? 600 : 400,
                }}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <Link href="/chart" className="no-underline px-3 py-1 rounded border" style={{ color: 'var(--ac, #b8922a)', borderColor: 'rgba(184,146,42,0.3)' }}>
            紫微排盘
          </Link>
          <Link href="/library" className="no-underline hidden sm:inline" style={{ color: 'var(--tx-3, #a89878)' }}>
            古籍库
          </Link>
        </div>
      </header>

      {/* Hero 介绍区 */}
      <div className="max-w-5xl mx-auto px-6 py-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] tracking-[0.25em] mb-4 border"
          style={{ color: '#10b981', borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.08)' }}>
          <span>✓ 全功能已开放研读</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-[0.18em] mb-3" style={{ color: 'var(--tx-0, #f5ecd7)' }}>
          天纪 · 上知天文
        </h1>
        <p className="text-xs sm:text-sm tracking-[0.12em] max-w-2xl mx-auto leading-relaxed mb-6" style={{ color: 'var(--tx-2, #c8b99d)' }}>
          1994年倪海厦先生录制之术数大系，共24集DVD（48课时），涵盖紫微斗数三合正宗、易经六十四卦象数微言、杨公九星堪舆风水与河洛理数。
        </p>

        {/* 统计指标卡 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mb-8">
          <div className="p-3 rounded-lg border text-center" style={{ background: 'rgba(184,146,42,0.04)', borderColor: 'rgba(184,146,42,0.18)' }}>
            <div className="text-xl font-bold" style={{ color: 'var(--ac, #b8922a)' }}>{TIANJI_STATS.totalEpisodes} 集</div>
            <div className="text-[11px] tracking-wider mt-0.5" style={{ color: 'var(--tx-3, #8a7a60)' }}>全套音视频录制</div>
          </div>
          <div className="p-3 rounded-lg border text-center" style={{ background: 'rgba(184,146,42,0.04)', borderColor: 'rgba(184,146,42,0.18)' }}>
            <div className="text-xl font-bold" style={{ color: 'var(--ac, #b8922a)' }}>{TIANJI_STATS.totalHexagrams} 卦</div>
            <div className="text-[11px] tracking-wider mt-0.5" style={{ color: 'var(--tx-3, #8a7a60)' }}>易经六十四卦详析</div>
          </div>
          <div className="p-3 rounded-lg border text-center" style={{ background: 'rgba(184,146,42,0.04)', borderColor: 'rgba(184,146,42,0.18)' }}>
            <div className="text-xl font-bold" style={{ color: 'var(--ac, #b8922a)' }}>{TIANJI_STATS.totalFengShui} 条</div>
            <div className="text-[11px] tracking-wider mt-0.5" style={{ color: 'var(--tx-3, #8a7a60)' }}>阳宅地脉核心法则</div>
          </div>
          <div className="p-3 rounded-lg border text-center" style={{ background: 'rgba(184,146,42,0.04)', borderColor: 'rgba(184,146,42,0.18)' }}>
            <div className="text-xl font-bold" style={{ color: 'var(--ac, #b8922a)' }}>{TIANJI_STATS.totalQuotes}+</div>
            <div className="text-[11px] tracking-wider mt-0.5" style={{ color: 'var(--tx-3, #8a7a60)' }}>倪师金句与讲义记录</div>
          </div>
        </div>

        {/* 选项卡切换 */}
        <div className="flex flex-wrap items-center justify-center gap-2 border-b pb-4" style={{ borderColor: 'rgba(184,146,42,0.15)' }}>
          {[
            { id: 'modules', label: '核心四大模块' },
            { id: 'hexagrams', label: '易经六十四卦' },
            { id: 'fengshui', label: '阳宅风水经纬' },
            { id: 'episodes', label: '24 集大纲纲目' },
            { id: 'quotes', label: '倪师天纪语录' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className="px-4 py-2 rounded-lg text-xs tracking-wider transition-all cursor-pointer"
              style={{
                background: activeTab === tab.id ? 'var(--ac, #b8922a)' : 'rgba(255,255,255,0.03)',
                color: activeTab === tab.id ? '#0d0a08' : 'var(--tx-2, #c8b99d)',
                fontWeight: activeTab === tab.id ? 700 : 400,
                border: `1px solid ${activeTab === tab.id ? 'var(--ac, #b8922a)' : 'rgba(184,146,42,0.15)'}`,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 模块内容 */}
      <main className="max-w-5xl mx-auto px-6 pb-24">
        {/* 1. 核心模块 */}
        {activeTab === 'modules' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TIANJI_MODULES.map(m => (
              <div
                key={m.id}
                className="p-6 rounded-xl border flex flex-col justify-between"
                style={{ background: 'rgba(26,20,16,0.6)', borderColor: 'rgba(184,146,42,0.22)' }}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl text-amber-500">{m.icon}</span>
                      <h2 className="text-xl font-bold tracking-wider" style={{ color: 'var(--tx-0, #f5ecd7)' }}>{m.name}</h2>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded border" style={{ color: 'var(--ac, #b8922a)', borderColor: 'rgba(184,146,42,0.3)' }}>
                      {m.school}
                    </span>
                  </div>
                  <div className="text-xs font-semibold mb-2" style={{ color: 'var(--ac, #b8922a)' }}>{m.subtitle}</div>
                  <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--tx-2, #c8b99d)' }}>{m.description}</p>

                  <div className="space-y-1.5 mb-4">
                    {m.details.map((d, idx) => (
                      <div key={idx} className="text-[11px] leading-relaxed flex items-start gap-1.5" style={{ color: 'var(--tx-3, #a89878)' }}>
                        <span style={{ color: 'var(--ac, #b8922a)' }}>•</span>
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t" style={{ borderColor: 'rgba(184,146,42,0.15)' }}>
                  <div className="text-[10px] mb-2" style={{ color: 'var(--tx-3, #8a7a60)' }}>
                    包含章节：{m.chapters.map(c => c.title).join(' / ')}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {m.keywords.map(kw => (
                      <span key={kw} className="text-[9px] px-2 py-0.5 rounded" style={{ background: 'rgba(184,146,42,0.08)', color: 'var(--tx-2, #c8b99d)' }}>
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. 易经六十四卦 */}
        {activeTab === 'hexagrams' && (
          <div>
            <div className="mb-6 max-w-md mx-auto">
              <input
                type="text"
                placeholder="搜索卦名、卦象（如：乾、坤、水雷屯、同人）..."
                value={searchHex}
                onChange={e => setSearchHex(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg text-xs bg-black/40 border focus:outline-none"
                style={{ borderColor: 'rgba(184,146,42,0.3)', color: 'var(--tx-0, #f5ecd7)' }}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredHexagrams.map(h => (
                <div key={h.number} className="p-4 rounded-lg border" style={{ background: 'rgba(26,20,16,0.5)', borderColor: 'rgba(184,146,42,0.15)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-bold" style={{ color: 'var(--ac, #b8922a)' }}>
                      第 {h.number} 卦 · {h.name}卦
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-amber-950/40 border border-amber-900/40 text-amber-300">
                      {h.composition} ({h.upper}/{h.lower})
                    </span>
                  </div>
                  <div className="text-xs mb-2 leading-relaxed" style={{ color: 'var(--tx-1, #e6d8c0)' }}>
                    <strong style={{ color: 'var(--ac, #b8922a)' }}>卦辞义理：</strong>{h.meaning}
                  </div>
                  <div className="text-xs mb-2 leading-relaxed" style={{ color: 'var(--tx-2, #c8b99d)' }}>
                    <strong style={{ color: '#10b981' }}>倪师发微：</strong>{h.niInterpretation}
                  </div>
                  <div className="text-[11px] pt-2 border-t leading-relaxed" style={{ borderColor: 'rgba(184,146,42,0.1)', color: 'var(--tx-3, #8a7a60)' }}>
                    <strong>占卜断法：</strong>{h.divination}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. 阳宅风水 */}
        {activeTab === 'fengshui' && (
          <div className="space-y-4">
            {FENGSHUI_ENTRIES.map(f => (
              <div key={f.id} className="p-5 rounded-xl border" style={{ background: 'rgba(26,20,16,0.6)', borderColor: 'rgba(184,146,42,0.18)' }}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-amber-500 font-bold">方位法则</span>
                  <h3 className="text-lg font-bold" style={{ color: 'var(--tx-0, #f5ecd7)' }}>{f.title}</h3>
                </div>
                <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--tx-2, #c8b99d)' }}>{f.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {f.keyPoints.map((pt, idx) => (
                    <div key={idx} className="p-2.5 rounded text-xs flex items-start gap-2 bg-black/30 border border-amber-950/30" style={{ color: 'var(--tx-3, #a89878)' }}>
                      <span className="text-amber-500 font-bold">❖</span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. 24 集大纲 */}
        {activeTab === 'episodes' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {TIANJI_EPISODES.map(ep => (
              <div key={ep.dvd} className="p-4 rounded-lg border flex flex-col justify-between" style={{ background: 'rgba(26,20,16,0.5)', borderColor: 'rgba(184,146,42,0.15)' }}>
                <div>
                  <div className="text-xs font-bold mb-1" style={{ color: 'var(--ac, #b8922a)' }}>
                    第 {ep.dvd} 讲 / 24
                  </div>
                  <div className="text-sm font-semibold mb-2" style={{ color: 'var(--tx-0, #f5ecd7)' }}>
                    {ep.firstHalf} · {ep.secondHalf}
                  </div>
                  <div className="space-y-1 mb-2">
                    {ep.highlights.map((h, i) => (
                      <div key={i} className="text-[11px]" style={{ color: 'var(--tx-3, #a89878)' }}>
                        - {h}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-[10px] text-right" style={{ color: '#10b981' }}>
                  ✓ 课程纲要完整已录入
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 5. 经典语录 */}
        {activeTab === 'quotes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TIANJI_QUOTES.map((q, idx) => (
              <div key={idx} className="p-5 rounded-xl border relative overflow-hidden" style={{ background: 'rgba(26,20,16,0.6)', borderColor: 'rgba(184,146,42,0.18)' }}>
                <div className="text-4xl absolute -bottom-3 -right-2 opacity-10 select-none text-amber-500">“</div>
                <div className="text-xs tracking-wider mb-2" style={{ color: 'var(--ac, #b8922a)' }}>【{q.topic}】</div>
                <blockquote className="text-sm font-medium leading-relaxed mb-3 italic" style={{ color: 'var(--tx-0, #f5ecd7)' }}>
                  “{q.text}”
                </blockquote>
                <div className="text-[11px] text-right" style={{ color: 'var(--tx-3, #8a7a60)' }}>
                  —— 倪海厦 · 《天纪》
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
