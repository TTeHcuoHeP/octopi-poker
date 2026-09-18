import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

type IconName = 'home' | 'play' | 'book' | 'people' | 'help' | 'sun' | 'moon' | 'arrow' | 'menu';
function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    home: <><path d="m3 10 9-7 9 7v10H3Z"/><path d="M9 20v-7h6v7"/></>,
    play: <><circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4Z"/></>,
    book: <><path d="M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1Z"/><path d="M12 5v15"/></>,
    people: <><circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6M18 15a5 5 0 0 1 3 5"/></>,
    help: <><circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 4M12 17h.01"/></>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"/></>,
    moon: <path d="M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z"/>,
    arrow: <path d="M4 12h16m-6-6 6 6-6 6"/>,
    menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
  };
  return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
const navigation: { id: string; label: string; icon: IconName }[] = [
  { id: 'overview', label: 'Overview', icon: 'home' }, { id: 'training', label: 'How it works', icon: 'play' },
  { id: 'learning', label: 'Learning', icon: 'book' }, { id: 'players', label: 'Our players', icon: 'people' }, { id: 'faq', label: 'FAQ', icon: 'help' },
];
function App() {
  const [dark, setDark] = useState(false);
  const [menu, setMenu] = useState(false);
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
    dialog.current?.showModal();
  }
  const cta = (placement: string) => <button className="primary" onClick={() => start(placement)}>Sign Up Free <Icon name="arrow"/></button>;
  return <div className="app" data-theme={dark ? 'dark' : 'light'}>
    <a className="skip" href="#main">Skip to content</a>
    <header className="mobile-header"><a href="#overview" className="wordmark">OCTOPI<span>POKER</span></a><button aria-label="Toggle navigation" aria-expanded={menu} onClick={() => setMenu(!menu)}><Icon name="menu"/></button></header>
    <nav aria-label="Main navigation" className={`floating-nav ${menu ? 'is-open' : ''}`}>
      <a href="#overview" className="nav-brand" aria-label="Octopi Poker home"><span className="brand-symbol">O<span>·</span></span><span className="nav-label">OCTOPI POKER</span></a>
      <div className="nav-links">{navigation.map(item => <a key={item.id} href={`#${item.id}`} aria-label={item.label} aria-current={active === item.id ? 'location' : undefined} onClick={() => setMenu(false)}><Icon name={item.icon}/><span className="nav-label">{item.label}</span></a>)}</div>
      <div className="nav-bottom"><button aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'} onClick={() => setDark(!dark)}><Icon name={dark ? 'sun' : 'moon'}/><span className="nav-label">{dark ? 'Light theme' : 'Dark theme'}</span></button></div>
    </nav>
    <main id="main">
      <section id="overview" className="hero section">
        <div className="topline"><a href="#overview" className="wordmark">OCTOPI<span>POKER</span></a><span className="prototype-tag">DESIGN PROTOTYPE <i/></span></div>
        <div className="hero-grid"><div className="hero-copy"><p className="eyebrow">A CLEARER WAY TO STUDY</p><h1>Serious about poker.<br/><span>Start feeling<br/>at home.</span></h1><p className="intro">Build your tournament game with practice tools, courses and guided study. Wherever you’re starting from.</p><div className="hero-actions">{cta('hero')}<a className="text-link" href="#training">Explore the trainer <span>↘</span></a></div><p className="small-note">Tournament poker training. Made approachable.</p></div>
        <div className="product-stage"><div className="stage-header"><span>THE GTO TRAINER</span><span>01 / PRACTICE</span></div><div className="screenshot-placeholder"><Icon name="play"/><h3>Your next decision<br/>starts here.</h3><span>REAL TRAINER SCREENSHOT</span><p>Reserved for the approved product image</p></div><div className="stage-footer"><span>See a spot</span><span>→</span><span>Make a decision</span><span>→</span><span>Get feedback</span></div></div></div>
        <div className="hero-trust"><span>Serious tools.<br/><strong>Real poker experience.</strong></span><p>Stephen Chidwick</p><p>Phil Hellmuth</p><p>Thomas Boivin</p></div>
      </section>
      <section id="training" className="section tinted"><div className="section-heading"><p className="eyebrow">01 / PRACTICE WITH PURPOSE</p><h2>One decision. Useful feedback.<br/><span>A clearer next step.</span></h2><p>Practice tournament situations and learn from the decisions you make.</p></div><div className="demo-placeholder"><span className="demo-play"><Icon name="play"/></span><strong>One training rep. From start to feedback.</strong><p>Space for a real product demonstration</p></div><div className="steps">{[['01','See a spot','Start with a tournament situation.'],['02','Make your decision','Choose how you would play the hand.'],['03','Get feedback','Review the result before your next rep.']].map(([n,h,p])=><article key={n}><span className="step-number">{n}</span><h3>{h}</h3><p>{p}</p></article>)}</div></section>
      <section id="learning" className="section"><div className="section-heading"><p className="eyebrow">02 / FIND YOUR STARTING POINT</p><h2>You don’t have to<br/><span>figure it out alone.</span></h2></div><div className="learning-grid">{[['GET ORIENTED','My First Solver','A beginner course to help you get comfortable with modern study tools.','book'],['BUILD A HABIT','GTO Trainer','Practice tournament decisions and get instant scoring feedback.','play'],['STUDY TOGETHER','Guided Study','Weekly live sessions with Matt Hunt, with drills and leaderboards.','people']].map(([tag,h,p,icon])=><article key={h}><Icon name={icon as IconName}/><p className="eyebrow">{tag}</p><h3>{h}</h3><p>{p}</p></article>)}</div><div className="learning-bottom"><p>Academy courses support your study.<br/><strong>Mentorship offers a more hands-on next step.</strong></p>{cta('learning')}</div><p className="small-note">Free-account, course and membership access to be confirmed.</p></section>
      <section id="pros" className="section tinted"><div className="section-heading"><p className="eyebrow">03 / LEARN FROM THE GAME’S BEST</p><h2>Serious tools.<br/><span>Real poker experience.</span></h2></div><div className="pros-grid">{['Stephen Chidwick','Phil Hellmuth','Thomas Boivin'].map((name,i)=><article key={name}><div className="portrait-placeholder"><span>0{i+1}</span><small>APPROVED PORTRAIT</small></div><h3>{name}</h3><p className="small-note">Endorsement and credentials pending approval</p></article>)}</div><div className="vault-row"><h3>The Vault</h3><p>Study hands played by the pros. Add another perspective to your own practice.</p><span aria-hidden="true">↗</span></div></section>
      <section id="players" className="section"><div className="section-heading"><p className="eyebrow">04 / PLAYERS LIKE YOU</p><h2>Different starting points.<br/><span>A shared drive to improve.</span></h2></div><div className="proof-row"><strong>18,000<span>+</span></strong><div>registered players<p className="small-note">Figure from the brief. Verification pending.</p></div></div><div className="quotes">{['Recreational tournament player','Semi-pro / aspiring grinder'].map(type=><article key={type}><span className="quote-mark">“</span><p className="quote-copy">A real member’s story belongs here.</p><p>We’ll add an approved quote about a specific result or change in their study.</p><footer>{type}<span>Member testimonial pending</span></footer></article>)}</div></section>
      <section id="faq" className="section tinted"><div className="section-heading"><p className="eyebrow">05 / A FEW THINGS YOU MAY BE WONDERING</p><h2>Before you <span>get started.</span></h2></div><div className="faq-list">{[['Do I need to understand solvers already?','My First Solver is designed to help less advanced players get comfortable with modern study tools. Guided Study adds regular sessions with a coach.'],['What can I use for free?','The free-account offer is being confirmed. This prototype does not activate a subscription or a trial.'],['Can I study on my phone?','This page adapts to mobile. Supported product tools and their mobile limitations still need to be confirmed.']].map(([q,a])=><details key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div></section>
      <section id="start" className="section closing"><p className="eyebrow">YOUR NEXT STEP</p><h2>Bring your curiosity.<br/><span>Build your game.</span></h2><p>Start your tournament poker study with Octopi Poker.</p>{cta('closing')}<footer className="site-footer"><a className="wordmark" href="#overview">OCTOPI<span>POKER</span></a><p>Homepage concept · September 2026<br/>Independent design prototype. No account data collected.</p><a className="text-link" href="#overview">Back to top ↑</a></footer></section>
    </main>
    <dialog ref={dialog} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}><div className="dialog-content"><p className="eyebrow">PROTOTYPE PREVIEW</p><h2>A free start.<br/>Coming into focus.</h2><p>This is a design demonstration. Registration isn’t connected yet, and no account has been created.</p><button className="primary" onClick={() => dialog.current?.close()}>Back to exploring <Icon name="arrow"/></button></div></dialog>
  </div>;
}
createRoot(document.getElementById('root')!).render(<App/>);
