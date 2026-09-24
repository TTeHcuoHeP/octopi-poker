import { useEffect } from 'react';

export default function useLearningDock() {
  useEffect(() => {
    const section = document.querySelector<HTMLElement>('.starting-orbit');
    if (!section) return;
    const items = [...section.querySelectorAll<HTMLElement>('.starting-orbit-option')];
    const icons = items.map(item => item.querySelector<HTMLElement>('.starting-orbit-icon')!);
    const fine = matchMedia('(min-width: 761px) and (hover: hover) and (pointer: fine)');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const values = items.map(() => ({ value: 0, velocity: 0, target: 0 }));
    let frame = 0, previous = 0;
    const tick = (time: number) => {
      const dt = Math.min((time - previous) / 1000 || 1 / 60, 1 / 30);
      previous = time;
      let moving = false;
      values.forEach((state, index) => {
        state.velocity += ((state.target - state.value) * 180 - state.velocity * 16) * dt;
        state.value += state.velocity * dt;
        if (Math.abs(state.target - state.value) < .0001 && Math.abs(state.velocity) < .001) {
          state.value = state.target; state.velocity = 0;
        } else moving = true;
        icons[index].style.setProperty('--dock-scale', String(1 + Math.max(0, Math.min(.30, state.value))));
      });
      frame = moving ? requestAnimationFrame(tick) : 0;
    };
    const update = (active: number, weights: number[]) => {
      items.forEach((item, index) => {
        item.classList.toggle('dock-active', index === active);
        values[index].target = reduced.matches ? 0 : weights[index] * .30;
      });
      if (!frame) { previous = performance.now(); frame = requestAnimationFrame(tick); }
    };
    const reset = () => update(-1, items.map(() => 0));
    const move = (event: PointerEvent) => {
      if (!fine.matches || event.pointerType !== 'mouse') return;
      const boxes = items.map(item => item.getBoundingClientRect());
      const centers = boxes.map(box => box.left + box.width / 2);
      const rowTop = boxes[0].top;
      const rowBottom = Math.max(...boxes.map(box => box.bottom));
      // A shared horizontal influence zone keeps the wave alive between icons.
      // Centers come from fixed columns, never from the magnified circles.
      const verticalDistance = Math.max(rowTop - event.clientY, event.clientY - rowBottom, 0);
      const verticalWeight = Math.max(0, 1 - verticalDistance / 100);
      const radius = Math.max(240, (centers[1] - centers[0]) * 1.65);
      const distances = centers.map(x => Math.abs(event.clientX - x));
      const nearest = distances.indexOf(Math.min(...distances));
      const weights = distances.map(distance =>
        verticalWeight * (1 + Math.cos(Math.PI * Math.min(distance / radius, 1))) / 2
      );
      update(verticalWeight > .2 && distances[nearest] < radius ? nearest : -1, weights);
    };
    const focus = () => {
      const index = items.findIndex(item => item === document.activeElement);
      update(index, items.map((_, i) => i === index ? 1 : 0));
    };
    section.addEventListener('pointermove', move);
    section.addEventListener('pointerleave', reset);
    section.addEventListener('focusin', focus);
    section.addEventListener('focusout', reset);
    fine.addEventListener('change', reset);
    reduced.addEventListener('change', reset);
    return () => {
      cancelAnimationFrame(frame);
      section.removeEventListener('pointermove', move);
      section.removeEventListener('pointerleave', reset);
      section.removeEventListener('focusin', focus);
      section.removeEventListener('focusout', reset);
      fine.removeEventListener('change', reset);
      reduced.removeEventListener('change', reset);
      items.forEach((item, i) => { item.classList.remove('dock-active'); icons[i].style.removeProperty('--dock-scale'); });
    };
  }, []);
}
