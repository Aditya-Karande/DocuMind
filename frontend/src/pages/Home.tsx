import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  FileText,
  MessageSquare,
  Brain,
  Upload,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
  Globe,
} from 'lucide-react';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/new');
    return null;
  }

  return (
    <div className="min-h-screen" style={{ background: '#080c14' }}>
      {/* Ambient glow layer — fixed, covers the whole page */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        {/* Top-center hero glow */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '900px',
          height: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(56,100,255,0.13) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
        {/* Features section glow — left */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '-10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.10) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }} />
        {/* Bottom glow — right */}
        <div style={{
          position: 'absolute',
          bottom: '10%',
          right: '-5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(56,100,255,0.09) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }} />
      </div>

      {/* Everything on top of the glow layer */}
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Navigation ── */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px 48px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: 38, height: 38,
              background: 'linear-gradient(135deg, #3864ff 0%, #6ee7f7 100%)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(56,100,255,0.35)',
            }}>
              <Brain size={20} color="#fff" />
            </div>
            <span style={{ fontSize: 18, fontWeight: 600, color: '#fff', letterSpacing: '-0.3px' }}>DocuMind</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link to="/login" style={{
              padding: '8px 16px',
              color: 'rgba(255,255,255,0.55)',
              fontSize: 14,
              fontWeight: 500,
              textDecoration: 'none',
              borderRadius: 8,
              transition: 'color 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
            >
              Sign in
            </Link>
            <Link to="/register" style={{
              padding: '8px 18px',
              background: 'linear-gradient(135deg, #3864ff, #5aa0ff)',
              color: '#fff',
              fontSize: 14,
              fontWeight: 500,
              textDecoration: 'none',
              borderRadius: 8,
              boxShadow: '0 0 16px rgba(56,100,255,0.3)',
              transition: 'box-shadow 0.2s, opacity 0.2s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 28px rgba(56,100,255,0.55)'; (e.currentTarget as HTMLElement).style.opacity = '0.9'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 16px rgba(56,100,255,0.3)'; (e.currentTarget as HTMLElement).style.opacity = '1'; }}
            >
              Get started
            </Link>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section style={{ maxWidth: 760, margin: '0 auto', padding: '120px 24px 100px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            padding: '6px 14px',
            background: 'rgba(56,100,255,0.10)',
            border: '1px solid rgba(56,100,255,0.22)',
            borderRadius: 100,
            marginBottom: 32,
          }}>
            <Sparkles size={13} color="#7aa4ff" />
            <span style={{ fontSize: 13, color: '#7aa4ff', fontWeight: 500 }}>AI-powered document intelligence</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(44px, 7vw, 76px)',
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1.08,
            letterSpacing: '-2px',
            marginBottom: 24,
          }}>
            Chat with your<br />
            <span style={{
              background: 'linear-gradient(100deg, #5a8fff 0%, #7ee8fa 60%, #a5f3c8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>documents</span>
          </h1>

          <p style={{
            fontSize: 18,
            color: 'rgba(255,255,255,0.45)',
            lineHeight: 1.7,
            maxWidth: 520,
            margin: '0 auto 44px',
          }}>
            Upload any document and have intelligent conversations. Get instant answers,
            generate summaries, and create quizzes powered by advanced AI.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/register" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 28px',
              background: 'linear-gradient(135deg, #3864ff, #5aa0ff)',
              color: '#fff',
              fontWeight: 600,
              fontSize: 15,
              textDecoration: 'none',
              borderRadius: 10,
              boxShadow: '0 0 32px rgba(56,100,255,0.35)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-1px)'; el.style.boxShadow = '0 0 44px rgba(56,100,255,0.5)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'none'; el.style.boxShadow = '0 0 32px rgba(56,100,255,0.35)'; }}
            >
              Start free
              <ArrowRight size={17} />
            </Link>
            <Link to="/login" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 28px',
              background: 'rgba(255,255,255,0.05)',
              color: 'rgba(255,255,255,0.7)',
              fontWeight: 500,
              fontSize: 15,
              textDecoration: 'none',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.09)',
              transition: 'background 0.15s, color 0.15s',
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,0.09)'; el.style.color = '#fff'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,0.05)'; el.style.color = 'rgba(255,255,255,0.7)'; }}
            >
              Sign in
            </Link>
          </div>
        </section>

        {/* ── Features ── */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 120px' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(56,100,255,0.7)', marginBottom: 14 }}>CAPABILITIES</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#fff', letterSpacing: '-1px', marginBottom: 16 }}>
              Everything you need to understand<br />your documents
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', maxWidth: 440, margin: '0 auto' }}>
              Powerful AI tools to extract insights from any document format
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            {/* Card 1 */}
            <div style={{
              padding: '32px 28px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 16,
              transition: 'border-color 0.2s, background 0.2s',
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(56,100,255,0.3)'; el.style.background = 'rgba(56,100,255,0.05)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(255,255,255,0.07)'; el.style.background = 'rgba(255,255,255,0.03)'; }}
            >
              <div style={{
                width: 44, height: 44,
                background: 'rgba(56,100,255,0.15)',
                border: '1px solid rgba(56,100,255,0.25)',
                borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20,
              }}>
                <MessageSquare size={22} color="#7aa4ff" />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 600, color: '#fff', marginBottom: 10 }}>Smart chat</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.65 }}>
                Ask questions in natural language and get accurate answers with source citations from your documents.
              </p>
            </div>

            {/* Card 2 */}
            <div style={{
              padding: '32px 28px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 16,
              transition: 'border-color 0.2s, background 0.2s',
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(20,200,120,0.3)'; el.style.background = 'rgba(20,200,120,0.04)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(255,255,255,0.07)'; el.style.background = 'rgba(255,255,255,0.03)'; }}
            >
              <div style={{
                width: 44, height: 44,
                background: 'rgba(20,200,120,0.12)',
                border: '1px solid rgba(20,200,120,0.22)',
                borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20,
              }}>
                <FileText size={22} color="#4de8a8" />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 600, color: '#fff', marginBottom: 10 }}>Auto summaries</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.65 }}>
                Generate comprehensive summaries of lengthy documents in seconds. Save hours of reading time.
              </p>
            </div>

            {/* Card 3 */}
            <div style={{
              padding: '32px 28px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 16,
              transition: 'border-color 0.2s, background 0.2s',
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(160,90,255,0.3)'; el.style.background = 'rgba(160,90,255,0.04)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(255,255,255,0.07)'; el.style.background = 'rgba(255,255,255,0.03)'; }}
            >
              <div style={{
                width: 44, height: 44,
                background: 'rgba(160,90,255,0.12)',
                border: '1px solid rgba(160,90,255,0.22)',
                borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20,
              }}>
                <Brain size={22} color="#c084fc" />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 600, color: '#fff', marginBottom: 10 }}>Quiz generator</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.65 }}>
                Create interactive quizzes from your documents to test knowledge and improve retention.
              </p>
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px 120px' }}>
          {/* Thin divider line with gradient fade */}
          <div style={{
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(56,100,255,0.25), transparent)',
            marginBottom: 80,
          }} />

          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#fff', letterSpacing: '-1px', marginBottom: 12 }}>
              Simple. Fast. Intelligent.
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)' }}>Three steps from document to insight</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, position: 'relative' }}>
            {/* connector line */}
            <div aria-hidden="true" style={{
              position: 'absolute',
              top: 28,
              left: 'calc(16.6% + 22px)',
              right: 'calc(16.6% + 22px)',
              height: 1,
              background: 'linear-gradient(90deg, rgba(56,100,255,0.4), rgba(110,231,247,0.4))',
            }} />

            {[
              { icon: <Upload size={24} color="#7aa4ff" />, label: 'Upload', desc: 'Drop a PDF, Word doc, or text file', n: '01', bg: 'rgba(56,100,255,0.12)', border: 'rgba(56,100,255,0.22)' },
              { icon: <Zap size={24} color="#4de8a8" />, label: 'Process', desc: 'AI indexes and understands your content', n: '02', bg: 'rgba(20,200,120,0.12)', border: 'rgba(20,200,120,0.22)' },
              { icon: <MessageSquare size={24} color="#c084fc" />, label: 'Interact', desc: 'Chat, summarize, or quiz — instantly', n: '03', bg: 'rgba(160,90,255,0.12)', border: 'rgba(160,90,255,0.22)' },
            ].map(({ icon, label, desc, n, bg, border }) => (
              <div key={n} style={{ textAlign: 'center', padding: '0 24px' }}>
                <div style={{
                  width: 56, height: 56,
                  background: bg,
                  border: `1px solid ${border}`,
                  borderRadius: 14,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px',
                  position: 'relative',
                  zIndex: 1,
                }}>
                  {icon}
                </div>
                <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1px', color: 'rgba(255,255,255,0.25)', marginBottom: 8 }}>{n}</p>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 8 }}>{label}</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Benefits / Chat mockup ── */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 120px' }}>
          <div style={{
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(160,90,255,0.2), transparent)',
            marginBottom: 80,
          }} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(160,90,255,0.7)', marginBottom: 14 }}>WHY DOCUMIND</p>
              <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.8px', lineHeight: 1.2, marginBottom: 36 }}>
                Built for productivity<br />and security
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {[
                  { icon: <CheckCircle2 size={18} color="#4de8a8" />, bg: 'rgba(20,200,120,0.1)', border: 'rgba(20,200,120,0.18)', title: 'Multi-format support', desc: 'Works with PDF, Word, PowerPoint, and plain text' },
                  { icon: <Shield size={18} color="#7aa4ff" />, bg: 'rgba(56,100,255,0.1)', border: 'rgba(56,100,255,0.18)', title: 'Secure & private', desc: 'Your documents are processed securely and never shared' },
                  { icon: <Brain size={18} color="#c084fc" />, bg: 'rgba(160,90,255,0.1)', border: 'rgba(160,90,255,0.18)', title: 'Interactive quizzes', desc: 'Test your learning with AI-generated quizzes from your documents' },
                ].map(({ icon, bg, border, title, desc }) => (
                  <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <div style={{
                      width: 36, height: 36,
                      background: bg,
                      border: `1px solid ${border}`,
                      borderRadius: 10,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {icon}
                    </div>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{title}</p>
                      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', lineHeight: 1.6 }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat mockup */}
            <div style={{ position: 'relative' }}>
              <div aria-hidden="true" style={{
                position: 'absolute', inset: -24,
                background: 'radial-gradient(ellipse, rgba(56,100,255,0.12) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(32px)',
              }} />
              <div style={{
                position: 'relative',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 18,
                padding: '20px 20px 24px',
                backdropFilter: 'blur(12px)',
              }}>
                {/* Window chrome */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
                  {['#ff5f57', '#ffbd2e', '#28c840'].map(c => (
                    <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.7 }} />
                  ))}
                  <div style={{
                    flex: 1, marginLeft: 8,
                    height: 22, background: 'rgba(255,255,255,0.05)',
                    borderRadius: 6,
                    display: 'flex', alignItems: 'center', paddingLeft: 10,
                  }}>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>annual-report-2024.pdf</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {/* User message */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #3864ff, #5a94ff)',
                      color: '#fff',
                      padding: '10px 14px',
                      borderRadius: '14px 14px 4px 14px',
                      fontSize: 13,
                      maxWidth: '75%',
                      lineHeight: 1.5,
                    }}>
                      What are the key findings in the research paper?
                    </div>
                  </div>
                  {/* AI response */}
                  <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 8 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                      background: 'linear-gradient(135deg, #3864ff, #6ee7f7)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Brain size={14} color="#fff" />
                    </div>
                    <div style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'rgba(255,255,255,0.8)',
                      padding: '10px 14px',
                      borderRadius: '14px 14px 14px 4px',
                      fontSize: 13,
                      maxWidth: '80%',
                      lineHeight: 1.6,
                    }}>
                      <p style={{ marginBottom: 8, color: 'rgba(255,255,255,0.6)' }}>The research identifies three key findings:</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {[
                          { label: '40%', text: 'improvement in efficiency' },
                          { label: '$2.3M', text: 'annual cost reduction' },
                          { label: '95%', text: 'user satisfaction rate' },
                        ].map(({ label, text }) => (
                          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{
                              fontSize: 11, fontWeight: 700,
                              color: '#7aa4ff',
                              background: 'rgba(56,100,255,0.15)',
                              padding: '2px 7px',
                              borderRadius: 5,
                              flexShrink: 0,
                            }}>{label}</span>
                            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Input bar */}
                <div style={{
                  marginTop: 16,
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 10,
                  padding: '9px 12px',
                }}>
                  <span style={{ flex: 1, fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>Ask a follow-up question…</span>
                  <div style={{
                    width: 26, height: 26, borderRadius: 7,
                    background: 'rgba(56,100,255,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <ArrowRight size={13} color="#7aa4ff" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px 120px', textAlign: 'center' }}>
          <div style={{
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(56,100,255,0.2), transparent)',
            marginBottom: 80,
          }} />
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: '#fff', letterSpacing: '-1.2px', lineHeight: 1.15, marginBottom: 16 }}>
            Ready to understand<br />your documents?
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.38)', marginBottom: 40 }}>
            Join thousands of users who save hours every week with DocuMind
          </p>
          <Link to="/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: 9,
            padding: '14px 32px',
            background: 'linear-gradient(135deg, #3864ff, #5aa0ff)',
            color: '#fff',
            fontWeight: 600,
            fontSize: 15,
            textDecoration: 'none',
            borderRadius: 11,
            boxShadow: '0 0 48px rgba(56,100,255,0.4)',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 0 64px rgba(56,100,255,0.55)'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'none'; el.style.boxShadow = '0 0 48px rgba(56,100,255,0.4)'; }}
          >
            Get started free
            <ArrowRight size={18} />
          </Link>
        </section>

        {/* ── Footer ── */}
        <footer style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '28px 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '100%',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Brain size={16} color="rgba(255,255,255,0.3)" />
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>DocuMind</span>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
            © {new Date().getFullYear()} DocuMind. Intelligent document conversations.
          </p>
        </footer>

      </div>
    </div>
  );
};

export default Home;