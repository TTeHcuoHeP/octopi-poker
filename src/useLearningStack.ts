import { useEffect } from 'react';

export default function useLearningStack() {
  useEffect(() => {
    const section = document.querySelector<HTMLElement>('.starting-orbit');
    if (!section) return;
    // Tall sections finish scrolling into view before their bottom is pinned.
    const update = () => section.style.setProperty('--stack-top',
      Math.min(0, window.innerHeight - section.offsetHeight - 24) + 'px');
    const observer = new ResizeObserver(update);
    observer.observe(section);
    window.addEventListener('resize', update);
    update();
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
      section.style.removeProperty('--stack-top');
    };
  }, []);
}
