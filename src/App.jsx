import { useState, useEffect } from 'react';

// Formspree configuration
const FORMSPREE_URL = 'https://formspree.io/f/xanrbdzy';

// Email CTA Component - self-contained with its own state
const EmailCTA = ({ dark = false }) => {
  const [email, setEmail] = useState('');
  const [formState, setFormState] = useState('idle');

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

  return (
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
        <form onSubmit={handleSubmit} className="cta-form" style={{
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
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const navigate = (page) => {
    setCurrentPage(page);
  };

  // Text-only Logo Component with Livvic font
  const Logo = ({ height = 28, color = '#1a1a1a' }) => (
    <div 
      onClick={() => navigate('home')} 
      style={{ 
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        userSelect: 'none',
        gap: '0'
      }}
    >
      <span style={{ 
        fontFamily: "'Livvic', sans-serif", 
        fontSize: `${height * 0.85}px`, 
        fontWeight: 600, 
        letterSpacing: '0.4em', 
        color: color 
      }}>
        INFINITY
      </span>
      <span style={{ 
        fontFamily: "'Livvic', sans-serif", 
        fontSize: `${height * 0.85}px`, 
        fontWeight: 300, 
        letterSpacing: '0.4em', 
        color: color,
        opacity: 0.6
      }}>
        PROOF
      </span>
    </div>
  );

  // Navigation Component
  const Navigation = () => (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      padding: '1rem 1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: scrollY > 50 || mobileMenuOpen ? 'rgba(250, 250, 248, 0.98)' : 'transparent',
      backdropFilter: scrollY > 50 || mobileMenuOpen ? 'blur(20px)' : 'none',
      transition: 'all 0.4s ease',
      borderBottom: scrollY > 50 ? '1px solid rgba(0,0,0,0.05)' : 'none'
    }}>
      <Logo height={20} />
      
      {/* Desktop Navigation */}
      <div className="nav-desktop" style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
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
      
      {/* Mobile Menu Button */}
      <div 
        className="nav-mobile"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        style={{ 
          display: 'none', 
          flexDirection: 'column', 
          gap: '5px', 
          cursor: 'pointer',
          padding: '8px'
        }}
      >
        <span style={{ width: '24px', height: '2px', background: '#3D4A28', transition: 'all 0.3s', transform: mobileMenuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} />
        <span style={{ width: '24px', height: '2px', background: '#3D4A28', transition: 'all 0.3s', opacity: mobileMenuOpen ? 0 : 1 }} />
        <span style={{ width: '24px', height: '2px', background: '#3D4A28', transition: 'all 0.3s', transform: mobileMenuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
      </div>
      
      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'rgba(250, 250, 248, 0.98)',
          backdropFilter: 'blur(20px)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          borderBottom: '1px solid rgba(0,0,0,0.05)'
        }}>
          {[
            { label: 'Method', page: 'method' },
            { label: 'Features', page: 'features' },
            { label: 'Curriculum', page: 'curriculum' }
          ].map((item) => (
            <span 
              key={item.page}
              onClick={() => { navigate(item.page); setMobileMenuOpen(false); }}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '1rem',
                color: currentPage === item.page ? '#3D4A28' : '#4a4a4a',
                cursor: 'pointer',
                padding: '0.5rem 0'
              }}
            >{item.label}</span>
          ))}
          <span 
            onClick={() => {
              navigate('home');
              setMobileMenuOpen(false);
              setTimeout(() => {
                document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '1rem',
              color: '#fff',
              background: '#3D4A28',
              padding: '1rem',
              borderRadius: '2px',
              cursor: 'pointer',
              textAlign: 'center',
              marginTop: '0.5rem'
            }}
          >Get Early Access</span>
        </div>
      )}
    </nav>
  );

  // Footer Component
  const Footer = () => (
    <footer className="site-footer" style={{
      padding: '4rem',
      background: '#111',
      borderTop: '1px solid rgba(255,255,255,0.05)'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div className="footer-grid" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem' }}>
          <Logo height={20} color="#fff" />
          <div className="footer-links" style={{ display: 'flex', gap: '2rem' }}>
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
        </div>
        
        <div className="footer-bottom" style={{ 
          borderTop: '1px solid rgba(255,255,255,0.1)', 
          paddingTop: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '2rem'
        }}>
          <div className="impressum-section">
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.6)',
              marginBottom: '0.5rem',
              fontWeight: 500
            }}>Impressum</p>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.7rem',
              color: 'rgba(255,255,255,0.4)',
              lineHeight: 1.8
            }}>
              Infinityproof UG (haftungsbeschränkt)<br/>
              Rauschenbergstr. 4a, 36039 Fulda<br/>
              HRB 8887, Amtsgericht Fulda<br/>
              USt-IdNr.: DE370167179
            </p>
          </div>
          <p className="copyright-text" style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.4)'
          }}>
            © 2025 Infinityproof. Better Decisions for Founders.
          </p>
        </div>
      </div>
    </footer>
  );

  // ==================== HOME PAGE ====================
  const HomePage = () => (
    <>
      {/* Hero Section */}
      <section className="hero-gradient hero-section" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '8rem 4rem 4rem',
        position: 'relative'
      }}>
        <div className="decorative-circle" style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: '400px',
          height: '400px',
          border: '1px solid rgba(139, 154, 70, 0.1)',
          borderRadius: '50%',
          transform: `translateY(${scrollY * 0.1}px)`
        }} />
        
        <div className="hero-grid" style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center' }}>
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
              A practical system for high-stakes decisions—powered by the perfect synergy of human judgment and AI support. Built for entrepreneurs who refuse to rely on gut feeling alone.
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
                color: '#8B9A46'
              }}>
                60 days free AI Decision Partner for Early Birds
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
              }}>Human + AI Synergy</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { num: '1', text: 'Set the right scope', desc: 'You define the problem, AI helps you challenge it' },
                  { num: '2', text: 'Identify great options', desc: 'You bring expertise, AI expands your thinking' },
                  { num: '3', text: 'Understand value drivers & risks', desc: 'You know your context, AI structures the analysis' },
                  { num: '4', text: 'Evaluate with clarity', desc: 'Go beyond intuition with proven methods and AI guidance' }
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
              
              <div className="floating-element floating-badge" style={{
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
                + AI Decision Partner
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="section-padding" style={{ padding: '8rem 4rem', background: '#FFFFFF' }}>
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

      {/* Why Human + AI Section */}
      <section className="section-padding" style={{ padding: '6rem 4rem', background: '#FAFAF8' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.75rem',
              letterSpacing: '0.3em',
              color: '#8B9A46',
              textTransform: 'uppercase',
              marginBottom: '1.5rem'
            }}>The Core Principle</p>
            
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              fontWeight: 400,
              lineHeight: 1.3
            }}>
              Neither Human Nor AI Alone—<span style={{ fontStyle: 'italic' }}>Both Together</span>
            </h2>
          </div>
          
          <div className="three-col-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            {[
              {
                title: 'Human Strengths',
                color: '#3D4A28',
                items: ['Domain expertise & context', 'Values & priorities', 'Creative leaps', 'Final judgment calls']
              },
              {
                title: 'AI Strengths', 
                color: '#8B9A46',
                items: ['Structured analysis', 'Bias detection', 'Option expansion', 'Consistent frameworks']
              },
              {
                title: 'Combined Power',
                color: '#C4A84B',
                items: ['Better problem framing', 'Richer alternatives', 'Better analysis', 'More business value']
              }
            ].map((col, i) => (
              <div key={i} style={{
                padding: '2rem',
                background: '#fff',
                borderRadius: '4px',
                borderTop: `3px solid ${col.color}`
              }}>
                <h3 style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: col.color,
                  marginBottom: '1.5rem'
                }}>{col.title}</h3>
                <ul style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.9rem',
                  lineHeight: 2,
                  color: '#555',
                  listStyle: 'none'
                }}>
                  {col.items.map((item, j) => (
                    <li key={j}>→ {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Outcomes Section */}
      <section className="section-padding" style={{ padding: '6rem 4rem', background: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
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
          
          <div className="two-col-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
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
                title: 'Understand Value Drivers & Risks',
                outcome: 'Know what moves the needle',
                desc: 'Identify the key factors that determine success or failure. Separate what you know from what remains uncertain, and focus on the variables that actually matter.'
              },
              {
                num: '04',
                title: 'Evaluate with Clarity',
                outcome: 'Go beyond gut feeling',
                desc: 'Compare your options against clear criteria—both financial and non-financial. Use proven methods to see trade-offs clearly and decide with confidence.'
              }
            ].map((item, i) => (
              <div 
                key={i}
                className="feature-card"
                style={{ 
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
          
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
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
          
          <div className="four-col-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', marginBottom: '3rem' }}>
            {[
              { icon: '⚡', label: 'AI Decision Partner', sub: '60 days free for Early Birds' },
              { icon: '◉', label: 'Case Study', sub: 'Practical scenario' },
              { icon: '▤', label: 'Templates', sub: 'Ready to use' },
              { icon: '◎', label: 'Full Course', sub: 'Complete system' }
            ].map((item, i) => (
              <div key={i} style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '1rem', opacity: 0.9 }}>{item.icon}</div>
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
        padding: '8rem 4rem',
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
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            fontWeight: 400,
            lineHeight: 1.2,
            marginBottom: '1.5rem'
          }}>
            Your Next Decision<br/>
            <span style={{ color: '#C4A84B', fontStyle: 'italic' }}>Could Change Everything</span>
          </h2>
          
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '1.1rem',
            lineHeight: 1.8,
            color: 'rgba(255,255,255,0.7)',
            marginBottom: '1rem'
          }}>
            Join the waitlist for early access and secure your early-bird pricing.
          </p>
          
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.95rem',
            color: '#C4A84B',
            marginBottom: '2.5rem'
          }}>
            ✦ Early Bird Bonus: 60 days free AI Decision Partner access
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
          Combining proven decision frameworks with AI support—designed for founders who make critical choices alone.
        </p>
      </div>

      {/* Core Philosophy */}
      <section className="section-padding" style={{ padding: '5rem 4rem', background: '#fff' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div className="philosophy-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '3rem',
            padding: '3rem',
            background: 'linear-gradient(145deg, rgba(139, 154, 70, 0.05) 0%, rgba(196, 168, 75, 0.03) 100%)',
            borderRadius: '8px'
          }}>
            <div>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.75rem',
                fontWeight: 500,
                marginBottom: '1rem',
                color: '#1a1a1a'
              }}>Why Process Over Outcome?</h3>
              <p style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.95rem',
                lineHeight: 1.8,
                color: '#555'
              }}>
                A good decision can lead to a bad outcome (bad luck). A bad decision can lead to a good outcome (good luck). 
                You can't control luck—but you can control your process. That's why we measure decision quality by how well you decided, not by what happened after.
              </p>
            </div>
            <div>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.75rem',
                fontWeight: 500,
                marginBottom: '1rem',
                color: '#1a1a1a'
              }}>Why Human + AI?</h3>
              <p style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.95rem',
                lineHeight: 1.8,
                color: '#555'
              }}>
                You bring what AI can't: real-world context, personal values, creative intuition, and the final call. 
                AI brings what's hard for humans: structured thinking, bias awareness, tireless analysis, and consistent frameworks. Together, you're better than either alone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Four Steps */}
      <section className="section-padding" style={{ padding: '5rem 4rem', background: '#FAFAF8' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '2rem',
            fontWeight: 400,
            marginBottom: '3rem',
            textAlign: 'center'
          }}>The Four Steps</h2>
          
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
              ai: 'AI helps you stress-test your framing and spot blind spots you might miss.'
            },
            {
              num: '02',
              title: 'Identify Great Options',
              subtitle: 'Give yourself choices actually worth making',
              points: [
                'Escape the binary trap—decisions aren\'t just yes or no on a single option',
                'Generate alternatives from safe to bold',
                'Combine elements from different approaches',
                'Find multiple options you\'re excited about—your decision is only as good as your best alternative'
              ],
              ai: 'AI expands your thinking with structured brainstorming and creative prompts.'
            },
            {
              num: '03',
              title: 'Understand Value Drivers & Risks',
              subtitle: 'Know what moves the needle—and what could go wrong',
              points: [
                'Identify the key factors that determine success or failure',
                'Separate what you know from what remains uncertain',
                'Understand which risks you can manage and which you must accept',
                'Focus analysis on variables that actually impact your decision'
              ],
              ai: 'AI helps you map uncertainties and structure your information gathering.'
            },
            {
              num: '04',
              title: 'Evaluate with Clarity',
              subtitle: 'Go beyond intuition with proven methods',
              points: [
                'Compare options against your specific success criteria',
                'Weigh financial and non-financial factors appropriately',
                'Use simple but powerful tools to see trade-offs clearly',
                'Know when you have enough clarity to decide confidently'
              ],
              ai: 'AI guides you through structured evaluation and bias checks.'
            }
          ].map((step, i) => (
            <div 
              key={i}
              className="method-grid"
              style={{ 
                marginBottom: i < 3 ? '4rem' : 0,
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: '2.5rem'
              }}
            >
              <span className="step-number" style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '5rem',
                fontWeight: 300,
                color: 'rgba(139, 154, 70, 0.15)',
                lineHeight: 1
              }}>{step.num}</span>
              
              <div>
                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.75rem',
                  fontWeight: 500,
                  marginBottom: '0.5rem',
                  color: '#1a1a1a'
                }}>{step.title}</h3>
                
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '1rem',
                  color: '#8B9A46',
                  marginBottom: '1.25rem',
                  fontWeight: 500
                }}>{step.subtitle}</p>
                
                <ul style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.95rem',
                  lineHeight: 1.9,
                  color: '#555',
                  listStyle: 'none',
                  marginBottom: '1.25rem'
                }}>
                  {step.points.map((point, j) => (
                    <li key={j} style={{ display: 'flex', gap: '0.75rem' }}>
                      <span style={{ color: '#8B9A46' }}>→</span>
                      {point}
                    </li>
                  ))}
                </ul>
                
                <div style={{
                  padding: '1rem 1.25rem',
                  background: 'rgba(139, 154, 70, 0.08)',
                  borderLeft: '3px solid #8B9A46',
                  borderRadius: '0 4px 4px 0'
                }}>
                  <p style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.85rem',
                    color: '#3D4A28'
                  }}>
                    <strong>AI Decision Partner:</strong> {step.ai}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding" style={{ padding: '5rem 4rem', background: '#fff', textAlign: 'center' }}>
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

      {/* AI Decision Partner Featured */}
      <section className="section-padding" style={{ padding: '5rem 4rem', background: '#fff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="feature-hero-grid" style={{
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
                Core Feature
              </div>
              
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2.25rem',
                fontWeight: 500,
                marginBottom: '1rem',
                color: '#1a1a1a'
              }}>AI Decision Partner</h2>
              
              <p style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '1rem',
                lineHeight: 1.8,
                color: '#555',
                marginBottom: '1.5rem'
              }}>
                Your personal thinking partner for working through tough choices. The Decision Partner guides you through the framework, challenges your assumptions, helps you structure your analysis, and ensures you don't miss critical factors.
              </p>
              
              <div style={{
                padding: '1rem 1.25rem',
                background: 'rgba(196, 168, 75, 0.1)',
                borderRadius: '4px',
                marginBottom: '1.5rem'
              }}>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.9rem',
                  color: '#3D4A28',
                  marginBottom: '0.5rem'
                }}>
                  <strong>Early Bird Bonus:</strong> Waitlist members get <strong>60 days free</strong> AI Decision Partner access
                </p>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.85rem',
                  color: '#666'
                }}>
                  Regular course buyers receive 1 month free. All templates and course updates remain yours forever.
                </p>
              </div>
              
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
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', fontWeight: 500 }}>Decision Partner</span>
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
      <section className="section-padding" style={{ padding: '5rem 4rem', background: '#FAFAF8' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="three-col-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            {[
              {
                icon: (
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <rect x="8" y="12" width="32" height="24" rx="2" stroke="#3D4A28" strokeWidth="2" fill="none"/>
                    <path d="M14 22L20 28L34 18" stroke="#8B9A46" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                title: 'Practical Case Study',
                desc: 'Work through a realistic high-stakes decision from start to finish. See exactly how the method applies in a practical scenario.',
                details: ['Complete walkthrough', 'Realistic scenario', 'Step-by-step']
              },
              {
                icon: (
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <rect x="10" y="8" width="28" height="32" rx="2" stroke="#3D4A28" strokeWidth="2" fill="none"/>
                    <line x1="16" y1="16" x2="32" y2="16" stroke="#8B9A46" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="16" y1="24" x2="28" y2="24" stroke="#8B9A46" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="16" y1="32" x2="24" y2="32" stroke="#8B9A46" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ),
                title: 'Templates & Worksheets',
                desc: 'Ready-to-use tools for every step. Stop staring at blank pages and start working through your decisions.',
                details: ['Scoping worksheets', 'Option generators', 'Evaluation tools']
              },
              {
                icon: (
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="14" stroke="#3D4A28" strokeWidth="2" fill="none"/>
                    <circle cx="24" cy="24" r="6" fill="#8B9A46"/>
                    <circle cx="24" cy="24" r="2" fill="#3D4A28"/>
                  </svg>
                ),
                title: 'Video Modules',
                desc: 'Comprehensive training covering the complete system. Watch at your own pace, revisit when needed.',
                details: ['Clear explanations', 'Practical examples', 'Actionable takeaways']
              },
              {
                icon: (
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <path d="M24 8C16 8 12 14 12 20C12 26 16 30 24 38C32 30 36 26 36 20C36 14 32 8 24 8Z" stroke="#3D4A28" strokeWidth="2" fill="none"/>
                    <path d="M24 16V24M24 28V28.5" stroke="#8B9A46" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                ),
                title: 'Bias Defense Guide',
                desc: 'Learn to recognize the mental shortcuts that sabotage your decisions—and techniques to counter them.',
                details: ['Common traps', 'Recognition patterns', 'Countermeasures']
              },
              {
                icon: (
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <path d="M12 36L20 24L28 30L36 12" stroke="#3D4A28" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    <circle cx="36" cy="12" r="3" fill="#8B9A46"/>
                  </svg>
                ),
                title: 'Valuation Framework',
                desc: 'How to weigh financial and non-financial factors. Turn fuzzy preferences into clear criteria.',
                details: ['Financial metrics', 'Non-financial values', 'Trade-off methods']
              },
              {
                icon: (
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <path d="M24 12V24L30 30" stroke="#3D4A28" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="24" cy="24" r="14" stroke="#8B9A46" strokeWidth="2" fill="none"/>
                    <path d="M38 24C38 31.732 31.732 38 24 38" stroke="#C4A84B" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ),
                title: 'Lifetime Updates',
                desc: 'As the course evolves, so does your access. New templates, insights, and features—all included.',
                details: ['Continuous updates', 'New content', 'No extra cost']
              }
            ].map((feature, i) => (
              <div 
                key={i}
                className="feature-card"
                style={{ 
                  padding: '2rem',
                  borderRadius: '4px',
                  border: '1px solid rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ marginBottom: '1.25rem' }}>{feature.icon}</div>
                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.3rem',
                  fontWeight: 500,
                  marginBottom: '0.75rem',
                  color: '#1a1a1a'
                }}>{feature.title}</h3>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.9rem',
                  lineHeight: 1.7,
                  color: '#666',
                  marginBottom: '1rem'
                }}>{feature.desc}</p>
                <ul style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.8rem',
                  color: '#888',
                  listStyle: 'none'
                }}>
                  {feature.details.map((d, j) => (
                    <li key={j} style={{ marginBottom: '0.3rem' }}>• {d}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding" style={{ padding: '5rem 4rem', background: '#fff', textAlign: 'center' }}>
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
          From Confusion to <span style={{ fontStyle: 'italic' }}>Clarity</span>
        </h1>
        
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '1.15rem',
          lineHeight: 1.8,
          color: '#666',
          maxWidth: '650px',
          margin: '0 auto'
        }}>
          A complete system that takes you from overwhelmed by complexity to confident in your choices—with AI support at every step.
        </p>
      </div>

      {/* Module List */}
      <section className="section-padding" style={{ padding: '4rem 4rem 6rem', background: '#fff' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {[
            { 
              label: 'Mindset', 
              title: 'Why Process Over Outcome', 
              desc: 'Why should decision quality be measured by your process, not your results? Learn why good decisions can lead to bad outcomes (and vice versa)—and why this insight is liberating, not frustrating.',
              outcomes: ['Understand decision quality', 'Separate skill from luck', 'Learn from decisions properly']
            },
            { 
              label: 'Foundation', 
              title: 'Clarity About Your Decision', 
              desc: 'How do you start with the right problem and the right scope? Learn to define what\'s really at stake, who needs to be involved, and where the boundaries of your decision should be. Because solving the wrong problem brilliantly still leads to failure.',
              outcomes: ['Define the real problem', 'Set clear boundaries', 'Avoid scope traps']
            },
            { 
              label: 'Exploration', 
              title: 'What Could You Do?', 
              desc: 'What meaningful alternatives exist that actually move you toward your goal? Learn to generate options beyond the obvious—from safe bets to bold moves. Your decision can only ever be as good as your best alternative.',
              outcomes: ['Generate rich alternatives', 'Think beyond the obvious', 'Create options worth choosing']
            },
            { 
              label: 'Insight', 
              title: 'What Do You Know—And What Don\'t You?', 
              desc: 'What information do you have, what do you need, what can you get, and what will remain uncertain? Learn to identify your key value drivers and the risks that come from unavoidable unknowns.',
              outcomes: ['Map your information landscape', 'Identify value drivers', 'Understand residual risks']
            },
            { 
              label: 'Values', 
              title: 'How Do You Measure Value?', 
              desc: 'How do you compare your options? Learn to weigh both financial factors (profit, NPV, costs) and non-financial ones (time freedom, relationships, personal fulfillment)—and how to make trade-offs when they conflict.',
              outcomes: ['Define success criteria', 'Balance financial & non-financial', 'Make trade-offs explicit']
            },
            { 
              label: 'Evaluation', 
              title: 'Which Option Is Best—And Can It Be Better?', 
              desc: 'Given everything you\'ve learned, which option creates the most value? And once you\'ve identified it—can you improve it further? Learn to refine your best alternative into something even better.',
              outcomes: ['Compare options clearly', 'Identify the best path', 'Optimize your choice']
            },
            { 
              label: 'Action', 
              title: 'What Are The Next Steps?', 
              desc: 'How do you turn your decision into action? Learn to create clear implementation plans, build genuine commitment, and set up conditions that make follow-through inevitable.',
              outcomes: ['Create action plans', 'Build commitment', 'Ensure follow-through']
            },
            { 
              label: 'Awareness', 
              title: 'The Biases Working Against You', 
              desc: 'What mental shortcuts sabotage your decisions without you noticing? Learn to recognize cognitive biases like overconfidence, confirmation bias, and anchoring—and practical techniques to counter them.',
              outcomes: ['Spot cognitive traps', 'Recognize your blind spots', 'Apply countermeasures']
            },
            { 
              label: 'Synergy', 
              title: 'The Human + AI Advantage', 
              desc: 'How do you create the perfect synergy between human judgment and AI support? Learn when to rely on your intuition, when to lean on AI, and how to combine both for decisions better than either could make alone.',
              outcomes: ['Leverage AI effectively', 'Know when to trust yourself', 'Combine strengths optimally']
            }
          ].map((item, i) => (
            <div 
              key={i}
              style={{ 
                padding: '2.5rem',
                marginBottom: '1.5rem',
                background: '#FAFAF8',
                borderRadius: '4px',
                border: '1px solid rgba(0,0,0,0.04)'
              }}
            >
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.7rem', letterSpacing: '0.2em', color: '#8B9A46', textTransform: 'uppercase' }}>{item.label}</span>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 500, marginTop: '0.5rem', color: '#1a1a1a' }}>{item.title}</h3>
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

      {/* CTA */}
      <section className="section-padding" style={{ padding: '5rem 4rem', background: '#fff', textAlign: 'center' }}>
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
        @import url('https://fonts.googleapis.com/css2?family=Livvic:wght@300;400;500;600;700&display=swap');
        
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
          padding: 10rem 4rem 5rem;
          background: linear-gradient(180deg, #FAFAF8 0%, #F5F5F0 100%);
          text-align: center;
        }
        
        /* Mobile Responsive Styles */
        @media (max-width: 1024px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .two-col-grid { grid-template-columns: 1fr !important; }
          .three-col-grid { grid-template-columns: 1fr 1fr !important; }
          .four-col-grid { grid-template-columns: 1fr 1fr !important; }
        }
        
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile { display: flex !important; }
          
          .page-header {
            padding: 7rem 1.5rem 3rem !important;
          }
          
          .section-padding {
            padding: 3rem 1.5rem !important;
          }
          
          .hero-section {
            padding: 6rem 1.5rem 3rem !important;
            min-height: auto !important;
          }
          
          .hero-grid { 
            grid-template-columns: 1fr !important; 
            gap: 2rem !important;
          }
          
          .two-col-grid { 
            grid-template-columns: 1fr !important; 
            gap: 1.5rem !important;
          }
          
          .three-col-grid { 
            grid-template-columns: 1fr !important; 
            gap: 1.5rem !important;
          }
          
          .four-col-grid { 
            grid-template-columns: 1fr 1fr !important; 
            gap: 1rem !important;
          }
          
          .step-number {
            font-size: 3rem !important;
          }
          
          .method-grid {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
          
          .feature-hero-grid {
            grid-template-columns: 1fr !important;
          }
          
          .floating-badge {
            position: relative !important;
            top: auto !important;
            right: auto !important;
            margin-top: 1rem !important;
            display: inline-block !important;
          }
          
          .decorative-circle {
            display: none !important;
          }
          
          .footer-grid {
            flex-direction: column !important;
            text-align: center !important;
          }
          
          .footer-links {
            justify-content: center !important;
          }
          
          .footer-bottom {
            flex-direction: column !important;
            text-align: center !important;
            gap: 1.5rem !important;
          }
          
          .footer-bottom > div {
            text-align: center !important;
          }
          
          .cta-form {
            flex-direction: column !important;
          }
          
          .cta-form input {
            width: 100% !important;
            min-height: auto !important;
            height: auto !important;
            padding: 0.875rem 1rem !important;
            font-size: 1rem !important;
            flex: none !important;
          }
          
          .cta-form button {
            width: 100% !important;
            padding: 1rem 1.5rem !important;
          }
          
          .footer-bottom {
            flex-direction: column !important;
            text-align: center !important;
            align-items: center !important;
            gap: 1.5rem !important;
          }
          
          .impressum-section {
            text-align: center !important;
            width: 100% !important;
          }
          
          .impressum-section p {
            text-align: center !important;
          }
          
          .copyright-text {
            text-align: center !important;
          }
          
          .philosophy-grid {
            grid-template-columns: 1fr !important;
          }
          
          .site-footer {
            padding: 2rem 1.5rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .four-col-grid { 
            grid-template-columns: 1fr !important; 
          }
          
          .nav-mobile-logo {
            font-size: 14px !important;
          }
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
