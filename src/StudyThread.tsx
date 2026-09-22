import { useEffect, useRef } from 'react';

/** A decorative path measured from the actual document, not a fixed page height. */
export function StudyThread() {
  const svg = useRef<SVGSVGElement>(null);
  const base = useRef<SVGPathElement>(null);
  const trace = useRef<SVGPathElement>(null);
  const marker = useRef<SVGCircleElement>(null);
  useEffect(() => {
    const main = document.getElementById('main');
    const art = document.querySelector<HTMLImageElement>('.thread-art img');
    if (!main || !art) return;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let pointer = 0;
    let geometryDirty = true;
    let length = 0;
    let startY = 0;
    let endY = 1;
    function paint() {
      frame = 0;
      if (!main || !art || !svg.current || !base.current || !trace.current || !marker.current) return;
      const rect = main.getBoundingClientRect();
      if (geometryDirty) {
        geometryDirty = false;
        const image = art.getBoundingClientRect();
        const w = rect.width;
        const h = main.offsetHeight;
        svg.current.setAttribute('viewBox', `0 0 ${w} ${h}`);
        svg.current.setAttribute('width', `${w}`);
        svg.current.setAttribute('height', `${h}`);
        let x = image.left - rect.left + image.width * .932;
        let y = image.bottom - rect.top - 2;
        startY = y;
        let d = `M ${x} ${y}`;
        const sections = Array.from(main.querySelectorAll<HTMLElement>('.section'));
        sections.forEach((section, i) => {
          const bounds = section.getBoundingClientRect();
          const ny = bounds.bottom - rect.top - (i === sections.length - 1 ? 120 : 20);
          if (ny <= y + 20) return;
          const nx = w * (i % 2 ? .962 : .90);
          const delta = ny - y;
          d += ` C ${Math.min(w - 10, x + 36 + pointer)} ${y + delta * .3}, ${nx + pointer} ${ny - delta * .3}, ${nx} ${ny}`;
          x = nx; y = ny;
        });
        endY = y;
        base.current.setAttribute('d', d);
        trace.current.setAttribute('d', d);
        length = trace.current.getTotalLength();
      }
      const progress = motion.matches ? 1 : Math.min(1, Math.max(0, (innerHeight * .7 - rect.top - startY) / Math.max(1, endY - startY)));
      trace.current.style.strokeDasharray = `${length}`;
      trace.current.style.strokeDashoffset = `${length * (1 - progress)}`;
      const point = trace.current.getPointAtLength(length * progress);
      marker.current.setAttribute('cx', `${point.x}`);
      marker.current.setAttribute('cy', `${point.y}`);
      marker.current.style.opacity = motion.matches ? '0' : '1';
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(paint); }
    function measure() { geometryDirty = true; schedule(); }
    function move(event: PointerEvent) {
      if (motion.matches || event.pointerType !== 'mouse') return;
      pointer = (event.clientX / innerWidth - .5) * 18;
      measure();
    }
    const observer = new ResizeObserver(measure);
    observer.observe(main); observer.observe(art);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    main.addEventListener('pointermove', move, { passive: true });
    art.addEventListener('load', measure);
    motion.addEventListener('change', measure);
    measure();
    return () => {
      cancelAnimationFrame(frame); observer.disconnect();
      window.removeEventListener('scroll', schedule); window.removeEventListener('resize', measure);
      main.removeEventListener('pointermove', move); art.removeEventListener('load', measure);
      motion.removeEventListener('change', measure);
    };
  }, []);
  return <svg ref={svg} className="study-thread" aria-hidden="true" focusable="false">
    <path ref={base} className="thread-base"/><path ref={trace} className="thread-trace"/>
    <circle ref={marker} r="4" className="thread-marker"/>
  </svg>;
}
