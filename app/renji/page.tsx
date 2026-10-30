'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  RENJI_MODULES,
  ACU_EXPERIENCES,
  TRANS_NEEDLING,
  HANTANG_FORMULAS,
  CLASSIC_FORMULAS,
  RENJI_STATS,
} from '@/lib/nihai/renji';
import { SANJI_CATEGORIES } from '@/lib/nihai';

export default function RenjiPage() {
  const [activeTab, setActiveTab] = useState<'modules' | 'acupoints' | 'trans' | 'hantang' | 'classics'>('modules');
  const [searchAcu, setSearchAcu] = useState('');
  const [searchFormula, setSearchFormula] = useState('');

  const filteredAcu = searchAcu.trim()
    ? ACU_EXPERIENCES.filter(a => a.condition.includes(searchAcu.trim()) || a.acupoints.includes(searchAcu.trim()) || a.category.includes(searchAcu.trim()))
    : ACU_EXPERIENCES.slice(0, 50);

  const filteredHantang = searchFormula.trim()
    ? HANTANG_FORMULAS.filter(f => f.name.includes(searchFormula.trim()) || f.indication.includes(searchFormula.trim()))
    : HANTANG_FORMULAS;

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
                  color: cat.key === 'renji' ? '#fff' : 'var(--tx-3, #a89878)',
                  background: cat.key === 'renji' ? '#8b6b9e' : 'transparent',
                  border: cat.key === 'renji' ? '1px solid #8b6b9e' : '1px solid transparent',
                  fontWeight: cat.key === 'renji' ? 600 : 400,
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
          <span>✓ 经方与针灸学术库已全面开放</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-[0.18em] mb-3" style={{ color: 'var(--tx-0, #f5ecd7)' }}>
          人纪 · 中知人事 · 经方医学
        </h1>
        <p className="text-xs sm:text-sm tracking-[0.12em] max-w-2xl mx-auto leading-relaxed mb-6" style={{ color: 'var(--tx-2, #c8b99d)' }}>
          2004~2005年倪海厦先生开讲之经方医学全集（150+课时）。以《针灸大成》、《黄帝内经》、《神农本草经》、《伤寒论》与《金匮要略》五大圣典为纲，还原经方「一剂知，二剂已」之物理医学体系。
        </p>

        {/* 统计指标卡 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mb-8">
          <div className="p-3 rounded-lg border text-center" style={{ background: 'rgba(139,107,158,0.08)', borderColor: 'rgba(139,107,158,0.25)' }}>
            <div className="text-xl font-bold" style={{ color: '#c4a6d8' }}>{RENJI_STATS.totalModules} 大</div>
            <div className="text-[11px] tracking-wider mt-0.5" style={{ color: 'var(--tx-3, #8a7a60)' }}>经典课程模块</div>
          </div>
          <div className="p-3 rounded-lg border text-center" style={{ background: 'rgba(139,107,158,0.08)', borderColor: 'rgba(139,107,158,0.25)' }}>
            <div className="text-xl font-bold" style={{ color: '#c4a6d8' }}>{RENJI_STATS.acuExperienceCount} 组</div>
            <div className="text-[11px] tracking-wider mt-0.5" style={{ color: 'var(--tx-3, #8a7a60)' }}>针灸名家经验穴位</div>
          </div>
          <div className="p-3 rounded-lg border text-center" style={{ background: 'rgba(139,107,158,0.08)', borderColor: 'rgba(139,107,158,0.25)' }}>
            <div className="text-xl font-bold" style={{ color: '#c4a6d8' }}>{RENJI_STATS.transNeedlingCount} 法</div>
            <div className="text-[11px] tracking-wider mt-0.5" style={{ color: 'var(--tx-3, #8a7a60)' }}>周左宇家传透针绝学</div>
          </div>
          <div className="p-3 rounded-lg border text-center" style={{ background: 'rgba(139,107,158,0.08)', borderColor: 'rgba(139,107,158,0.25)' }}>
            <div className="text-xl font-bold" style={{ color: '#c4a6d8' }}>{RENJI_STATS.hantangFormulaCount} 方</div>
            <div className="text-[11px] tracking-wider mt-0.5" style={{ color: 'var(--tx-3, #8a7a60)' }}>汉唐自研临床经方</div>
          </div>
        </div>

        {/* 选项卡切换 */}
        <div className="flex flex-wrap items-center justify-center gap-2 border-b pb-4" style={{ borderColor: 'rgba(184,146,42,0.15)' }}>
          {[
            { id: 'modules', label: '五大经典模块' },
            { id: 'acupoints', label: '针灸经验穴位' },
            { id: 'trans', label: '透针秘传精选' },
            { id: 'hantang', label: '汉唐经方名录' },
            { id: 'classics', label: '仲景经典经方' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className="px-4 py-2 rounded-lg text-xs tracking-wider transition-all cursor-pointer"
              style={{
                background: activeTab === tab.id ? '#8b6b9e' : 'rgba(255,255,255,0.03)',
                color: activeTab === tab.id ? '#fff' : 'var(--tx-2, #c8b99d)',
                fontWeight: activeTab === tab.id ? 700 : 400,
                border: `1px solid ${activeTab === tab.id ? '#8b6b9e' : 'rgba(184,146,42,0.15)'}`,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 模块内容 */}
      <main className="max-w-5xl mx-auto px-6 pb-24">
        {/* 1. 五大模块 */}
        {activeTab === 'modules' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {RENJI_MODULES.map(m => (
              <div
                key={m.id}
                className="p-6 rounded-xl border flex flex-col justify-between"
                style={{ background: 'rgba(26,20,16,0.6)', borderColor: 'rgba(139,107,158,0.25)' }}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl text-purple-400">{m.icon}</span>
                      <h2 className="text-xl font-bold tracking-wider" style={{ color: 'var(--tx-0, #f5ecd7)' }}>{m.name}</h2>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded border border-purple-900/40 text-purple-300 bg-purple-950/20">
                      {m.school || '经方医学'}
                    </span>
                  </div>
                  <div className="text-xs font-semibold mb-2" style={{ color: '#c4a6d8' }}>{m.subtitle}</div>
                  <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--tx-2, #c8b99d)' }}>{m.description}</p>

                  <div className="space-y-1.5 mb-4">
                    {m.details.map((d, idx) => (
                      <div key={idx} className="text-[11px] leading-relaxed flex items-start gap-1.5" style={{ color: 'var(--tx-3, #a89878)' }}>
                        <span className="text-purple-400">•</span>
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t" style={{ borderColor: 'rgba(184,146,42,0.15)' }}>
                  <div className="text-[10px] mb-2" style={{ color: 'var(--tx-3, #8a7a60)' }}>
                    章节纲要：{m.chapters.map(c => c.title).join(' / ')}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {m.keywords.map(kw => (
                      <span key={kw} className="text-[9px] px-2 py-0.5 rounded" style={{ background: 'rgba(139,107,158,0.15)', color: '#d8c4e8' }}>
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. 针灸经验穴位 */}
        {activeTab === 'acupoints' && (
          <div>
            <div className="mb-6 max-w-md mx-auto">
              <input
                type="text"
                placeholder="搜索病症或穴位（如：头痛、三阴交、合谷、胃痛）..."
                value={searchAcu}
                onChange={e => setSearchAcu(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg text-xs bg-black/40 border focus:outline-none"
                style={{ borderColor: 'rgba(139,107,158,0.3)', color: 'var(--tx-0, #f5ecd7)' }}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredAcu.map(a => (
                <div key={a.id} className="p-3.5 rounded-lg border" style={{ background: 'rgba(26,20,16,0.5)', borderColor: 'rgba(139,107,158,0.2)' }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-purple-300">#{a.id} {a.condition}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-950/40 text-purple-200">
                      {a.category}
                    </span>
                  </div>
                  <div className="text-xs font-semibold mb-1" style={{ color: 'var(--ac, #b8922a)' }}>
                    取穴：{a.acupoints}
                  </div>
                  {a.note && (
                    <div className="text-[10px] leading-relaxed" style={{ color: 'var(--tx-3, #a89878)' }}>
                      注：{a.note}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. 透针秘传 */}
        {activeTab === 'trans' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TRANS_NEEDLING.map(t => (
              <div key={t.id} className="p-4 rounded-xl border" style={{ background: 'rgba(26,20,16,0.6)', borderColor: 'rgba(139,107,158,0.25)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base font-bold text-purple-300">{t.combo}</span>
                  <span className="text-[10px] text-zinc-400">{t.source}</span>
                </div>
                <div className="text-xs mb-1.5 leading-relaxed" style={{ color: 'var(--tx-1, #e6d8c0)' }}>
                  <strong className="text-amber-500">主治病证：</strong>{t.indication}
                </div>
                {t.supporting && (
                  <div className="text-[11px] leading-relaxed" style={{ color: 'var(--tx-3, #a89878)' }}>
                    <strong>辅穴配伍：</strong>{t.supporting}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 4. 汉唐经方 */}
        {activeTab === 'hantang' && (
          <div>
            <div className="mb-6 max-w-md mx-auto">
              <input
                type="text"
                placeholder="搜索方名或主治（如：汉唐2号、健脾、痛经）..."
                value={searchFormula}
                onChange={e => setSearchFormula(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg text-xs bg-black/40 border focus:outline-none"
                style={{ borderColor: 'rgba(139,107,158,0.3)', color: 'var(--tx-0, #f5ecd7)' }}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredHantang.map(f => (
                <div key={f.id} className="p-4 rounded-lg border" style={{ background: 'rgba(26,20,16,0.5)', borderColor: 'rgba(139,107,158,0.2)' }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-bold text-purple-300">#{f.id} {f.name}</span>
                  </div>
                  <div className="text-xs mb-1 leading-relaxed" style={{ color: 'var(--tx-1, #e6d8c0)' }}>
                    <strong>主治：</strong>{f.indication}
                  </div>
                  {f.theory && (
                    <div className="text-[11px] leading-relaxed text-zinc-400">
                      <strong>理论：</strong>{f.theory}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. 经典经方 */}
        {activeTab === 'classics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CLASSIC_FORMULAS.map(cf => (
              <div key={cf.id} className="p-4 rounded-xl border" style={{ background: 'rgba(26,20,16,0.6)', borderColor: 'rgba(139,107,158,0.25)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base font-bold text-purple-300">{cf.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/30 text-amber-300 border border-amber-900/30">
                    {cf.source}
                  </span>
                </div>
                <div className="text-xs mb-1.5" style={{ color: 'var(--ac, #b8922a)' }}>
                  <strong>组成：</strong>{cf.composition}
                </div>
                <div className="text-xs mb-2 leading-relaxed" style={{ color: 'var(--tx-1, #e6d8c0)' }}>
                  <strong>主治：</strong>{cf.indication}
                </div>
                {cf.niUsage && (
                  <div className="text-[11px] pt-2 border-t leading-relaxed" style={{ borderColor: 'rgba(184,146,42,0.1)', color: '#10b981' }}>
                    <strong>倪师要领：</strong>{cf.niUsage}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
