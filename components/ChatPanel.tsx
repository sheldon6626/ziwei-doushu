'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ZiweiChart } from '@/lib/ziwei/types';
import { generateLocalInterpretation } from '@/lib/ziwei/interpreter';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatPanelProps {
  chart: ZiweiChart;
}

const PRESET_QUESTIONS = [
  '我的整体命格如何？性格特点是什么？',
  '我的感情婚姻运势如何？',
  '我的事业财运如何？适合什么方向？',
  '我现在的大限运势如何？',
  '我的健康需要注意什么？',
  '今年的流年运势如何？',
];

export default function ChatPanel({ chart }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // 模拟流式打字输出
  const simulateLocalStream = async (fullText: string) => {
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
    let current = '';
    const chunkSize = 4;
    for (let i = 0; i < fullText.length; i += chunkSize) {
      current += fullText.slice(i, i + chunkSize);
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', content: current };
        return updated;
      });
      await new Promise(r => setTimeout(r, 16));
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // 检查是否配置了在线大模型 API Key
      let aiConfig: any = null;
      try {
        const saved = localStorage.getItem('ziwei_ai_config');
        if (saved) aiConfig = JSON.parse(saved);
      } catch { /* ignore */ }

      if (aiConfig?.enabled && aiConfig?.apiKey?.trim()) {
        try {
          const endpoint = (aiConfig.baseUrl || 'https://api.deepseek.com/v1').replace(/\/+$/, '') + '/chat/completions';
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${aiConfig.apiKey.trim()}`,
            },
            body: JSON.stringify({
              model: aiConfig.model || 'deepseek-chat',
              messages: [
                {
                  role: 'system',
                  content: `你是一位精通倪海厦天纪理论的紫微斗数大师。命盘五行局为${chart.wuxingJuName}，命宫在${chart.mingGongBranch}，身宫在${chart.shenGongBranch}。针对用户提问进行深刻命理解析。`,
                },
                ...messages.map(m => ({ role: m.role, content: m.content })),
                { role: 'user', content: text },
              ],
              stream: true,
            }),
          });

          if (res.ok && res.body) {
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let assistantText = '';
            setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              const chunk = decoder.decode(value, { stream: true });
              for (const line of chunk.split('\n')) {
                const trimmed = line.trim();
                if (!trimmed.startsWith('data:')) continue;
                const data = trimmed.replace(/^data:\s*/, '');
                if (data === '[DONE]') break;
                try {
                  const delta = JSON.parse(data).choices?.[0]?.delta?.content ?? '';
                  if (delta) {
                    assistantText += delta;
                    setMessages(prev => {
                      const updated = [...prev];
                      updated[updated.length - 1] = { role: 'assistant', content: assistantText };
                      return updated;
                    });
                  }
                } catch { /* skip */ }
              }
            }
            return;
          }
        } catch {
          // 在线调用失败，无缝回退到本地
        }
      }

      // 本地离线引擎生成
      let topic: string | undefined = undefined;
      if (text.includes('整体') || text.includes('命格') || text.includes('性格')) topic = 'overview';
      else if (text.includes('感情') || text.includes('婚姻')) topic = 'love';
      else if (text.includes('事业') || text.includes('工作')) topic = 'career';
      else if (text.includes('财运') || text.includes('赚钱')) topic = 'wealth';
      else if (text.includes('健康') || text.includes('身体')) topic = 'health';

      const localResult = generateLocalInterpretation({
        chart,
        topic,
        userPrompt: text,
      });

      await simulateLocalStream(localResult);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '命盘已由本地引擎完成解构，请随时提出具体问题或关注的宫位。',
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden card-glass">
      {/* 标题 */}
      <div className="px-4 py-3 md:px-5 md:py-3.5 flex-shrink-0" style={{ borderBottom: '1px solid var(--t-border)' }}>
        <h3 className="text-xs md:text-sm font-medium tracking-widest" style={{ color: 'var(--t-gold)' }}>AI 命盘解读</h3>
        <p className="text-[10px] md:text-xs mt-0.5" style={{ color: 'var(--t-faint)' }}>倪海厦正宗紫微斗数 · 智慧解析</p>
      </div>

      {/* 消息列表 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-5 space-y-3 min-h-0">
        {messages.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8 md:py-10">
            <div className="text-4xl md:text-5xl mb-3" style={{ color: 'var(--t-gold)', opacity: 0.15 }}>✦</div>
            <p className="text-xs md:text-sm leading-relaxed" style={{ color: 'var(--t-faint)' }}>
              命盘已生成，可直接提问<br />
              或从下方选择常见问题开始解读
            </p>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className="max-w-[85%] rounded-xl px-3.5 py-2.5 md:px-4 md:py-3 text-sm md:text-base leading-relaxed"
                style={msg.role === 'user' ? {
                  background: 'rgba(212,168,67,0.1)',
                  border: '1px solid rgba(212,168,67,0.2)',
                  color: 'var(--t-gold)',
                } : {
                  background: 'var(--t-card)',
                  border: '1px solid var(--t-border)',
                  color: 'var(--t-text)',
                }}
              >
                {msg.role === 'assistant' && (
                  <div className="text-[10px] md:text-xs mb-1" style={{ color: 'var(--t-faint)' }}>命理师 ·</div>
                )}
                <div className="whitespace-pre-wrap text-xs md:text-sm lg:text-[15px] leading-relaxed">
                  {msg.content}
                  {loading && i === messages.length - 1 && msg.role === 'assistant' && (
                    <span className="inline-block w-1.5 h-3 ml-0.5 animate-pulse" style={{ background: 'var(--t-gold)', opacity: 0.6 }} />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 预设问题 */}
      {messages.length === 0 && (
        <div className="px-3 pb-2 md:px-4 md:pb-3 flex-shrink-0">
          <div className="grid grid-cols-2 gap-1.5 md:gap-2">
            {PRESET_QUESTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q)}
                disabled={loading}
                className="text-left text-[10px] md:text-xs lg:text-sm rounded-lg px-2.5 py-2 md:px-3 md:py-2.5 transition-all line-clamp-2"
                style={{
                  color: 'var(--t-text2)',
                  border: '1px solid var(--t-border)',
                  background: 'transparent',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(212,168,67,0.3)';
                  e.currentTarget.style.color = 'var(--t-gold)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--t-border)';
                  e.currentTarget.style.color = 'var(--t-text2)';
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 输入框 */}
      <div className="px-3 pb-3 pt-2 flex-shrink-0" style={{ borderTop: '1px solid var(--t-border)' }}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
            placeholder="输入问题，如：我的感情运势如何？"
            disabled={loading}
            className="flex-1 rounded-lg px-3 py-2 text-xs focus:outline-none transition-colors"
            style={{
              background: 'var(--t-card)',
              border: '1px solid var(--t-border)',
              color: 'var(--t-text)',
            }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="px-3 py-2 rounded-lg text-xs font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: 'rgba(212,168,67,0.15)',
              border: '1px solid rgba(212,168,67,0.25)',
              color: 'var(--t-gold)',
            }}
          >
            {loading ? '…' : '发送'}
          </button>
        </div>
      </div>
    </div>
  );
}
