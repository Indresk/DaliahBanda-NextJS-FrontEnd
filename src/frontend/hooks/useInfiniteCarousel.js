import { useEffect } from 'react';

const IDLE_RESUME_MS = 300;
const MAX_FRAME_MS = 100;

export function useInfiniteCarousel(ref, { duration = 60 } = {}) {
	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
		let loop = 0; // ancho de una copia
		let pos = 0; // posición con decimales
		let lastWritten = 0;
		let lastInteraction = -Infinity;
		let hovering = false;
		let offscreen = false;
		let drag = null;
		let frame = 0;
		let lastFrame = 0;

		const measure = () => {
			loop = el.scrollWidth / 2;
		};

		const write = (value) => {
			pos = value;
			lastWritten = value;
			el.scrollLeft = value;
		};

		const wrap = () => {
			if (!loop) return;
			const max = loop * 2 - el.clientWidth - 1;
			let shift = 0;
			if (pos >= max) shift = -loop;
			else if (pos <= 1) shift = loop;
			if (!shift) return;
			write(pos + shift);
			if (drag) drag.left += shift;
		};

		const isPaused = (now) =>
			reducedMotion.matches ||
			hovering ||
			offscreen ||
			drag !== null ||
			now - lastInteraction < IDLE_RESUME_MS;

		const tick = (now) => {
			const dt = Math.min(now - lastFrame, MAX_FRAME_MS);
			lastFrame = now;
			if (loop && !isPaused(now)) {
				pos += (loop / duration) * (dt / 1000);
				wrap();
				lastWritten = pos;
				el.scrollLeft = pos;
			}
			frame = requestAnimationFrame(tick);
		};

		// scroll del usuario
		const onScroll = () => {
			if (Math.abs(el.scrollLeft - lastWritten) <= 1.5) return;
			pos = el.scrollLeft;
			lastWritten = pos;
			lastInteraction = performance.now();
			wrap();
		};

		const onPointerDown = (e) => {
			if (e.pointerType !== 'mouse' || e.button !== 0) return;
			drag = { x: e.clientX, left: el.scrollLeft };
			el.setPointerCapture(e.pointerId);
		};
		const onPointerMove = (e) => {
			if (!drag) return;
			el.scrollLeft = drag.left - (e.clientX - drag.x);
		};
		const endDrag = () => {
			if (drag) lastInteraction = performance.now();
			drag = null;
		};

		const resizeObserver = new ResizeObserver(() => {
			const prevLoop = loop;
			measure();
			// Conserva la posición relativa dentro de la copia al cambiar el ancho.
			write(prevLoop ? (pos / prevLoop) * loop : loop);
		});
		resizeObserver.observe(el);
		resizeObserver.observe(el.firstElementChild);

		const intersectionObserver = new IntersectionObserver(([entry]) => {
			offscreen = !entry.isIntersecting;
		});
		intersectionObserver.observe(el);

		measure();
		// Empieza en la segunda copia (idéntica a la primera) para poder retroceder.
		write(loop);

		el.addEventListener('scroll', onScroll, { passive: true });
		el.addEventListener('pointerdown', onPointerDown);
		el.addEventListener('pointermove', onPointerMove);
		el.addEventListener('pointerup', endDrag);
		el.addEventListener('pointercancel', endDrag);
		frame = requestAnimationFrame((now) => {
			lastFrame = now;
			frame = requestAnimationFrame(tick);
		});

		return () => {
			cancelAnimationFrame(frame);
			resizeObserver.disconnect();
			intersectionObserver.disconnect();
			el.removeEventListener('scroll', onScroll);
			el.removeEventListener('pointerdown', onPointerDown);
			el.removeEventListener('pointermove', onPointerMove);
			el.removeEventListener('pointerup', endDrag);
			el.removeEventListener('pointercancel', endDrag);
		};
	}, [ref, duration]);
}
