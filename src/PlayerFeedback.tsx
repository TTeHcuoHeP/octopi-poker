import { useState } from 'react';
const testimonials = [
  {name:'Brian Rast',quote:'Looks like a perfect tool to study. Makes it fun while giving good information'},
  {name:'Phil Laak',quote:"It's an incredible poker learning tool. And fun as well!"},
  {name:'Joshua Arieh',quote:"First time in my life I've enjoyed studying. This is 10x more fun than 'practicing' online"},
];
export default function PlayerFeedback() {
  const [first,setFirst] = useState(0);
  function move(direction:number) { setFirst(current=>(current+direction+testimonials.length)%testimonials.length); }
  return <section id="players" className="section player-feedback" aria-labelledby="players-title">
    <div className="players-intro"><div className="players-copy"><p className="eyebrow"><span className="section-dot" aria-hidden="true"/>06 / PLAYERS LIKE YOU</p><h2 id="players-title">Different starting points.<br/>A shared drive to improve.</h2><div className="players-stat"><p>registered players</p><strong>18,000<span>+</span></strong></div></div><img className="players-art" src="/images/feedback.webp" alt="" loading="lazy"/></div>
    <div className="players-carousel" role="region" aria-label="Player testimonials" aria-roledescription="carousel" onKeyDown={event=>{if(event.key==='ArrowRight'){event.preventDefault();move(1);}if(event.key==='ArrowLeft'){event.preventDefault();move(-1);}}}>
      <button className="players-prev" onClick={()=>move(-1)} aria-label="Previous testimonial">‹</button>
      <div className="players-cards">{testimonials.map((_,offset)=>{const review=testimonials[(first+offset)%testimonials.length];return <article key={review.name} className="players-card"><span className="players-quote-mark" aria-hidden="true">//</span><h3>{review.name}</h3><blockquote>{review.quote}</blockquote></article>;})}</div>
      <button className="players-next" onClick={()=>move(1)} aria-label="Next testimonial">›</button>
      <span className="players-sr-status" aria-live="polite">First testimonial: {testimonials[first].name}</span>
    </div>
  </section>;
}
