import { useState, useEffect } from 'react';

// Formspree configuration
const FORMSPREE_URL = 'https://formspree.io/f/xanrbdzy';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [email, setEmail] = useState('');
  const [formState, setFormState] = useState('idle'); // idle, submitting, success, error
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [currentPage]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsVisible({});
  }, [currentPage]);

  // Formspree submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setFormState('submitting');

    try {
      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setFormState('success');
        setEmail('');
      } else {
        setFormState('error');
      }
    } catch (error) {
      setFormState('error');
    }
  };

  const navigate = (page) => {
    setCurrentPage(page);
  };

  // Official Infinityproof Logo Component
  const Logo = ({ height = 28, color = '#000000' }) => (
    <svg height={height} viewBox="0 0 375 60" fill="none" style={{ cursor: 'pointer' }} onClick={() => navigate('home')}>
      <text x="0" y="42" style={{ fontFamily: 'Inter, sans-serif', fontSize: '28px', fontWeight: 600, letterSpacing: '0.12em', fill: color }}>
        INFINITY
      </text>
      <text x="155" y="42" style={{ fontFamily: 'Inter, sans-serif', fontSize: '28px', fontWeight: 300, letterSpacing: '0.12em', fill: color }}>
        PROOF
      </text>
      <g transform="translate(290, 8)">
        <line x1="4" y1="2" x2="36" y2="2" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="4" y1="42" x2="36" y2="42" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M8 4 L8 14 L20 22 L8 30 L8 40" stroke={color} strokeWidth="1.8" fill="none"/>
        <path d="M32 4 L32 14 L20 22 L32 30 L32 40" stroke={color} strokeWidth="1.8" fill="none"/>
        <line x1="6" y1="40" x2="34" y2="4" stroke={color} strokeWidth="1.5"/>
        <path d="M20 42 C24 42 28 38 28 34 C28 28 20 24 20 24 C20 24 12 28 12 34 C12 38 16 42 20 42 Z" fill={color}/>
        <circle cx="10" cy="8" r="1" fill={color}/>
        <circle cx="30" cy="8" r="1" fill={color}/>
        <circle cx="10" cy="14" r="1" fill={color}/>
        <circle cx="30" cy="14" r="1" fill={color}/>
        <circle cx="14" cy="20" r="0.8" fill={color}/>
        <circle cx="26" cy="20" r="0.8" fill={color}/>
      </g>
    </svg>
  );

  const HourglassIcon = ({ size = 40, color = 'currentColor' }) => (
    <svg width={size} height={size * 1.1} viewBox="0 0 40 44" fill="none">
      <line x1="4" y1="2" x2="36" y2="2" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="4" y1="42" x2="36" y2="42" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M8 4 L8 14 L20 22 L8 30 L8 40" stroke={color} strokeWidth="1.8" fill="none"/>
      <path d="M32 4 L32 14 L20 22 L32 30 L32 40" stroke={color} strokeWidth="1.8" fill="none"/>
      <line x1="6" y1="40" x2="34" y2="4" stroke={color} strokeWidth="1.5"/>
      <path d="M20 42 C24 42 28 38 28 34 C28 28 20 24 20 24 C20 24 12 28 12 34 C12 38 16 42 20 42 Z" fill={color}/>
    </svg>
  );

  // Navigation Component
  const Navigation = () => (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      padding: '1.5rem 4rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: scrollY > 50 ? 'rgba(250, 250, 248, 0.95)' : 'transparent',
      backdropFilter: scrollY > 50 ? 'blur(20px)' : 'none',
      transition: 'all 0.4s ease',
      borderBottom: scrollY > 50 ? '1px solid rgba(0,0,0,0.05)' : 'none'
    }}>
      <Logo height={24} />
      
      <div style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
        {[
          { label: 'Method', page: 'method' },
          { label: 'Features', page: 'features' },
          { label: 'Curriculum', page: 'curriculum' }
        ].map((item) => (
          <span 
            key={item.page} 
            className="nav-link" 
            onClick={() => navigate(item.page)}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.85rem',
              letterSpacing: '0.05em',
              color: currentPage === item.page ? '#3D4A28' : '#4a4a4a',
              textTransform: 'uppercase'
            }}
          >{item.label}</span>
        ))}
        <span 
          onClick={() => {
            navigate('home');
            setTimeout(() => {
              document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.85rem',
            letterSpacing: '0.05em',
            color: '#fff',
            background: '#3D4A28',
            padding: '0.75rem 1.5rem',
            borderRadius: '2px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >Get Early Access</span>
      </div>
    </nav>
  );

  // Footer Component
  const Footer = () => (
    <footer style={{
      padding: '4rem',
      background: '#111',
      borderTop: '1px solid rgba(255,255,255,0.05)'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
        <Logo height={20} color="#fff" />
        <div style={{ display: 'flex', gap: '2rem' }}>
          {['Method', 'Features', 'Curriculum'].map((item) => (
            <span 
              key={item}
              onClick={() => navigate(item.toLowerCase())}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.8rem',
                color: 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: 'color 0.3s'
              }}
            >{item}</span>
          ))}
        </div>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.4)'
        }}>
          © 2025 Infinityproof. Better Decisions for Founders.
        </p>
      </div>
    </footer>
  );

  // Email CTA Component with Formspree
  const EmailCTA = ({ dark = false }) => (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      {formState === 'success' ? (
        <div style={{
          padding: '2rem',
          background: 'rgba(139, 154, 70, 0.1)',
          borderRadius: '4px',
          border: '1px solid rgba(139, 154, 70, 0.3)',
          textAlign: 'center'
        }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.1rem', color: '#8B9A46' }}>
            ✓ You're on the list. We'll be in touch soon.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={formState === 'submitting'}
            style={{
              flex: '1 1 280px',
              padding: '1.25rem 1.5rem',
              fontFamily: "'Inter', sans-serif",
              fontSize: '1rem',
              background: dark ? 'rgba(255,255,255,0.05)' : '#fff',
              border: dark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
              borderRadius: '2px',
              color: dark ? '#fff' : '#1a1a1a',
              opacity: formState === 'submitting' ? 0.7 : 1
            }}
          />
          <button 
            type="submit" 
            className="cta-button" 
            disabled={formState === 'submitting'}
            style={{
              padding: '1.25rem 2.5rem',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.9rem',
              fontWeight: 600,
              letterSpacing: '0.05em',
              color: '#1a1a1a',
              border: 'none',
              borderRadius: '2px',
              cursor: formState === 'submitting' ? 'wait' : 'pointer',
              opacity: formState === 'submitting' ? 0.7 : 1
            }}
          >
            {formState === 'submitting' ? 'Joining...' : 'Get Early Access'}
          </button>
        </form>
      )}
      
      {formState === 'error' && (
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.85rem',
          color: '#c44',
          marginTop: '1rem',
          textAlign: 'center'
        }}>
          Something went wrong. Please try again.
        </p>
      )}
      
      {formState !== 'success' && formState !== 'error' && (
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.8rem',
          color: dark ? 'rgba(255,255,255,0.4)' : '#888',
          marginTop: '1rem',
          textAlign: 'center'
        }}>
          No spam. Unsubscribe anytime.
        </p>
      )}
    </div>
  );

  // ==================== HOME PAGE ====================
  const HomePage = () => (
    <>
      {/* Hero Section */}
      <section className="hero-gradient" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '8rem 4rem 4rem',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: '400px',
          height: '400px',
          border: '1px solid rgba(139, 154, 70, 0.1)',
          borderRadius: '50%',
          transform: `translateY(${scrollY * 0.1}px)`
        }} />
        
        <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <div className="animate-fadeInUp delay-1" style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.75rem',
              letterSpacing: '0.3em',
              color: '#8B9A46',
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <span style={{ width: '40px', height: '1px', background: '#8B9A46' }} />
              For Founders & Business Owners
            </div>
            
            <h1 className="animate-fadeInUp delay-2" style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(3rem, 6vw, 4.5rem)',
              fontWeight: 400,
              lineHeight: 1.1,
              marginBottom: '2rem',
              color: '#1a1a1a'
            }}>
              Stop Gambling.<br/>
              <span style={{ 
                fontStyle: 'italic',
                background: 'linear-gradient(135deg, #3D4A28 0%, #8B9A46 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>Start Deciding.</span>
            </h1>
            
            <p className="animate-fadeInUp delay-3" style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '1.15rem',
              lineHeight: 1.8,
              color: '#5a5a5a',
              maxWidth: '540px',
              marginBottom: '2.5rem'
            }}>
              A practical system for high-stakes decisions. Built for entrepreneurs who can't afford expensive consultants—but refuse to rely on gut feeling alone.
            </p>
            
            <div className="animate-fadeInUp delay-4" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <a href="#enroll" className="cta-button" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1.25rem 2.5rem',
                color: '#1a1a1a',
                textDecoration: 'none',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.9rem',
                fontWeight: 600,
                letterSpacing: '0.05em',
                borderRadius: '2px'
              }}>
                Join the Waitlist
                <span style={{ fontSize: '1.2rem' }}>→</span>
              </a>
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.8rem',
                color: '#888'
              }}>
                Limited early-bird spots
              </span>
            </div>
          </div>
          
          {/* Hero Visual - The Approach */}
          <div className="animate-fadeIn delay-3" style={{ position: 'relative' }}>
            <div style={{
              padding: '3rem',
              background: 'linear-gradient(145deg, #FFFFFF 0%, #F5F5F0 100%)',
              borderRadius: '4px',
              boxShadow: '0 40px 80px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(0,0,0,0.03)'
            }}>
              <p style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.7rem',
                letterSpacing: '0.2em',
                color: '#8B9A46',
                textTransform: 'uppercase',
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}>The Approach</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { num: '1', text: 'Set the right scope', desc: 'Make sure you\'re solving the right problem' },
                  { num: '2', text: 'Identify great options', desc: 'Create alternatives worth choosing from' },
                  { num: '3', text: 'Evaluate with clarity', desc: 'Think it through without getting stuck' },
                  { num: '4', text: 'Make it happen', desc: 'Turn your decision into results' }
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    padding: '1rem',
                    background: i === 0 ? 'rgba(139, 154, 70, 0.08)' : 'rgba(0,0,0,0.02)',
                    borderRadius: '3px',
                    border: i === 0 ? '1px solid rgba(139, 154, 70, 0.2)' : '1px solid transparent',
                    transition: 'all 0.3s ease'
                  }}>
                    <span style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '1.5rem',
                      fontWeight: 500,
                      color: '#8B9A46',
                      lineHeight: 1
                    }}>{item.num}</span>
                    <div>
                      <p style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        color: '#1a1a1a',
                        marginBottom: '0.25rem'
                      }}>{item.text}</p>
                      <p style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.8rem',
                        color: '#888'
                      }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="floating-element" style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                background: '#3D4A28',
                color: '#fff',
                padding: '1rem 1.25rem',
                borderRadius: '2px',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.7rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                boxShadow: '0 10px 30px rgba(61, 74, 40, 0.3)'
              }}>
                + AI Co-Pilot
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section style={{ padding: '8rem 4rem', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.75rem',
            letterSpacing: '0.3em',
            color: '#8B9A46',
            textTransform: 'uppercase',
            marginBottom: '2rem'
          }}>The Hidden Cost</p>
          
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 400,
            lineHeight: 1.3,
            marginBottom: '2rem',
            color: '#1a1a1a'
          }}>
            You're probably solving the <span style={{ fontStyle: 'italic' }}>wrong problem</span>—elegantly.
          </h2>
          
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '1.1rem',
            lineHeight: 1.9,
            color: '#666',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            Most founders don't fail from poor execution. They fail from optimizing the wrong decision. 
            Like a doctor treating symptoms instead of the disease—you can be brilliant and still lose everything.
          </p>
        </div>
      </section>

      <div className="section-divider" style={{ maxWidth: '1200px', margin: '0 auto' }} />

      {/* Outcomes Section */}
      <section style={{ padding: '8rem 4rem', background: '#FAFAF8' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.75rem',
              letterSpacing: '0.3em',
              color: '#8B9A46',
              textTransform: 'uppercase',
              marginBottom: '1.5rem'
            }}>What You'll Achieve</p>
            
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              fontWeight: 400,
              lineHeight: 1.3
            }}>
              Four Steps to <span style={{ fontStyle: 'italic' }}>Better Decisions</span>
            </h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '3rem' }}>
            {[
              {
                num: '01',
                title: 'Set the Right Scope',
                outcome: 'Stop wasting time on the wrong problem',
                desc: 'Before diving into solutions, make sure you\'re working on what actually matters. Define the boundaries of your decision so you don\'t solve the wrong problem brilliantly.'
              },
              {
                num: '02', 
                title: 'Identify Great Options',
                outcome: 'Give yourself choices worth making',
                desc: 'Your best decision can only ever be as good as your best option. Learn to generate alternatives beyond the obvious—from safe bets to bold moves.'
              },
              {
                num: '03',
                title: 'Evaluate with Clarity',
                outcome: 'Think it through without overthinking',
                desc: 'Cut through complexity and uncertainty. Know which information actually matters, and use simple tools to compare your options clearly.'
              },
              {
                num: '04',
                title: 'Make It Happen',
                outcome: 'Turn decisions into results',
                desc: 'Bridge the gap between deciding and doing. Build commitment before you start, and create conditions that make follow-through inevitable.'
              }
            ].map((item, i) => (
              <div 
                key={i}
                data-animate
                id={`outcome-${i}`}
                className={`feature-card ${isVisible[`outcome-${i}`] ? 'animate-fadeInUp' : ''}`}
                style={{ 
                  opacity: isVisible[`outcome-${i}`] ? 1 : 0,
                  animationDelay: `${i * 0.15}s`,
                  padding: '2.5rem',
                  borderRadius: '4px',
                  border: '1px solid rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                  <span className="step-number">{item.num}</span>
                  <div>
                    <h3 style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '1.5rem',
                      fontWeight: 500,
                      marginBottom: '0.5rem',
                      color: '#1a1a1a'
                    }}>{item.title}</h3>
                    <p style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      color: '#8B9A46',
                      marginBottom: '1rem'
                    }}>{item.outcome}</p>
                    <p style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.95rem',
                      lineHeight: 1.7,
                      color: '#666'
                    }}>{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <span 
              onClick={() => navigate('method')}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.9rem',
                color: '#3D4A28',
                cursor: 'pointer',
                borderBottom: '1px solid #3D4A28',
                paddingBottom: '2px'
              }}
            >
              Learn more about the method →
            </span>
          </div>
        </div>
      </section>

      {/* Quick Features Preview */}
      <section style={{
        padding: '6rem 4rem',
        background: 'linear-gradient(180deg, #3D4A28 0%, #2D3820 100%)',
        color: '#fff'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2rem, 3.5vw, 2.5rem)',
            fontWeight: 400,
            marginBottom: '3rem'
          }}>
            Everything You Need to <span style={{ color: '#C4A84B', fontStyle: 'italic' }}>Decide with Confidence</span>
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', marginBottom: '3rem' }}>
            {[
              { icon: '⚡', label: 'AI Co-Pilot', sub: 'Exclusive web app' },
              { icon: '📊', label: 'Case Study', sub: 'Real-world example' },
              { icon: '📋', label: 'Templates', sub: 'Ready to use' },
              { icon: '🎯', label: '10+ Modules', sub: 'Complete system' }
            ].map((item, i) => (
              <div key={i} style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{item.icon}</div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1rem', fontWeight: 500, marginBottom: '0.25rem' }}>{item.label}</p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>{item.sub}</p>
              </div>
            ))}
          </div>
          
          <span 
            onClick={() => navigate('features')}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.9rem',
              color: '#C4A84B',
              cursor: 'pointer',
              borderBottom: '1px solid #C4A84B',
              paddingBottom: '2px'
            }}
          >
            See all features →
          </span>
        </div>
      </section>

      {/* Final CTA */}
      <section id="enroll" style={{
        padding: '10rem 4rem',
        background: '#1a1a1a',
        color: '#fff',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '500px',
          border: '1px solid rgba(196, 168, 75, 0.1)',
          borderRadius: '50%'
        }} />
        
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div className="floating-element">
            <HourglassIcon size={48} color="#fff" />
          </div>
          
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            fontWeight: 400,
            lineHeight: 1.2,
            margin: '3rem 0 1.5rem'
          }}>
            Your Next Decision<br/>
            <span style={{ color: '#C4A84B', fontStyle: 'italic' }}>Could Change Everything</span>
          </h2>
          
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '1.1rem',
            lineHeight: 1.8,
            color: 'rgba(255,255,255,0.7)',
            marginBottom: '3rem'
          }}>
            Join the waitlist for early access and secure your early-bird pricing.
          </p>
          
          <EmailCTA dark />
        </div>
      </section>
    </>
  );

  // ==================== METHOD PAGE ====================
  const MethodPage = () => (
    <>
      <div className="page-header">
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.75rem',
          letterSpacing: '0.3em',
          color: '#8B9A46',
          textTransform: 'uppercase',
          marginBottom: '1.5rem'
        }}>The Method</p>
        
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
          fontWeight: 400,
          lineHeight: 1.2,
          marginBottom: '1.5rem',
          color: '#1a1a1a'
        }}>
          A System That <span style={{ fontStyle: 'italic' }}>Actually Works</span>
        </h1>
        
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '1.15rem',
          lineHeight: 1.8,
          color: '#666',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Adapted from approaches used in Fortune 500 boardrooms—simplified for founders who make decisions alone.
        </p>
      </div>

      {/* Core Philosophy */}
      <section style={{ padding: '6rem 4rem', background: '#fff' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <blockquote style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontStyle: 'italic',
            lineHeight: 1.6,
            color: '#1a1a1a',
            margin: '0 0 2rem'
          }}>
            "Your decision can only ever be as good as your best available option."
          </blockquote>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.95rem',
            color: '#666',
            lineHeight: 1.8
          }}>
            This single insight changes everything. Most people spend 90% of their energy evaluating options 
            and only 10% creating them. We flip that ratio. Because choosing between mediocre options—no matter how carefully—still leaves you with a mediocre result.
          </p>
        </div>
      </section>

      <div className="section-divider" style={{ maxWidth: '1200px', margin: '0 auto' }} />

      {/* The Four Steps */}
      <section style={{ padding: '6rem 4rem', background: '#FAFAF8' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {[
            {
              num: '01',
              title: 'Set the Right Scope',
              subtitle: 'Before you solve anything, make sure you\'re solving the right thing',
              points: [
                'Define what\'s actually at stake—and what isn\'t',
                'Identify who needs to be involved (and who doesn\'t)',
                'Set boundaries that focus your energy on what matters',
                'Recognize when you\'re answering the wrong question entirely'
              ],
              insight: 'Most strategic failures don\'t come from picking the wrong solution. They come from solving the wrong problem brilliantly.'
            },
            {
              num: '02',
              title: 'Identify Great Options',
              subtitle: 'Give yourself choices actually worth making',
              points: [
                'Move beyond the obvious two or three options',
                'Generate alternatives from safe to bold',
                'Combine elements from different approaches',
                'Make sure you have at least one option you\'re excited about'
              ],
              insight: 'If you\'re not excited about any of your options, you haven\'t generated enough of them yet.'
            },
            {
              num: '03',
              title: 'Evaluate with Clarity',
              subtitle: 'Cut through complexity without getting stuck',
              points: [
                'Identify which uncertainties actually matter for your decision',
                'Focus on the 20% of information that drives 80% of the outcome',
                'Use simple tools to compare options visually',
                'Know when you have enough information to decide'
              ],
              insight: 'More analysis doesn\'t always mean better decisions. Sometimes it just means more sophisticated procrastination.'
            },
            {
              num: '04',
              title: 'Make It Happen',
              subtitle: 'Turn your decision into reality',
              points: [
                'Build genuine commitment before you start executing',
                'Identify potential obstacles and plan for them',
                'Create accountability structures that work for you',
                'Know when to stay the course vs. when to adapt'
              ],
              insight: 'A good decision poorly executed will always lose to a decent decision executed well.'
            }
          ].map((step, i) => (
            <div 
              key={i}
              data-animate
              id={`method-step-${i}`}
              className={isVisible[`method-step-${i}`] ? 'animate-fadeInUp' : ''}
              style={{ 
                opacity: isVisible[`method-step-${i}`] ? 1 : 0,
                marginBottom: i < 3 ? '5rem' : 0,
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: '3rem'
              }}
            >
              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '6rem',
                fontWeight: 300,
                color: 'rgba(139, 154, 70, 0.15)',
                lineHeight: 1
              }}>{step.num}</span>
              
              <div>
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '2rem',
                  fontWeight: 500,
                  marginBottom: '0.5rem',
                  color: '#1a1a1a'
                }}>{step.title}</h2>
                
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '1rem',
                  color: '#8B9A46',
                  marginBottom: '1.5rem',
                  fontWeight: 500
                }}>{step.subtitle}</p>
                
                <ul style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.95rem',
                  lineHeight: 2,
                  color: '#555',
                  listStyle: 'none',
                  marginBottom: '1.5rem'
                }}>
                  {step.points.map((point, j) => (
                    <li key={j} style={{ display: 'flex', gap: '0.75rem' }}>
                      <span style={{ color: '#8B9A46' }}>→</span>
                      {point}
                    </li>
                  ))}
                </ul>
                
                <div style={{
                  padding: '1.25rem 1.5rem',
                  background: 'rgba(139, 154, 70, 0.08)',
                  borderLeft: '3px solid #8B9A46',
                  borderRadius: '0 4px 4px 0'
                }}>
                  <p style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.9rem',
                    fontStyle: 'italic',
                    color: '#3D4A28'
                  }}>
                    {step.insight}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '6rem 4rem', background: '#fff', textAlign: 'center' }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '2rem',
          fontWeight: 400,
          marginBottom: '2rem'
        }}>
          Ready to learn the complete system?
        </h2>
        <EmailCTA />
      </section>
    </>
  );

  // ==================== FEATURES PAGE ====================
  const FeaturesPage = () => (
    <>
      <div className="page-header">
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.75rem',
          letterSpacing: '0.3em',
          color: '#8B9A46',
          textTransform: 'uppercase',
          marginBottom: '1.5rem'
        }}>What You Get</p>
        
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
          fontWeight: 400,
          lineHeight: 1.2,
          marginBottom: '1.5rem',
          color: '#1a1a1a'
        }}>
          Everything You Need to <span style={{ fontStyle: 'italic' }}>Decide with Confidence</span>
        </h1>
      </div>

      {/* AI Co-Pilot Featured */}
      <section style={{ padding: '6rem 4rem', background: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem',
            alignItems: 'center',
            padding: '3rem',
            background: 'linear-gradient(145deg, rgba(139, 154, 70, 0.08) 0%, rgba(196, 168, 75, 0.05) 100%)',
            borderRadius: '8px',
            border: '1px solid rgba(139, 154, 70, 0.2)'
          }}>
            <div>
              <div style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                background: '#3D4A28',
                color: '#fff',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.7rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                borderRadius: '2px',
                marginBottom: '1.5rem'
              }}>
                Exclusive Feature
              </div>
              
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2.5rem',
                fontWeight: 500,
                marginBottom: '1rem',
                color: '#1a1a1a'
              }}>AI Decision Co-Pilot</h2>
              
              <p style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '1.05rem',
                lineHeight: 1.8,
                color: '#555',
                marginBottom: '1.5rem'
              }}>
                Your personal thinking partner for working through tough choices. Ask questions, explore options, and stress-test your reasoning—available 24/7 through our exclusive web application.
              </p>
              
              <ul style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.95rem',
                lineHeight: 2,
                color: '#666',
                listStyle: 'none'
              }}>
                {[
                  'Guides you through each step of the method',
                  'Helps you generate more and better options',
                  'Challenges your assumptions constructively',
                  'Available whenever you need to think through a decision'
                ].map((point, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.75rem' }}>
                    <span style={{ color: '#8B9A46' }}>✓</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            
            <div style={{
              background: '#fff',
              padding: '2rem',
              borderRadius: '4px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '32px', height: '32px', background: '#3D4A28', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#fff', fontSize: '0.8rem' }}>AI</span>
                </div>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', fontWeight: 500 }}>Decision Co-Pilot</span>
              </div>
              
              <div style={{
                padding: '1rem',
                background: '#F5F5F0',
                borderRadius: '4px',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.9rem',
                color: '#555',
                lineHeight: 1.6
              }}>
                "You've identified three options so far. Before we evaluate them—have you considered any bolder alternatives? What would you do if failure wasn't a concern?"
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Features Grid */}
      <section style={{ padding: '6rem 4rem', background: '#FAFAF8' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            {[
              {
                icon: '📊',
                title: 'Real Case Study',
                desc: 'Work through an actual high-stakes decision from start to finish. See exactly how the method applies to a real situation—not a textbook example.',
                details: ['Complete walkthrough', 'Real data and context', 'Step-by-step analysis']
              },
              {
                icon: '📋',
                title: 'Templates & Worksheets',
                desc: 'Ready-to-use tools for every step of the process. Stop staring at blank pages and start working through your decisions systematically.',
                details: ['Scoping worksheets', 'Option generators', 'Evaluation matrices']
              },
              {
                icon: '🎯',
                title: '10+ Video Modules',
                desc: 'Comprehensive training covering the complete system. Watch at your own pace, revisit when you need a refresher.',
                details: ['Clear explanations', 'Practical examples', 'Actionable takeaways']
              },
              {
                icon: '💡',
                title: 'Practical Insights',
                desc: 'Lessons distilled from corporate risk management and translated for entrepreneurs. No jargon, no fluff—just what works.',
                details: ['Real-world tested', 'Adapted for founders', 'Immediately applicable']
              },
              {
                icon: '🧠',
                title: 'Bias Defense Guide',
                desc: 'Learn to recognize the mental shortcuts that sabotage your decisions—and simple techniques to counter them.',
                details: ['Common decision traps', 'Recognition patterns', 'Countermeasures']
              },
              {
                icon: '🔄',
                title: 'Lifetime Updates',
                desc: 'As the course evolves, so does your access. New templates, new case studies, new insights—all included.',
                details: ['Continuous improvement', 'Community feedback', 'No extra cost']
              }
            ].map((feature, i) => (
              <div 
                key={i}
                data-animate
                id={`feature-detail-${i}`}
                className={`feature-card ${isVisible[`feature-detail-${i}`] ? 'animate-fadeInUp' : ''}`}
                style={{ 
                  opacity: isVisible[`feature-detail-${i}`] ? 1 : 0,
                  animationDelay: `${i * 0.1}s`,
                  padding: '2rem',
                  borderRadius: '4px',
                  border: '1px solid rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>{feature.icon}</div>
                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.35rem',
                  fontWeight: 500,
                  marginBottom: '1rem',
                  color: '#1a1a1a'
                }}>{feature.title}</h3>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.9rem',
                  lineHeight: 1.7,
                  color: '#666',
                  marginBottom: '1.25rem'
                }}>{feature.desc}</p>
                <ul style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.8rem',
                  color: '#888',
                  listStyle: 'none'
                }}>
                  {feature.details.map((d, j) => (
                    <li key={j} style={{ marginBottom: '0.35rem' }}>• {d}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '6rem 4rem', background: '#fff', textAlign: 'center' }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '2rem',
          fontWeight: 400,
          marginBottom: '2rem'
        }}>
          Get access to all features
        </h2>
        <EmailCTA />
      </section>
    </>
  );

  // ==================== CURRICULUM PAGE ====================
  const CurriculumPage = () => (
    <>
      <div className="page-header">
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.75rem',
          letterSpacing: '0.3em',
          color: '#8B9A46',
          textTransform: 'uppercase',
          marginBottom: '1.5rem'
        }}>Course Curriculum</p>
        
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
          fontWeight: 400,
          lineHeight: 1.2,
          marginBottom: '1.5rem',
          color: '#1a1a1a'
        }}>
          From Chaos to <span style={{ fontStyle: 'italic' }}>Clarity</span>
        </h1>
        
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '1.15rem',
          lineHeight: 1.8,
          color: '#666',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          10 modules that take you from overwhelmed by options to confident in your choices.
        </p>
      </div>

      {/* Module List */}
      <section style={{ padding: '4rem 4rem 8rem', background: '#fff' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {[
            { module: 'Module 1', title: 'Which Decisions Matter?', desc: 'Not every choice deserves the same effort. Learn to quickly categorize decisions and allocate your energy accordingly.', duration: '~20 min', outcomes: ['Distinguish quick calls from strategic decisions', 'Stop overthinking small choices', 'Focus your energy where it counts'] },
            { module: 'Module 2', title: 'Setting the Right Scope', desc: 'Before solving anything, make sure you\'re working on what actually matters. Define boundaries that focus your decision.', duration: '~35 min', outcomes: ['Define what\'s really at stake', 'Avoid scope creep', 'Frame decisions for clarity'] },
            { module: 'Module 3', title: 'What Are You Missing?', desc: 'A systematic approach to uncovering blind spots. Make sure you\'re not overlooking something critical.', duration: '~30 min', outcomes: ['Surface hidden assumptions', 'Identify key uncertainties', 'Gather the right perspectives'] },
            { module: 'Module 4', title: 'Creating Better Options', desc: 'Your best decision can only be as good as your best option. Learn to generate alternatives worth choosing from.', duration: '~40 min', outcomes: ['Move beyond obvious choices', 'Generate options from safe to bold', 'Combine elements creatively'] },
            { module: 'Module 5', title: 'Information That Matters', desc: 'Not all data is equal. Learn to identify the 20% of information that drives 80% of your decision.', duration: '~30 min', outcomes: ['Prioritize information gathering', 'Know when you have enough', 'Stop analysis paralysis'] },
            { module: 'Module 6', title: 'Knowing What Success Looks Like', desc: 'Define your criteria before emotions and pressure kick in. Get clear on what you\'re actually optimizing for.', duration: '~25 min', outcomes: ['Clarify what matters most', 'Handle conflicting priorities', 'Make trade-offs explicitly'] },
            { module: 'Module 7', title: 'Tools for Thinking Clearly', desc: 'Simple, practical methods for comparing options and handling uncertainty. No spreadsheet wizardry required.', duration: '~45 min', outcomes: ['Visualize trade-offs clearly', 'Handle uncertainty practically', 'Use simple but powerful tools'] },
            { module: 'Module 8', title: 'Outsmarting Your Own Brain', desc: 'Recognize the mental shortcuts that sabotage decisions—and learn simple techniques to counter them.', duration: '~35 min', outcomes: ['Spot common decision traps', 'Counter your own biases', 'Build better decision habits'] },
            { module: 'Module 9', title: 'Putting It All Together', desc: 'Work through a complete case study from start to finish. See exactly how all the pieces fit together.', duration: '~50 min', outcomes: ['Apply the full method', 'See real-world application', 'Build confidence through practice'] },
            { module: 'Module 10', title: 'From Decision to Action', desc: 'The gap between deciding and doing. Build commitment and create conditions for follow-through.', duration: '~30 min', outcomes: ['Build genuine commitment', 'Plan for obstacles', 'Make execution inevitable'] }
          ].map((item, i) => (
            <div 
              key={i}
              data-animate
              id={`curriculum-item-${i}`}
              className={isVisible[`curriculum-item-${i}`] ? 'animate-fadeInUp' : ''}
              style={{ 
                opacity: isVisible[`curriculum-item-${i}`] ? 1 : 0,
                padding: '2.5rem',
                marginBottom: '1.5rem',
                background: '#FAFAF8',
                borderRadius: '4px',
                border: '1px solid rgba(0,0,0,0.04)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.7rem', letterSpacing: '0.2em', color: '#8B9A46', textTransform: 'uppercase' }}>{item.module}</span>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 500, marginTop: '0.5rem', color: '#1a1a1a' }}>{item.title}</h3>
                </div>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', color: '#888' }}>{item.duration}</span>
              </div>
              
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.95rem', lineHeight: 1.7, color: '#666', marginBottom: '1.25rem' }}>{item.desc}</p>
              
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {item.outcomes.map((outcome, j) => (
                  <span key={j} style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', color: '#3D4A28', background: 'rgba(139, 154, 70, 0.1)', padding: '0.4rem 0.8rem', borderRadius: '2px' }}>
                    {outcome}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '4rem', background: '#FAFAF8' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', marginBottom: '2rem' }}>
            {[
              { num: '10+', label: 'Video Modules' },
              { num: '~6h', label: 'Total Content' },
              { num: '15+', label: 'Templates' }
            ].map((stat, i) => (
              <div key={i}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', fontWeight: 500, color: '#3D4A28' }}>{stat.num}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', color: '#666' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '6rem 4rem', background: '#fff', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 400, marginBottom: '2rem' }}>
          Ready to master decision-making?
        </h2>
        <EmailCTA />
      </section>
    </>
  );

  // ==================== RENDER ====================
  return (
    <div style={{
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      backgroundColor: '#FAFAF8',
      color: '#1a1a1a',
      minHeight: '100vh'
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        ::selection { background: #8B9A46; color: white; }
        
        body { overflow-x: hidden; }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fadeInUp { animation: fadeInUp 1s ease-out forwards; }
        .animate-fadeIn { animation: fadeIn 1.2s ease-out forwards; }
        
        .delay-1 { animation-delay: 0.2s; opacity: 0; }
        .delay-2 { animation-delay: 0.4s; opacity: 0; }
        .delay-3 { animation-delay: 0.6s; opacity: 0; }
        .delay-4 { animation-delay: 0.8s; opacity: 0; }
        
        .cta-button {
          background: linear-gradient(135deg, #C4A84B 0%, #D4B85B 50%, #C4A84B 100%);
          background-size: 200% 200%;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 20px rgba(196, 168, 75, 0.3);
        }
        
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(196, 168, 75, 0.4);
        }
        
        .feature-card {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          background: linear-gradient(180deg, #FFFFFF 0%, #F8F8F6 100%);
        }
        
        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
        }
        
        .nav-link {
          position: relative;
          transition: color 0.3s ease;
          cursor: pointer;
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 1px;
          background: #8B9A46;
          transition: width 0.3s ease;
        }
        
        .nav-link:hover::after { width: 100%; }
        
        .hero-gradient {
          background: 
            radial-gradient(ellipse at 30% 20%, rgba(139, 154, 70, 0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(196, 168, 75, 0.05) 0%, transparent 50%),
            linear-gradient(180deg, #FAFAF8 0%, #F5F5F0 100%);
        }
        
        .section-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, #D4D4C8 50%, transparent 100%);
        }
        
        input:focus {
          outline: none;
          border-color: #8B9A46;
          box-shadow: 0 0 0 3px rgba(139, 154, 70, 0.1);
        }
        
        .step-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: 5rem;
          font-weight: 300;
          color: rgba(139, 154, 70, 0.12);
          line-height: 1;
        }
        
        .floating-element {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        
        .page-header {
          padding: 12rem 4rem 6rem;
          background: linear-gradient(180deg, #FAFAF8 0%, #F5F5F0 100%);
          text-align: center;
        }
      `}</style>
      
      <Navigation />
      
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'method' && <MethodPage />}
      {currentPage === 'features' && <FeaturesPage />}
      {currentPage === 'curriculum' && <CurriculumPage />}
      
      <Footer />
    </div>
  );
}
