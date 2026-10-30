'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DIJI_MODULES, DIJI_STATS } from '@/lib/nihai/diji';
import { SANJI_CATEGORIES } from '@/lib/nihai';

export default function DijiPage() {
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
                  color: cat.key === 'diji' ? '#fff' : 'var(--tx-3, #a89878)',
                  background: cat.key === 'diji' ? '#6b8a5e' : 'transparent',
                  border: cat.key === 'diji' ? '1px solid #6b8a5e' : '1px solid transparent',
                  fontWeight: cat.key === 'diji' ? 600 : 400,
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
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] tracking-[0.25em] mb-4 border"
          style={{ color: '#10b981', borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.08)' }}>
          <span>✓ 遗稿考据与学术研读已开放</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-[0.18em] mb-3" style={{ color: 'var(--tx-0, #f5ecd7)' }}>
          地纪 · 下知地理
        </h1>
        <p className="text-xs sm:text-sm tracking-[0.12em] max-w-2xl mx-auto leading-relaxed mb-6" style={{ color: 'var(--tx-2, #c8b99d)' }}>
          倪海厦先生生前规划之山川国家地理宏篇。以神州大地龙脉结穴、山川形势与国运兴衰为脉络，融汇杨公堪舆、水龙经与历代方志。虽属未竟之业，门人后辈正根据讲义录音整理补注。
        </p>

        {/* 统计指标卡 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mx-auto mb-8">
          <div className="p-3 rounded-lg border text-center" style={{ background: 'rgba(107,138,94,0.06)', borderColor: 'rgba(107,138,94,0.25)' }}>
            <div className="text-xl font-bold" style={{ color: '#88a87b' }}>{DIJI_STATS.totalModules} 大</div>
            <div className="text-[11px] tracking-wider mt-0.5" style={{ color: 'var(--tx-3, #8a7a60)' }}>地理考察专题体系</div>
          </div>
          <div className="p-3 rounded-lg border text-center" style={{ background: 'rgba(107,138,94,0.06)', borderColor: 'rgba(107,138,94,0.25)' }}>
            <div className="text-xl font-bold" style={{ color: '#88a87b' }}>{DIJI_STATS.totalChapters} 篇</div>
            <div className="text-[11px] tracking-wider mt-0.5" style={{ color: 'var(--tx-3, #8a7a60)' }}>山川龙脉考证纪事</div>
          </div>
          <div className="p-3 rounded-lg border text-center col-span-2 sm:col-span-1" style={{ background: 'rgba(107,138,94,0.06)', borderColor: 'rgba(107,138,94,0.25)' }}>
            <div className="text-xl font-bold" style={{ color: '#88a87b' }}>2007~</div>
            <div className="text-[11px] tracking-wider mt-0.5" style={{ color: 'var(--tx-3, #8a7a60)' }}>撰述手稿与实地行脚</div>
          </div>
        </div>
      </div>

      {/* 模块详情 */}
      <main className="max-w-4xl mx-auto px-6 pb-24 space-y-6">
        {DIJI_MODULES.map(m => (
          <div
            key={m.id}
            className="p-6 rounded-xl border"
            style={{ background: 'rgba(26,20,16,0.6)', borderColor: 'rgba(107,138,94,0.3)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl text-emerald-500">{m.icon}</span>
                <h2 className="text-xl font-bold tracking-wider" style={{ color: 'var(--tx-0, #f5ecd7)' }}>
                  {m.name}
                </h2>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded border border-emerald-900/50 text-emerald-400 bg-emerald-950/20">
                {m.school || '地理堪舆'}
              </span>
            </div>

            <div className="text-xs font-semibold mb-2" style={{ color: '#88a87b' }}>{m.subtitle}</div>
            <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--tx-2, #c8b99d)' }}>{m.description}</p>

            <div className="space-y-2 mb-5">
              {m.details.map((d, idx) => (
                <div key={idx} className="text-xs leading-relaxed flex items-start gap-2" style={{ color: 'var(--tx-3, #a89878)' }}>
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{d}</span>
                </div>
              ))}
            </div>

            {/* 章节与考据 */}
            <div className="pt-4 border-t space-y-3" style={{ borderColor: 'rgba(184,146,42,0.15)' }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--ac, #b8922a)' }}>
                章节考据与实地纪要：
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {m.chapters.map(ch => (
                  <div key={ch.id} className="p-3 rounded-lg bg-black/40 border border-emerald-950/40">
                    <div className="text-xs font-bold text-emerald-300 mb-1">{ch.title}</div>
                    {ch.subtitle && <div className="text-[10px] text-amber-500/80 mb-1">{ch.subtitle}</div>}
                    <div className="text-[11px] leading-relaxed mb-2" style={{ color: 'var(--tx-3, #a89878)' }}>{ch.description}</div>
                    <div className="space-y-1">
                      {ch.keyPoints.map((kp, kpi) => (
                        <div key={kpi} className="text-[10px] text-zinc-400">❖ {kp}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
