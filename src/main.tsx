import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import PlatformShowcase from './PlatformShowcase';
import ChatWidget from './ChatWidget';
import PlayerFeedback from './PlayerFeedback';
import SiteFooter from './SiteFooter';
import NewsSection from './NewsSection';
import useStudyMotion from './useStudyMotion';


type IconName = 'home' | 'play' | 'book' | 'people' | 'help' | 'sun' | 'moon' | 'arrow' | 'menu';
function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    home: <><path d="m3 10 9-7 9 7v10H3Z"/><path d="M9 20v-7h6v7"/></>,
    play: <><circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4Z"/></>,
    book: <><path d="M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1v-3M21 8V4c-3-1-6-1-9 1v15"/><path d="m15 11 2 2 5-5"/></>,
    people: <><circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6M18 15a5 5 0 0 1 3 5"/></>,
    help: <><path d="M4 17a9 9 0 1 1 4 3l-5 1Z"/><path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 4M12 17h.01"/></>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"/></>,
    moon: <path d="M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z"/>,
    arrow: <path d="M4 12h16m-6-6 6 6-6 6"/>,
    menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
  };
  return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
const navigation: { id: string; label: string; icon: IconName }[] = [
  { id: 'overview', label: 'Overview', icon: 'home' }, { id: 'learning', label: 'Learning', icon: 'book' },
  { id: 'training', label: 'How it works', icon: 'play' }, { id: 'pros', label: 'Experts', icon: 'people' }, { id: 'faq', label: 'FAQ', icon: 'help' },
];

function SiteHeader({ dark, toggleTheme, onSignUp, onNotice }: { dark: boolean; toggleTheme: () => void; onSignUp: () => void; onNotice: (kind: 'signin' | 'about') => void }) {
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const close = (event: PointerEvent) => { if (!header.current?.contains(event.target as Node)) { setOpen(false); header.current?.querySelectorAll('details[open]').forEach(el => el.removeAttribute('open')); } };
    const escape = (event: KeyboardEvent) => { if (event.key !== 'Escape') return; const expanded = header.current?.querySelector<HTMLDetailsElement>('details[open]'); if (expanded) { expanded.open = false; expanded.querySelector('summary')?.focus(); } else if (open) { setOpen(false); toggle.current?.focus(); } };
    document.addEventListener('pointerdown', close); document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', escape); };
  }, [open]);
  const destination = (path: string) => { const url = new URL(path, 'https://octopipoker.ai'); new URLSearchParams(window.location.search).forEach((value, key) => { if (!url.searchParams.has(key)) url.searchParams.set(key, value); }); return url.toString(); };
  return <header ref={header} className="site-header">
    <a href="#overview" aria-label="Octopi Poker home"><img className="hero-logo" src="/images/brand-logo.svg" alt="Octopi Poker" width="140" height="48"/></a>
    <button ref={toggle} className="header-menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="site-navigation" onClick={() => setOpen(!open)}><Icon name="menu"/></button>
    <nav id="site-navigation" aria-label="Site navigation" className={open ? 'site-navigation is-open' : 'site-navigation'}>
      <div className="header-pages"><a href={destination('/vault')}>Vault</a><a href={destination('/academy')}>Academy</a><a href={destination('/pricing')}>Pricing</a><a href={destination('https://shop.octopipoker.ai/')}>Shop</a><button onClick={() => { setOpen(false); onNotice('about'); }}>About</button></div>
      <div className="header-utilities">
        <details className="header-dropdown language-dropdown"><summary aria-label="Language: English">ENG <span aria-hidden="true">⌄</span><svg className="language-flag" viewBox="0 0 32 22" aria-hidden="true"><rect width="32" height="22" fill="#fff"/>{[0,4,8,12,16,20].map(y => <rect key={y} y={y} width="32" height="2" fill="#ed4562"/>)}<rect width="14" height="12" fill="#3c4788"/>{[2,5,8,11].map(x => [2,5,8,11].map(y => <circle key={`${x}-${y}`} cx={x} cy={y} r=".65" fill="white"/>))}</svg></summary><div className="dropdown-panel"><span className="current-language" lang="en">English <span aria-hidden="true">✓</span></span><p>More languages coming soon.</p></div></details>
        <button className="theme-toggle" aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'} onClick={toggleTheme}><Icon name={dark ? 'sun' : 'moon'}/></button>
        <button className="sign-in" onClick={() => { setOpen(false); onNotice('signin'); }}>Sign In</button><button className="primary header-signup" onClick={() => { setOpen(false); onSignUp(); }}>Sign Up</button>
      </div>
      <div className="mobile-page-links"><p>On this page</p>{navigation.map(item => <a key={item.id} href={`#${item.id}`} onClick={() => setOpen(false)}>{item.label}</a>)}</div>
    </nav>
  </header>;
}

function App() {
  useStudyMotion();
  const [dark, setDark] = useState(false);
  const [notice, setNotice] = useState<'signup' | 'signin' | 'about'>('signup');
  const [active, setActive] = useState('overview');
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) setActive(visible[0].target.id);
    }, { rootMargin: '-10% 0px -45% 0px', threshold: [0, .2, .5] });
    navigation.forEach(({ id }) => { const section = document.getElementById(id); if (section) observer.observe(section); });
    return () => observer.disconnect();
  }, []);
  function start(placement: string) {
    // One event per placement; a real registration destination will be configured later.
    window.dispatchEvent(new CustomEvent('octopi:cta', { detail: { placement, query: window.location.search } }));
    setNotice('signup');
    dialog.current?.showModal();
  }
  return <div className="app" data-theme={dark ? 'dark' : 'light'}>
    <a className="skip" href="#main">Skip to content</a>
    <nav aria-label="On this page" className="floating-nav"><div className="nav-links">{navigation.map(item => <a key={item.id} href={`#${item.id}`} aria-label={item.label} aria-current={active === item.id ? 'location' : undefined}><Icon name={item.icon}/><span className="nav-label">{item.label}</span></a>)}</div><div className="nav-bottom"><button aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'} onClick={() => setDark(!dark)}><Icon name={dark ? 'sun' : 'moon'}/><span className="nav-label">{dark ? 'Light theme' : 'Dark theme'}</span></button></div></nav>
    <main id="main">
      <section id="overview" className="hero section">
        <SiteHeader dark={dark} toggleTheme={() => setDark(!dark)} onSignUp={() => start('header')} onNotice={kind => { setNotice(kind); dialog.current?.showModal(); }}/>
        <div className="hero-grid">
          <div className="hero-copy"><p className="eyebrow">TOURNAMENT POKER TRAINING</p><h1>POKER STUDY FOR<br/>EVERYONE,<br/>BEGINNERS TO ELITE</h1><p className="hero-tagline">Serious about poker.<br/>Start feeling at home.</p><p className="intro">Build your tournament game with practice tools, courses and guided study — wherever you are starting from.</p><div className="hero-actions"><button className="primary" onClick={() => start('hero')}>Start Training Now</button></div></div>
          <div className="hero-visual"><figure className="shark-art"><img src={dark ? "/images/shark-evolution-black-v02.png" : "/images/shark-evolution-light-v02.png"} width="864" height="475" fetchPriority="high" alt="A simple pixel shark passes through a doorway and becomes a vivid three-dimensional blue shark."/></figure><div className="hero-experts"><p><strong>Serious tools.</strong><br/>Real poker experience.</p><div className="expert-portraits" aria-label="Poker experts">{[['phil-hellmuth','Phil','Hellmuth'],['stephen-chidwick','Stephen','Chidwick'],['thomas-boivin','Thomas','Boivin']].map(([file,first,last]) => <figure key={file}><img src={`/images/experts/${file}.webp`} alt={`${first} ${last}`} width="104" height="104"/><figcaption>{first}<br/>{last}</figcaption></figure>)}</div></div></div>
        </div>
      </section>
      <section id="learning" className="section learning-section">
        <div className="learning-heading"><div><p className="eyebrow"><span className="section-dot" aria-hidden="true"/>01 / FIND YOUR STARTING POINT</p><h2>You don’t have to<br/>figure it out alone.</h2></div><p className="learning-heading-note trial-callout"><strong>7-day Professional trial</strong><span>— no credit card required.</span></p></div>
        <div className="learning-grid">{[
          {tag:'GET ORIENTED',title:<>My First<br/>Solver</>,description:<>Real tools.<br/>A clearer view of your game.<br/>Take a look inside Octopi Poker.</>,image:'book-v01.png',kind:'book'},
          {tag:'BUILD A HABIT',title:<>GTO<br/>Trainer</>,description:<>Practice tournament decisions and get instant scoring feedback.</>,image:'target-v01.png',kind:'target'},
          {tag:'STUDY TOGETHER',title:<>Guided<br/>Study</>,description:<>Weekly live sessions with Matt Hunt, with drills and leaderboards.</>,image:'guided-study-v01.png',kind:'people'}
        ].map(card => <article key={card.kind} tabIndex={0} className={`learning-card learning-card-${card.kind}`}><img className="learning-object" src={`/images/${card.image}`} alt="" loading="lazy"/><div className="learning-card-copy"><p className="eyebrow">{card.tag}</p><h3>{card.title}</h3><p>{card.description}</p></div></article>)}</div>
        <p className="learning-access-note">Academy courses support your study.<br/>Mentorship offers a more hands-on next step.</p>
      </section>
      <PlatformShowcase dark={dark} onStart={() => start('platform')}/>
      <section id="pros" className="section experts-section">
        <div className="experts-heading"><div><p className="eyebrow"><span className="section-dot" aria-hidden="true"/>03 / LEARN FROM THE GAME’S BEST</p><h2>Serious tools.<br/>Real poker experience.</h2></div><p>Browse and review real hands to add another perspective to your own study.</p></div>
        <div className="pros-grid">{[
          {name:'Phil Hellmuth',image:'phil-hellmuth-card',bio:'An American professional poker player who has won a record seventeen World Series of Poker bracelets.'},
          {name:'Stephen Chidwick',image:'stephen-chidwick-card',bio:'An English professional poker player from Deal, Kent. Chidwick led the Global Poker Index (GPI) from 18 April to 9 October 2018.'},
          {name:'Thomas Boivin',image:'thomas-boivin-card',bio:'A GTO LAB coach and Belgian high-stakes specialist who won the 2025 WSOP Paradise.'}
        ].map(expert=><article key={expert.image} className="expert-card" tabIndex={0}><div className="expert-photo-frame"><img className="expert-card-photo" src={`/images/experts/${expert.image}.webp`} alt={expert.name} width="600" height="440" loading="lazy"/></div><div className="expert-card-caption"><h3>{expert.name}</h3><p>{expert.bio}</p></div></article>)}</div>
        <p className="experts-study-note">Study hands played by the pros. Add another perspective to your own practice.</p>
      </section>
      <section id="study-anywhere" className="section study-anywhere" aria-labelledby="study-anywhere-title">
        <div className="study-anywhere-grid">
          <div className="study-anywhere-copy">
            <p className="eyebrow"><span className="section-dot" aria-hidden="true"/>04 / STUDY ON YOUR OWN TERMS</p>
            <h2 id="study-anywhere-title">Serious tools.<br/>Real poker<br/>experience.</h2>
            <p className="study-anywhere-intro">Make room for poker study in your everyday life.</p>
            <div className="study-anywhere-benefit"><img src="/images/study-anywhere/serious-tools.svg" alt="" width="40" height="40" loading="lazy"/><h3>Serious tools. A more flexible routine.</h3></div>
            <p>Review real hands, explore strategies and build your tournament game — wherever you choose to study.</p>
          </div>
          <div className="study-anywhere-visual"><img src="/images/study-anywhere/notebook.webp" alt="Octopi Poker on a laptop, showing a tournament hand replay and player analysis." loading="lazy"/></div>
        </div>
      </section>
      <section id="octopi-world" className="section octopi-world" aria-labelledby="octopi-world-title">
        <header className="world-heading"><p className="eyebrow"><span className="section-dot" aria-hidden="true"/>05 / EXPLORE THE OCTOPI WORLD</p><h2 id="octopi-world-title">More from Octopi.</h2><p>Find your coach. Wear your passion for the game.</p></header>
        <div className="world-offers">
          <article id="octopi-store" className="world-card world-store"><img className="world-art" src="/images/octopi-world/store.webp" alt="Octopi Poker T-shirt, cap and hoodie" loading="lazy"/><div className="world-card-copy"><p className="eyebrow">TAKE THE GAME WITH YOU</p><h3>Octopi<br/>Store</h3><p>Show off your passion for the game with exclusive Octopi Poker merch — from sharp designs to comfy fits, made for grinders like you.</p><a className="primary" href="https://shop.octopipoker.ai/">Shop Now</a></div></article>
          <article id="coaching-marketplace" className="world-card world-coaches"><img className="world-art" src="/images/octopi-world/trainers.webp" alt="Octopi coaching community" loading="lazy"/><div className="world-card-copy"><p className="eyebrow">A MORE PERSONAL NEXT STEP</p><h3>Coaching<br/>Marketplace</h3><p>Explore the Octopi coaching community and find support for the next step in your tournament game.</p><a className="primary" href="https://forum.octopipoker.ai/login?prompt=none">Explore Forum Now</a></div></article>
        </div>
        <div className="world-tutorials"><div className="world-tutorial-heading"><h2>See how it works.<br/>Start learning.</h2><p>Explore Octopi Poker with step-by-step tutorials, trainer walkthroughs and guided study sessions on YouTube.</p></div>
          <div className="world-videos">{['Octopi Poker: Full Tutorial','Octopi Trainer: Brief Overview','12-Week Guided Study Program'].map((title,i)=><a key={title} className="world-video-link" href={["https://www.youtube.com/watch?v=fAqDbw0MqxE","https://www.youtube.com/watch?v=1K6o9ZEGcl8","https://www.youtube.com/watch?v=Xw-W1QHma20"][i]} target="_blank" rel="noopener noreferrer" aria-label={`Watch ${title} on YouTube (opens in a new tab)`}><img className="world-video-thumbnail" src={`/images/octopi-world/youtube-${i+1}.webp`} alt={title} loading="lazy"/><img className="world-video-play" src="/images/octopi-world/youtube-button.svg" alt=""/></a>)}</div>
        </div>
      </section>
      <PlayerFeedback/>
      <NewsSection/>
      <section id="faq" className="section tinted"><div className="section-heading"><p className="eyebrow">08 / A FEW THINGS YOU MAY BE WONDERING</p><h2>Before you <span>get started.</span></h2></div><div className="faq-list">{[['Do I need to understand solvers already?','My First Solver is designed to help less advanced players get comfortable with modern study tools. Guided Study adds regular sessions with a coach.'],['What can I use for free?','The free-account offer is being confirmed. This prototype does not activate a subscription or a trial.'],['Can I study on my phone?','This page adapts to mobile. Supported product tools and their mobile limitations still need to be confirmed.']].map(([q,a])=><details key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div></section>
      <SiteFooter onStart={() => start('closing')}/>
    </main>
    <ChatWidget/>
    <dialog ref={dialog} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}><div className="dialog-content"><p className="eyebrow">PROTOTYPE PREVIEW</p><h2>{notice === 'signin' ? 'Sign in' : notice === 'about' ? 'About Octopi Poker' : 'A free start. Coming into focus.'}</h2><p>{notice === 'signin' ? 'Sign-in is not connected in this design prototype. No login details are collected.' : notice === 'about' ? 'Tournament poker education with practice tools, courses and guided study. The full About page is not included in this homepage prototype.' : 'This is a design demonstration. Registration isn’t connected yet, and no account has been created.'}</p><button className="primary" onClick={() => dialog.current?.close()}>Back to exploring <Icon name="arrow"/></button></div></dialog>
  </div>;
}
createRoot(document.getElementById('root')!).render(<App/>);
