import { useEffect } from 'react';

export default function useStudyMotion() {
  useEffect(() => {
    const section = document.getElementById('study-anywhere');
    if (!section) return;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = matchMedia('(min-width: 761px)');
    let frame = 0;
    let visible = false;
    function update() {
      frame = 0;
      if (!section || motion.matches) return;
      const box = section.getBoundingClientRect();
      const progress = Math.max(-1, Math.min(1, (innerHeight / 2 - box.top - box.height / 2) / ((innerHeight + box.height) / 2)));
      section.style.setProperty('--study-background-y', desktop.matches ? progress * 20 + 'px' : '0px');
      section.style.setProperty('--study-laptop-y', desktop.matches ? progress * -32 + 'px' : '0px');
    }
    function schedule() { if (visible && !frame && !motion.matches) frame = requestAnimationFrame(update); }
    function configure() {
      if (!section) return;
      section.classList.toggle('study-motion', !motion.matches);
      if (motion.matches) {
        section.classList.add('study-revealed');
        section.style.setProperty('--study-background-y', '0px');
        section.style.setProperty('--study-laptop-y', '0px');
      } else schedule();
    }
    configure();
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) { section.classList.add('study-revealed'); schedule(); }
    }, { threshold: 0.08 });
    observer.observe(section);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    motion.addEventListener('change', configure);
    return () => {
      observer.disconnect(); cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      motion.removeEventListener('change', configure);
      section.classList.remove('study-motion', 'study-revealed');
      section.style.removeProperty('--study-background-y');
      section.style.removeProperty('--study-laptop-y');
    };
  }, []);
}
