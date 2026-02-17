import { useState, useEffect, useRef, useCallback } from "react";

/* ─── palette ─── */
const C = {
  white: "#FFFFFF",
  cream: "#FBF8F3",
  warmGray: "#F5F0EA",
  sand: "#E8DDD0",
  sandDark: "#C4B5A0",
  gold: "#C89B3C",
  sunset: "#D4903C",
  sunsetSoft: "#E8B876",
  ocean: "#2A7C8E",
  oceanLight: "#3A9DB0",
  oceanPale: "#E8F4F6",
  teal: "#5A9E8F",
  navy: "#14232E",
  navyLight: "#1E3344",
  charcoal: "#2C2C2C",
  text: "#1A1A1A",
  textMid: "#5A5A5A",
  textLight: "#8A8A8A",
  terracotta: "#C67A4A",
  rose: "#D4A09A",
};

/* ─── hook: intersection observer ─── */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, vis];
}

/* ─── hook: parallax on scroll ─── */
function useParallax(speed = 0.3) {
  const [offset, setOffset] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const viewCenter = window.innerHeight / 2;
      setOffset((center - viewCenter) * speed);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);
  return [ref, offset];
}

/* ─── animated reveal wrapper ─── */
function Reveal({ children, delay = 0, direction = "up", style = {} }) {
  const [ref, vis] = useInView(0.08);
  const transforms = {
    up: "translateY(50px)",
    down: "translateY(-50px)",
    left: "translateX(60px)",
    right: "translateX(-60px)",
    none: "none",
  };
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translate(0,0)" : transforms[direction],
      transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ─── marquee component ─── */
function Marquee({ text, speed = 30 }) {
  return (
    <div style={{ overflow: "hidden", whiteSpace: "nowrap", padding: "20px 0" }}>
      <div style={{
        display: "inline-block",
        animation: `marquee ${speed}s linear infinite`,
      }}>
        {Array(8).fill(null).map((_, i) => (
          <span key={i} style={{
            fontFamily: "'Unbounded', sans-serif",
            fontSize: "clamp(48px, 8vw, 100px)",
            fontWeight: 200,
            color: "transparent",
            WebkitTextStroke: `1px ${C.sand}`,
            letterSpacing: -1,
            marginRight: 60,
          }}>
            {text}
            <span style={{
              display: "inline-block",
              width: 12, height: 12,
              background: C.sunset,
              borderRadius: "50%",
              margin: "0 40px",
              verticalAlign: "middle",
            }} />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── photo placeholder (lifestyle vibe) ─── */
function PhotoBlock({ aspect = "4/5", color1, color2, icon, label, style = {} }) {
  return (
    <div style={{
      aspectRatio: aspect,
      borderRadius: 16,
      background: `linear-gradient(145deg, ${color1}, ${color2})`,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: 8, overflow: "hidden", position: "relative",
      ...style,
    }}>
      <span style={{ fontSize: 36, opacity: 0.7 }}>{icon}</span>
      {label && <span style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: 11, letterSpacing: 2, textTransform: "uppercase",
        color: "rgba(255,255,255,0.6)", fontWeight: 500,
      }}>{label}</span>}
    </div>
  );
}

/* ═══════════════════════════════════════════
   NAVBAR
   ═══════════════════════════════════════════ */
function Navbar({ scrolled }) {
  const links = [
    { label: "sobre", href: "#about" },
    { label: "produtos", href: "#products" },
    { label: "experiências", href: "#experiences" },
    { label: "contato", href: "#contact" },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? "rgba(251,248,243,0.9)" : "transparent",
      backdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
      WebkitBackdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
      transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
      borderBottom: scrolled ? `1px solid ${C.sand}60` : "1px solid transparent",
    }}>
      <div style={{
        maxWidth: 1300, margin: "0 auto", padding: "0 40px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        height: scrolled ? 64 : 80,
        transition: "height 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        <a href="#hero" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            border: `2px solid ${scrolled ? C.charcoal : C.charcoal}`,
            padding: "5px 8px",
            transition: "all 0.4s",
          }}>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 14, letterSpacing: 3, lineHeight: 0.85,
              color: scrolled ? C.charcoal : C.charcoal,
              transition: "color 0.4s",
            }}>
              <div>HEY</div><div>HEY</div>
            </div>
          </div>
          <span style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 11, letterSpacing: 3, textTransform: "uppercase",
            color: C.textLight, fontWeight: 500,
            opacity: scrolled ? 0 : 1,
            transition: "opacity 0.3s",
          }}>general shop</span>
        </a>

        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
          {links.map((l) => (
            <a key={l.label} href={l.href} style={{
              color: C.textMid, textDecoration: "none",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase",
              fontWeight: 500, transition: "color 0.3s",
              position: "relative",
            }}
              onMouseEnter={e => e.target.style.color = C.text}
              onMouseLeave={e => e.target.style.color = C.textMid}
            >{l.label}</a>
          ))}
          <a href="https://instagram.com/vidaheyhey" target="_blank" rel="noopener noreferrer"
            style={{
              background: C.charcoal, color: C.white,
              padding: "10px 24px", borderRadius: 50,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 12, fontWeight: 600, textDecoration: "none",
              letterSpacing: 0.5, transition: "all 0.3s",
            }}
            onMouseEnter={e => { e.target.style.background = C.ocean; e.target.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.target.style.background = C.charcoal; e.target.style.transform = "translateY(0)"; }}
          >
            @vidaheyhey
          </a>
        </div>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════ */
function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setTimeout(() => setLoaded(true), 50)); }, []);

  return (
    <section id="hero" style={{
      minHeight: "100vh",
      background: C.cream,
      display: "flex", flexDirection: "column",
      position: "relative", overflow: "hidden",
    }}>
      {/* Subtle grain */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.025, pointerEvents: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />

      {/* Organic shapes */}
      <div style={{
        position: "absolute", top: "8%", right: "-5%",
        width: 500, height: 500, borderRadius: "50%",
        background: `radial-gradient(circle, ${C.oceanPale} 0%, transparent 70%)`,
        opacity: loaded ? 0.8 : 0,
        transition: "opacity 2s ease 0.5s",
      }} />
      <div style={{
        position: "absolute", bottom: "5%", left: "-8%",
        width: 600, height: 600, borderRadius: "50%",
        background: `radial-gradient(circle, ${C.sand}40 0%, transparent 70%)`,
        opacity: loaded ? 0.6 : 0,
        transition: "opacity 2s ease 0.8s",
      }} />

      <div style={{
        flex: 1, display: "grid",
        gridTemplateColumns: "1fr 1fr",
        maxWidth: 1300, margin: "0 auto", padding: "0 40px",
        alignItems: "center", gap: 60,
        position: "relative", zIndex: 2,
      }}>
        {/* Left: text */}
        <div style={{ paddingTop: 80 }}>
          <div style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(30px)",
            transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
          }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 12,
              background: C.white,
              border: `1px solid ${C.sand}`,
              borderRadius: 50, padding: "8px 20px 8px 12px",
              marginBottom: 32,
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: C.teal,
                boxShadow: `0 0 8px ${C.teal}60`,
              }} />
              <span style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 12, color: C.textMid, fontWeight: 500,
                letterSpacing: 1,
              }}>PIPA, RN · ABERTO AGORA</span>
            </div>
          </div>

          <h1 style={{
            fontFamily: "'Unbounded', sans-serif",
            fontSize: "clamp(36px, 4.5vw, 62px)",
            fontWeight: 800, color: C.text,
            lineHeight: 1.05, letterSpacing: -1,
            marginBottom: 12,
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(40px)",
            transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.5s",
          }}>
            Todos os<br />
            caminhos<br />
            levam à{" "}
            <span style={{
              background: `linear-gradient(135deg, ${C.ocean}, ${C.teal})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>HeyHey</span>
          </h1>

          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 22, color: C.sunset,
            fontStyle: "italic", fontWeight: 400,
            letterSpacing: 1, marginBottom: 28,
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.7s",
          }}>
            Pipaterapia lifestyle
          </p>

          <p style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 15, color: C.textMid,
            lineHeight: 1.8, maxWidth: 420, marginBottom: 40,
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.8s",
          }}>
            Marca de roupa, agência de experiência, e tudo de bom. 
            Nascida em Pipa pra vestir quem vive com sal no cabelo 
            e o pôr do sol na alma.
          </p>

          <div style={{
            display: "flex", gap: 14, flexWrap: "wrap",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1s",
          }}>
            <a href="#products" style={{
              background: C.charcoal, color: C.white,
              padding: "16px 36px", borderRadius: 50,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 14, fontWeight: 600, textDecoration: "none",
              transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
              onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 30px rgba(0,0,0,0.15)"; }}
              onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)"; }}
            >Ver Coleção</a>
            <a href="#experiences" style={{
              border: `1.5px solid ${C.sandDark}`,
              color: C.text, background: "transparent",
              padding: "16px 36px", borderRadius: 50,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 14, fontWeight: 500, textDecoration: "none",
              transition: "all 0.4s",
            }}
              onMouseEnter={e => { e.target.style.background = C.white; e.target.style.borderColor = C.ocean; e.target.style.color = C.ocean; }}
              onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.borderColor = C.sandDark; e.target.style.color = C.text; }}
            >Experiências ↗</a>
          </div>
        </div>

        {/* Right: editorial photo grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "auto auto auto",
          gap: 12,
          paddingTop: 100, paddingBottom: 40,
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(50px)",
          transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.6s",
        }}>
          <PhotoBlock aspect="3/4" color1={C.ocean} color2={C.teal} icon="🏄" label="surf" style={{ gridRow: "1 / 3" }} />
          <PhotoBlock aspect="1/1" color1={C.sunset} color2={C.terracotta} icon="👕" label="clothing" />
          <PhotoBlock aspect="1/1" color1={C.sand} color2={C.rose} icon="🌅" label="sunset" />
          <PhotoBlock aspect="16/9" color1={C.navyLight} color2={C.ocean} icon="🏖️" label="pipa" style={{ gridColumn: "1 / 3" }} />
        </div>
      </div>

      {/* Bottom edge: scroll cue */}
      <div style={{
        position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        opacity: loaded ? 0.4 : 0, transition: "opacity 1.5s ease 2s",
      }}>
        <span style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 10, letterSpacing: 3, textTransform: "uppercase",
          color: C.textLight,
        }}>scroll</span>
        <div style={{
          width: 1, height: 32, background: `linear-gradient(to bottom, ${C.textLight}, transparent)`,
          animation: "fadeDown 2s ease-in-out infinite",
        }} />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   MARQUEE STRIP
   ═══════════════════════════════════════════ */
function MarqueeStrip() {
  return (
    <div style={{ background: C.white, borderTop: `1px solid ${C.sand}40`, borderBottom: `1px solid ${C.sand}40` }}>
      <Marquee text="PIPATERAPIA" speed={35} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   ABOUT
   ═══════════════════════════════════════════ */
function About() {
  const [pRef, pOffset] = useParallax(0.08);

  return (
    <section id="about" style={{ background: C.white, padding: "120px 40px", position: "relative", overflow: "hidden" }}>
      <div ref={pRef} style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 14, letterSpacing: 5, textTransform: "uppercase",
              color: C.ocean, display: "block", marginBottom: 20,
            }}>Quem somos</span>
            <h2 style={{
              fontFamily: "'Unbounded', sans-serif",
              fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700,
              color: C.text, lineHeight: 1.15,
            }}>
              Mais que uma marca.
              <br />
              <span style={{ fontWeight: 200, color: C.textMid }}>Um estilo de vida.</span>
            </h2>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "5fr 4fr", gap: 80, alignItems: "center" }}>
          {/* Photo composition */}
          <Reveal delay={0.15} direction="left" style={{ position: "relative" }}>
            <div style={{ position: "relative", height: 560 }}>
              <PhotoBlock aspect="3/4" color1="#B8D4DA" color2={C.oceanPale} icon="🌊" label="baía dos golfinhos"
                style={{ position: "absolute", top: 0, left: 0, width: "62%", height: "65%", boxShadow: "0 20px 60px rgba(0,0,0,0.08)" }} />
              <PhotoBlock aspect="1/1" color1={C.sunsetSoft} color2={C.sand} icon="☀️" label="golden hour"
                style={{ position: "absolute", bottom: 0, right: 0, width: "55%", height: "52%", boxShadow: "0 20px 60px rgba(0,0,0,0.1)" }} />
              {/* Floating badge */}
              <div style={{
                position: "absolute", top: "50%", right: "18%",
                transform: `translateY(${pOffset}px)`,
                background: C.white, padding: "14px 24px",
                borderRadius: 16, boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
                zIndex: 3, border: `1px solid ${C.sand}40`,
              }}>
                <div style={{
                  fontFamily: "'Unbounded', sans-serif",
                  fontSize: 24, fontWeight: 800, color: C.sunset,
                }}>5+</div>
                <div style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 11, color: C.textLight, letterSpacing: 1,
                  textTransform: "uppercase",
                }}>anos de praia</div>
              </div>
            </div>
          </Reveal>

          {/* Text side */}
          <Reveal delay={0.3}>
            <div>
              <div style={{
                width: 48, height: 3, background: C.sunset,
                borderRadius: 2, marginBottom: 32,
              }} />
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 26, color: C.text, lineHeight: 1.6,
                fontWeight: 400, marginBottom: 24,
                fontStyle: "italic",
              }}>
                "Pipaterapia é a receita pra curar qualquer dia ruim: 
                sal no cabelo, areia nos pés, sunset na alma."
              </p>
              <p style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 15, color: C.textMid, lineHeight: 1.85,
                marginBottom: 24,
              }}>
                Nascida no coração de Pipa, a Hey Hey é vestuário, é rolê, é lifestyle, 
                é agência de experiência — é tudo de bom. Da Baía dos Golfinhos pro mundo, 
                vestimos quem acredita que a vida é melhor de chinelo, com uma canga no ombro 
                e o horizonte nos olhos.
              </p>
              <p style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 15, color: C.textMid, lineHeight: 1.85,
                marginBottom: 40,
              }}>
                A loja é o point. O insta é a vitrine. 
                E Pipa? Pipa é o escritório dos sonhos.
              </p>

              <div style={{
                display: "flex", gap: 48,
                borderTop: `1px solid ${C.sand}60`,
                paddingTop: 28,
              }}>
                {[
                  { n: "20K+", l: "Comunidade" },
                  { n: "207", l: "Posts" },
                  { n: "∞", l: "Good vibes" },
                ].map(s => (
                  <div key={s.l}>
                    <div style={{
                      fontFamily: "'Unbounded', sans-serif",
                      fontSize: 26, fontWeight: 800, color: C.text,
                    }}>{s.n}</div>
                    <div style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: 11, color: C.textLight, letterSpacing: 1.5,
                      textTransform: "uppercase", marginTop: 4,
                    }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   PRODUCTS
   ═══════════════════════════════════════════ */
const PRODUCTS = [
  { name: "Camiseta Pipaterapia", sub: "Original Since 2020", price: "R$ 89,90", color: C.teal, icon: "👕", tag: "bestseller" },
  { name: "Regata Alma de Pipa", sub: "Liberdade no tecido", price: "R$ 69,90", color: C.sunset, icon: "🩳", tag: null },
  { name: "Bermuda Hey Hey", sub: "Estampas exclusivas", price: "R$ 119,90", color: C.ocean, icon: "🩲", tag: "novo" },
  { name: "Pochete Hey Hey", sub: "Pro rolê completo", price: "R$ 79,90", color: C.navy, icon: "👝", tag: null },
  { name: "Canga Pipaterapia", sub: "Do mar à rua", price: "R$ 59,90", color: C.terracotta, icon: "🏖️", tag: null },
  { name: "Camiseta Selvagem", sub: "Espírito livre", price: "R$ 89,90", color: C.charcoal, icon: "🌴", tag: "novo" },
];

function Products() {
  const [hov, setHov] = useState(null);

  return (
    <section id="products" style={{ background: C.cream, padding: "120px 40px", position: "relative" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 64 }}>
            <div>
              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 14, letterSpacing: 5, textTransform: "uppercase",
                color: C.ocean, display: "block", marginBottom: 16,
              }}>Coleção</span>
              <h2 style={{
                fontFamily: "'Unbounded', sans-serif",
                fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700,
                color: C.text, lineHeight: 1.15,
              }}>
                Clothing <span style={{ fontWeight: 200, color: C.textMid }}>&</span> More
              </h2>
            </div>
            <a href="https://instagram.com/vidaheyhey" target="_blank" rel="noopener noreferrer"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 13, color: C.ocean, textDecoration: "none",
                fontWeight: 600, display: "flex", alignItems: "center", gap: 6,
                transition: "gap 0.3s",
              }}
              onMouseEnter={e => e.target.style.gap = "10px"}
              onMouseLeave={e => e.target.style.gap = "6px"}
            >
              Ver tudo no Insta <span style={{ fontSize: 18 }}>→</span>
            </a>
          </div>
        </Reveal>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
        }}>
          {PRODUCTS.map((p, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div
                onMouseEnter={() => setHov(i)}
                onMouseLeave={() => setHov(null)}
                style={{
                  background: C.white,
                  borderRadius: 20,
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                  transform: hov === i ? "translateY(-6px)" : "translateY(0)",
                  boxShadow: hov === i
                    ? "0 24px 48px rgba(0,0,0,0.08)"
                    : "0 2px 12px rgba(0,0,0,0.03)",
                  border: `1px solid ${hov === i ? `${p.color}30` : C.sand + "40"}`,
                }}
              >
                {/* Product visual */}
                <div style={{
                  aspectRatio: "4/3",
                  background: `linear-gradient(145deg, ${p.color}12, ${p.color}06)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative", overflow: "hidden",
                }}>
                  <span style={{
                    fontSize: 56,
                    transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                    transform: hov === i ? "scale(1.15) rotate(-5deg)" : "scale(1)",
                  }}>{p.icon}</span>

                  {/* Tag */}
                  {p.tag && (
                    <span style={{
                      position: "absolute", top: 16, left: 16,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
                      textTransform: "uppercase",
                      background: p.tag === "bestseller" ? C.sunset : C.ocean,
                      color: C.white, padding: "5px 12px",
                      borderRadius: 50,
                    }}>{p.tag}</span>
                  )}

                  {/* Hover quick-view */}
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    background: `linear-gradient(to top, ${p.color}20, transparent)`,
                    height: 60,
                    opacity: hov === i ? 1 : 0,
                    transition: "opacity 0.3s",
                  }} />
                </div>

                {/* Info */}
                <div style={{ padding: "20px 24px 24px" }}>
                  <h3 style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 15, fontWeight: 600, color: C.text,
                    marginBottom: 4,
                  }}>{p.name}</h3>
                  <p style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 13, color: C.textLight,
                    marginBottom: 14,
                  }}>{p.sub}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{
                      fontFamily: "'Unbounded', sans-serif",
                      fontSize: 17, fontWeight: 700, color: C.text,
                    }}>{p.price}</span>
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%",
                      border: `1.5px solid ${C.sand}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.3s",
                      background: hov === i ? C.charcoal : "transparent",
                      borderColor: hov === i ? C.charcoal : C.sand,
                    }}>
                      <span style={{
                        fontSize: 14,
                        color: hov === i ? C.white : C.textLight,
                        transition: "color 0.3s",
                      }}>→</span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   EXPERIENCES
   ═══════════════════════════════════════════ */
const EXPERIENCES = [
  { title: "Passeio de Buggy", desc: "Desbrave as dunas e falésias com a adrenalina que só Pipa oferece. Paradas pra fotos nos melhores cenários.", icon: "🏜️", time: "~3h", color: C.sunset },
  { title: "Sunset na Baía", desc: "Golden hour com os pés na areia e o melhor pôr do sol do Rio Grande do Norte.", icon: "🌅", time: "~2h", color: C.terracotta },
  { title: "Surf Experience", desc: "Aulas com os locais. Do zero ao tube ride, no seu ritmo. Prancha e boa vibe inclusos.", icon: "🏄", time: "~2h", color: C.ocean },
  { title: "Rolê Cultural", desc: "Arte, gastronomia e música — o melhor da vila de Pipa a pé. Descubra cada beco.", icon: "🎨", time: "~4h", color: C.teal },
];

function Experiences() {
  const [active, setActive] = useState(0);

  return (
    <section id="experiences" style={{ background: C.white, padding: "120px 40px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 14, letterSpacing: 5, textTransform: "uppercase",
              color: C.sunset, display: "block", marginBottom: 16,
            }}>Viva Pipa</span>
            <h2 style={{
              fontFamily: "'Unbounded', sans-serif",
              fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700,
              color: C.text, lineHeight: 1.15, marginBottom: 16,
            }}>
              Hey Hey <span style={{ color: C.ocean }}>Experiences</span>
            </h2>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 20, color: C.textMid, fontStyle: "italic",
              maxWidth: 500, margin: "0 auto",
            }}>
              Keeping memories — a vida é pra viver.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1.2fr",
            gap: 40, alignItems: "stretch", minHeight: 440,
          }}>
            {/* Left: selector list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {EXPERIENCES.map((exp, i) => (
                <div
                  key={i}
                  onClick={() => setActive(i)}
                  style={{
                    padding: "28px 24px",
                    cursor: "pointer",
                    borderLeft: `3px solid ${active === i ? exp.color : "transparent"}`,
                    background: active === i ? `${exp.color}06` : "transparent",
                    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    borderBottom: i < EXPERIENCES.length - 1 ? `1px solid ${C.sand}40` : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <span style={{
                      fontSize: 28,
                      filter: active === i ? "none" : "grayscale(60%)",
                      transition: "filter 0.3s",
                    }}>{exp.icon}</span>
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 16, fontWeight: 600,
                        color: active === i ? C.text : C.textMid,
                        transition: "color 0.3s",
                        marginBottom: 2,
                      }}>{exp.title}</h3>
                      <span style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 12, color: C.textLight,
                      }}>{exp.time}</span>
                    </div>
                    <span style={{
                      fontSize: 18, color: active === i ? exp.color : C.sand,
                      transition: "all 0.3s",
                      transform: active === i ? "translateX(0)" : "translateX(-4px)",
                      opacity: active === i ? 1 : 0.4,
                    }}>→</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: detail card */}
            <div style={{
              borderRadius: 24,
              background: `linear-gradient(145deg, ${EXPERIENCES[active].color}10, ${EXPERIENCES[active].color}04)`,
              border: `1px solid ${EXPERIENCES[active].color}20`,
              padding: 48,
              display: "flex", flexDirection: "column",
              justifyContent: "space-between",
              transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: -40, right: -40,
                fontSize: 160, opacity: 0.06,
                transition: "all 0.5s",
              }}>{EXPERIENCES[active].icon}</div>

              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{
                  display: "inline-block",
                  background: EXPERIENCES[active].color,
                  color: C.white, padding: "6px 16px",
                  borderRadius: 50,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
                  textTransform: "uppercase", marginBottom: 24,
                }}>
                  {EXPERIENCES[active].time} de experiência
                </div>

                <h3 style={{
                  fontFamily: "'Unbounded', sans-serif",
                  fontSize: 32, fontWeight: 700, color: C.text,
                  marginBottom: 16, lineHeight: 1.2,
                }}>{EXPERIENCES[active].title}</h3>

                <p style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 16, color: C.textMid, lineHeight: 1.8,
                  maxWidth: 400,
                }}>{EXPERIENCES[active].desc}</p>
              </div>

              <a href="https://instagram.com/vidaheyhey" target="_blank" rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  background: C.charcoal, color: C.white,
                  padding: "14px 28px", borderRadius: 50,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 13, fontWeight: 600, textDecoration: "none",
                  alignSelf: "flex-start",
                  transition: "all 0.3s",
                  position: "relative", zIndex: 1,
                }}
                onMouseEnter={e => { e.target.style.background = EXPERIENCES[active].color; }}
                onMouseLeave={e => { e.target.style.background = C.charcoal; }}
              >
                Agendar no Instagram
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   CONTACT / LOCATION
   ═══════════════════════════════════════════ */
function Contact() {
  return (
    <section id="contact" style={{ background: C.cream, padding: "120px 40px", position: "relative" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 14, letterSpacing: 5, textTransform: "uppercase",
              color: C.teal, display: "block", marginBottom: 16,
            }}>Visite-nos</span>
            <h2 style={{
              fontFamily: "'Unbounded', sans-serif",
              fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700,
              color: C.text, lineHeight: 1.15,
            }}>
              O point te espera <span style={{ fontWeight: 200, color: C.textMid }}>em Pipa</span>
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: 24, alignItems: "stretch",
          }}>
            {/* Info card */}
            <div style={{
              background: C.white,
              borderRadius: 24,
              padding: 48,
              border: `1px solid ${C.sand}40`,
            }}>
              {[
                { label: "Endereço", value: "Av Baía dos Golfinhos, 1148\nLoja 01 · Tibau do Sul, RN\nCEP 59178-000" },
                { label: "Horário", value: "Todos os dias\n10h às 23h" },
              ].map((item) => (
                <div key={item.label} style={{ marginBottom: 36 }}>
                  <p style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 11, letterSpacing: 2, textTransform: "uppercase",
                    color: C.ocean, fontWeight: 700, marginBottom: 10,
                  }}>{item.label}</p>
                  <p style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 16, color: C.text, lineHeight: 1.7,
                    whiteSpace: "pre-line",
                  }}>{item.value}</p>
                </div>
              ))}

              <div>
                <p style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 11, letterSpacing: 2, textTransform: "uppercase",
                  color: C.ocean, fontWeight: 700, marginBottom: 14,
                }}>Conecte-se</p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {[
                    { label: "Instagram", url: "https://instagram.com/vidaheyhey", emoji: "📸" },
                    { label: "Linktree", url: "https://linktr.ee/vidaheyhey", emoji: "🔗" },
                    { label: "Google Maps", url: "https://maps.google.com/?q=Av+Baia+dos+Golfinhos+1148+Tibau+do+Sul", emoji: "📍" },
                  ].map((s) => (
                    <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        background: C.cream, color: C.text,
                        padding: "10px 18px", borderRadius: 12,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 13, fontWeight: 500, textDecoration: "none",
                        border: `1px solid ${C.sand}60`,
                        transition: "all 0.3s",
                      }}
                      onMouseEnter={e => { e.target.style.background = C.ocean; e.target.style.color = C.white; e.target.style.borderColor = C.ocean; }}
                      onMouseLeave={e => { e.target.style.background = C.cream; e.target.style.color = C.text; e.target.style.borderColor = `${C.sand}60`; }}
                    >
                      <span>{s.emoji}</span> {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Map visual */}
            <div style={{
              borderRadius: 24, overflow: "hidden",
              background: `linear-gradient(165deg, #E8F4F6 0%, #D4EBF0 40%, ${C.oceanPale} 100%)`,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: 16, position: "relative",
              border: `1px solid ${C.sand}30`,
            }}>
              {/* Decorative elements */}
              <div style={{
                position: "absolute", top: "15%", left: "15%",
                width: 100, height: 100, borderRadius: "50%",
                background: `${C.ocean}10`,
              }} />
              <div style={{
                position: "absolute", bottom: "20%", right: "20%",
                width: 60, height: 60, borderRadius: "50%",
                background: `${C.sunset}10`,
              }} />

              <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 56, marginBottom: 8 }}>📍</div>
                <p style={{
                  fontFamily: "'Unbounded', sans-serif",
                  fontSize: 20, fontWeight: 700, color: C.navy,
                  marginBottom: 4,
                }}>Pipa</p>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 16, color: C.textMid, fontStyle: "italic",
                  marginBottom: 24,
                }}>Tibau do Sul, RN</p>
                <a href="https://maps.google.com/?q=Av+Baia+dos+Golfinhos+1148+Tibau+do+Sul"
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: C.white, color: C.text,
                    padding: "14px 28px", borderRadius: 50,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 13, fontWeight: 600, textDecoration: "none",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                    border: `1px solid ${C.sand}40`,
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={e => { e.target.style.boxShadow = "0 8px 30px rgba(0,0,0,0.1)"; e.target.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.target.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)"; e.target.style.transform = "translateY(0)"; }}
                >
                  Abrir no Maps →
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════ */
function Footer() {
  return (
    <footer style={{
      background: C.charcoal,
      padding: "56px 40px 40px",
      position: "relative",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", paddingBottom: 32,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          marginBottom: 32,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              border: `1.5px solid rgba(255,255,255,0.3)`,
              padding: "5px 8px",
            }}>
              <div style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 13, letterSpacing: 3, lineHeight: 0.85,
                color: "rgba(255,255,255,0.5)",
              }}>
                <div>HEY</div><div>HEY</div>
              </div>
            </div>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 15, color: "rgba(255,255,255,0.3)",
              fontStyle: "italic",
            }}>Pipaterapia Lifestyle</span>
          </div>

          <div style={{ display: "flex", gap: 24 }}>
            {["Instagram", "Linktree"].map(l => (
              <a key={l} href={l === "Instagram" ? "https://instagram.com/vidaheyhey" : "https://linktr.ee/vidaheyhey"}
                target="_blank" rel="noopener noreferrer"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 12, color: "rgba(255,255,255,0.4)",
                  textDecoration: "none", letterSpacing: 1,
                  transition: "color 0.3s",
                }}
                onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.8)"}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.4)"}
              >{l}</a>
            ))}
          </div>
        </div>

        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 12, color: "rgba(255,255,255,0.2)",
          }}>© 2025 Hey Hey General Shop · Tibau do Sul, RN</span>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 13, color: "rgba(255,255,255,0.15)",
            fontStyle: "italic",
          }}>
            feito com ♡ por <span style={{ color: "rgba(255,255,255,0.3)" }}>VAD Media Group</span>
          </span>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════ */
export default function HeyHeyLanding() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ background: C.cream, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Unbounded:wght@200;300;400;700;800;900&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; background: ${C.cream}; }
        ::selection { background: ${C.ocean}30; color: ${C.navy}; }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes fadeDown {
          0%, 100% { opacity: 0.3; transform: scaleY(0.6); transform-origin: top; }
          50% { opacity: 1; transform: scaleY(1); transform-origin: top; }
        }
        a { -webkit-tap-highlight-color: transparent; }
      `}</style>
      <Navbar scrolled={scrolled} />
      <Hero />
      <MarqueeStrip />
      <About />
      <Products />
      <Experiences />
      <Contact />
      <Footer />
    </div>
  );
}
