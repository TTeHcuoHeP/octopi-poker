import { useEffect } from 'react';

export default function useStudyMotion() {
 useEffect(() => {
  const section = document.getElementById('study-anywhere');
  if (!section) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 761px) and (pointer: fine)');
  let frame = 0, x = 0, y = 0;
  const update = () => {
   frame = 0;
   section.style.setProperty('--study-pointer-x', String(x));
   section.style.setProperty('--study-pointer-y', String(y));
  };
  const reset = () => { cancelAnimationFrame(frame); x = 0; y = 0; update(); };
  const move = (event: PointerEvent) => {
   if (motion.matches || !desktop.matches || event.pointerType !== 'mouse') return;
   const box = section.getBoundingClientRect();
   x = Math.max(-1, Math.min(1, (event.clientX - box.left) / box.width * 2 - 1));
   y = Math.max(-1, Math.min(1, (event.clientY - box.top) / box.height * 2 - 1));
   if (!frame) frame = requestAnimationFrame(update);
  };
  const configure = () => {
   reset();
   section.classList.toggle('study-motion', !motion.matches);
   if (motion.matches) section.classList.add('study-revealed');
  };
  configure();
  const observer = new IntersectionObserver(([entry]) => {
   if (entry.isIntersecting) section.classList.add('study-revealed');
   else reset();
  }, {threshold: .08});
  observer.observe(section);
  section.addEventListener('pointermove', move);
  section.addEventListener('pointerleave', reset);
  motion.addEventListener('change', configure);
  desktop.addEventListener('change', reset);
  return () => {
   observer.disconnect(); cancelAnimationFrame(frame);
   section.removeEventListener('pointermove', move);
   section.removeEventListener('pointerleave', reset);
   motion.removeEventListener('change', configure);
   desktop.removeEventListener('change', reset);
   section.classList.remove('study-motion', 'study-revealed');
   section.style.removeProperty('--study-pointer-x');
   section.style.removeProperty('--study-pointer-y');
  };
 }, []);
}
