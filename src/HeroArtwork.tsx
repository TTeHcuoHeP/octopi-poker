import { useEffect, useRef } from 'react';

export default function HeroArtwork() {
  const artwork = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = artwork.current;
    const hero = element?.closest<HTMLElement>('.hero');
    if (!element || !hero) return;
    const motion = window.matchMedia('(prefers-reduced-motion: no-preference) and (pointer: fine)');
    let frame = 0;
    let x = 0, y = 0;
    const paint = () => {
      frame = 0;
      element.style.setProperty('--pointer-x', String(x));
      element.style.setProperty('--pointer-y', String(y));
    };
    const move = (event: PointerEvent) => {
      if (!motion.matches || event.pointerType !== 'mouse') return;
      const rect = hero.getBoundingClientRect();
      x = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
      y = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const reset = () => { cancelAnimationFrame(frame); x = 0; y = 0; paint(); };
    hero.addEventListener('pointermove', move);
    hero.addEventListener('pointerleave', reset);
    motion.addEventListener('change', reset);
    return () => {
      cancelAnimationFrame(frame);
      hero.removeEventListener('pointermove', move);
      hero.removeEventListener('pointerleave', reset);
      motion.removeEventListener('change', reset);
    };
  }, []);
  return <div ref={artwork} className="hero-parallax" aria-hidden="true">
    <div className="hero-parallax-layer hero-parallax-main"/>
    <div className="hero-parallax-layer hero-parallax-up"/>
    <div className="hero-parallax-layer hero-parallax-down"/>
    <div className="hero-parallax-layer hero-parallax-right"/>
  </div>;
}
