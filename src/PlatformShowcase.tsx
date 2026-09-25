import { useRef, useState } from 'react';

const tools = [
  { id: 'trainer', name: 'Trainer', title: "Make a decision. See what to improve.", description: "Put your tournament decisions into practice. Work through a spot, choose your action and compare it with the strategy shown in the feedback.", detail: "Review the available actions and their scores before moving to the next hand. Use each practice session to spot decisions you want to understand better and revisit in your study.", images: [{ file: 'trainer', label: 'Postflop Trainer with a tournament hand and decision feedback' }] },
  { id: 'vault', name: 'Vault Replay', title: "Learn from the hands the pros actually played.", description: "Replay real hands from tournament events and follow the action one decision at a time. Explore the players, stack sizes and tournament context behind each hand.", detail: "Pause at a key moment and consider how you would play it before continuing the replay. Bring a specific question to your study and use the hand to explore it.", images: [{ file: 'vault', label: 'Vault Replay with a tournament table, player details and stack map' }] },
  { id: 'preflop', name: 'Preflop Sims', title: "Understand your options before the flop.", description: "Explore preflop ranges by position and stack size. Compare strategies side by side to see which hands fold, call or raise, and how often each action is used.", detail: "Look beyond a single starting hand. Study how the whole range changes between situations, then take the decisions you find difficult into your next practice session.", images: [{ file: 'preflop-top', label: 'Preflop ranges compared side by side' }, { file: 'preflop-bottom', label: 'Preflop range library for different positions and stack sizes' }] },
  { id: 'postflop', name: 'Postflop Dashboard', title: "See the strategy behind the next action.", description: "Explore a postflop spot through action frequencies, hand classes and range breakdowns. Follow the decision tree to see how the strategy develops as the hand progresses.", detail: "Compare the available actions and examine how different hands fit into the range. Use the dashboard to investigate a specific decision and give your next review a clearer focus.", images: [{ file: 'postflop', label: 'Postflop strategy dashboard with action frequencies and hand classes' }] },
  { id: 'more', name: 'More tools', title: "Bring more context to every hand you study.", description: "Go beyond a single decision with player statistics, hand-history uploads and tournament stack maps. Explore the details around a hand alongside the action itself.", detail: "Follow how stacks change throughout an event, examine player statistics or bring your own hand histories into the platform. Choose the tool that fits the question you want to explore next.", images: [{ file: 'statistics', label: 'Player statistics overview' }, { file: 'uploader', label: 'Hand history uploader' }, { file: 'stack-map', label: 'Tournament stack map' }] },
];

const studySteps = [
  ['Choose a spot', 'Make your decision', 'Review the feedback'],
  ['Choose a hand', 'Follow the action', 'Review key decisions'],
  ['Choose a position', 'Explore the ranges', 'Compare strategies'],
  ['Open a spot', 'Explore the actions', 'Compare hand classes'],
  ['Choose a tool', 'Explore your data', 'Find your next study focus'],
];

export default function PlatformShowcase({ dark, onStart }: { dark: boolean; onStart: () => void }) {
  const [active, setActive] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);
  const videoDialog = useRef<HTMLDialogElement>(null);
  const [zoom, setZoom] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const tool = tools[active];
  const source = (file: string) => `/images/platform/${file}-${dark ? 'dark' : 'light'}.webp${file === 'postflop' && !dark ? '?v=7780b608ce' : ''}`;
  return <section id="training" className="section tinted platform-section">
    <div className="platform-heading"><div><p className="eyebrow"><span className="section-dot" aria-hidden="true"/>02 / INSIDE THE PLATFORM</p><h2>Meet your next study session.</h2></div><p>Real tools. A clearer view of your game.<br/>Take a look inside Octopi Poker.</p></div>
    <div className="platform-tabs" role="tablist" aria-label="Explore platform tools">{tools.map((item, index) => <button key={item.id} type="button" role="tab" id={`tab-${item.id}`} aria-controls={`panel-${item.id}`} aria-selected={active === index} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={event => {
      const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
      if (!keys.includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tools.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tools.length) % tools.length;
      setActive(next);
      event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next].focus();
    }}>{item.name}</button>)}</div>
    {tools.map((item, index) => <div key={item.id} id={`panel-${item.id}`} role="tabpanel" aria-labelledby={`tab-${item.id}`} hidden={active !== index} tabIndex={0} className="platform-panel">
      {active === index && <><div className={`platform-screens platform-screens-${item.id}`}>{item.images.map((asset, imageIndex) => <button key={asset.file} className="platform-image" aria-label={`Enlarge: ${asset.label}`} onClick={() => { setZoom(imageIndex); dialog.current?.showModal(); }}><img src={source(asset.file)} alt={asset.label} loading="eager"/><span className="image-expand" aria-hidden="true">↗</span></button>)}</div><div className="platform-description"><span className="platform-count">0{index + 1} / 05</span><h3>{item.title}</h3><ol className="platform-study-steps" aria-label="How it works">{studySteps[index].map(step=><li key={step}>{step}</li>)}</ol><div className="platform-description-copy"><p>{item.description}</p><p>{item.detail}</p></div><button className="primary" onClick={onStart}>Join Octopi Poker <span aria-hidden="true">↗</span></button>{item.id === 'trainer' && <button className="trainer-video-link" onClick={()=>{setVideoOpen(true);videoDialog.current?.showModal();}}>▷ Watch the trainer in action</button>}</div></>}
    </div>)}
    <dialog className="platform-lightbox" ref={dialog} aria-label={`${tool.name} screenshot`} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}><div className="lightbox-toolbar"><strong>{tool.name}</strong><button autoFocus onClick={() => dialog.current?.close()} aria-label="Close screenshot">Close ×</button></div><div className="lightbox-scroll"><img src={source(tool.images[zoom]?.file ?? tool.images[0].file)} alt={tool.images[zoom]?.label ?? tool.images[0].label}/></div></dialog>
    <dialog ref={videoDialog} className="trainer-video-dialog" aria-label="Octopi Trainer overview" onClose={()=>setVideoOpen(false)} onClick={e=>{if(e.target===e.currentTarget)videoDialog.current?.close();}}><div className="lightbox-toolbar"><strong>Octopi Trainer: Brief Overview</strong><button onClick={()=>videoDialog.current?.close()} aria-label="Close trainer video">Close ×</button></div>{videoOpen && <iframe title="Octopi Trainer: Brief Overview" src="https://www.youtube-nocookie.com/embed/1K6o9ZEGcl8" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/>}<a href="https://www.youtube.com/watch?v=1K6o9ZEGcl8" target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a></dialog>
  </section>;
}
