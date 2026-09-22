import { useState } from 'react';
const testimonials = [
  {name:'Brian Rast',role:'Professional poker player',quote:'Looks like a perfect tool to study. Makes it fun while giving good information'},
  {name:'Phil Laak',role:'Tournament poker player',quote:"It's an incredible poker learning tool. And fun as well!"},
  {name:'Joshua Arieh',role:'Tournament poker player',quote:"First time in my life I've enjoyed studying. This is 10x more fun than 'practicing' online"},
  {name:'Lucky Eva',quote:'Love, love, LOVE Octopi! Thanks to the entire team for creating it!'},
  {name:'Publius',quote:'The use of the Trainer alone would have been a steal at twice the price!'},
  {name:'JackRag',quote:"I've used other Trainers before, but Octopi makes the most sense to me - so intuitive!"},
  {name:'Ryan Laplante',role:'Tournament poker player',quote:'Octopi is the best value GTO study tool on the market and what I use to improve my game.'},
  {name:'Eric Baldwin',role:'Tournament poker player',quote:'Cutting-edge and a game-changer. Its vibrant community fosters growth where improvement is fun.'},
  {name:'Brian Hastings',role:'Poker coach',quote:'As a coach, I use Octopi Vault is to review final tables with sims. It’s an awesome resource; I strongly recommend!'},
];
export default function PlayerFeedback() {
  const [first,setFirst] = useState(0);
  const [slide,setSlide] = useState(0);
  function move(direction:number) {
    if(slide) return;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setFirst(current=>(current+direction+testimonials.length)%testimonials.length); return; }
    setSlide(direction);
  }
  function finishSlide() { if(slide) { setFirst(current=>(current+slide+testimonials.length)%testimonials.length); setSlide(0); } }
  return <section id="players" className="section player-feedback" aria-labelledby="players-title" onPointerMove={event=>{
      if(event.pointerType!=='mouse'||window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const box=event.currentTarget.getBoundingClientRect();
      const x=Math.max(-1,Math.min(1,(event.clientX-box.left)/box.width*2-1));
      const y=Math.max(-1,Math.min(1,(event.clientY-box.top)/box.height*2-1));
      event.currentTarget.style.setProperty('--cloud-x',x*14+'px');
      event.currentTarget.style.setProperty('--cloud-y',y*10+'px');
      event.currentTarget.style.setProperty('--cloud-rotate',x*1.5+'deg');
    }} onPointerLeave={event=>{event.currentTarget.style.setProperty('--cloud-x','0px');event.currentTarget.style.setProperty('--cloud-y','0px');event.currentTarget.style.setProperty('--cloud-rotate','0deg');}}>
    <div className="players-intro"><div className="players-copy"><p className="eyebrow"><span className="section-dot" aria-hidden="true"/>06 / PLAYERS LIKE YOU</p><h2 id="players-title">Different starting points.<br/>A shared drive to improve.</h2><div className="players-stat"><p>registered players</p><strong>18,000<span>+</span></strong></div></div><img className="players-art" src="/images/feedback.webp" alt="" loading="lazy"/></div>
    <div className="players-carousel" role="region" aria-label="Player testimonials" aria-roledescription="carousel" onKeyDown={event=>{if(event.key==='ArrowRight'){event.preventDefault();move(1);}if(event.key==='ArrowLeft'){event.preventDefault();move(-1);}}}>
      <button className="players-prev" onClick={()=>move(-1)} aria-label="Previous testimonial">‹</button>
      <div className="players-viewport"><div className="players-cards players-track" data-slide={slide} onTransitionEnd={event=>{if(event.target===event.currentTarget && event.propertyName==='transform')finishSlide();}}>{[-1,0,1,2,3].map(offset=>{const review=testimonials[(first+offset+testimonials.length)%testimonials.length];return <article key={review.name} className="players-card" aria-hidden={offset<0||offset>2}><span className="players-quote-mark" aria-hidden="true">//</span><h3>{review.name}</h3>{review.role && <p className="review-role">{review.role}</p>}<blockquote>{review.quote}</blockquote></article>;})}</div></div>
      <button className="players-next" onClick={()=>move(1)} aria-label="Next testimonial">›</button>
      <span className="players-sr-status" aria-live="polite">First testimonial: {testimonials[first].name}</span>
    </div>
  </section>;
}
