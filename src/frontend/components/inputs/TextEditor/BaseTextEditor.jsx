'use client';

import { useEffect, useRef, useState } from 'react';
import suneditor from 'suneditor';
import 'suneditor/css/editor';
import 'suneditor/css/contents';
import 'suneditor/src/themes/dark.css';
import { isEmptyEditorHtml, toEditorHtml } from '@/frontend/utils/richText';
import { buildEditorOptions } from './editorConfig';

// Editor de texto enriquecido (SunEditor) para usar dentro de un <form>:
//  name          nombre del campo que se envía con el formulario (HTML)
//  defaultValue  contenido inicial (HTML o texto plano antiguo); no se vuelve a leer después
//  onChange      recibe el HTML cada vez que cambia ('' si el editor está vacío)
// Hasta que el usuario edita, el campo conserva el valor original tal cual (un texto plano antiguo
// no se convierte en HTML si no se toca).
export default function BaseTextEditor({ name, defaultValue = '', onChange, minHeight = '320px' }) {
	const containerRef = useRef(null);
	const onChangeRef = useRef(onChange);
	const [html, setHtml] = useState(defaultValue ?? '');

	useEffect(() => {
		onChangeRef.current = onChange;
	}, [onChange]);

	useEffect(() => {
		// SunEditor modifica el DOM alrededor de su objetivo: se le da un nodo propio dentro de un
		// contenedor que React no gestiona, así no chocan en la recarga en caliente ni al desmontar
		const container = containerRef.current;
		const form = container.closest('form');
		let editor = null;
		let observer = null;
		let syncTimer = null;
		let lastHtml = null;

		// Lee el HTML del editor y, si cambió, actualiza el campo y avisa a quien use el componente
		const sync = () => {
			if (!editor) return;
			const data = editor.$.html.get();
			const next = isEmptyEditorHtml(data) ? '' : data;
			if (next === lastHtml) return;

			lastHtml = next;
			setHtml(next);
			onChangeRef.current?.(next);
		};
		const syncSoon = () => {
			clearTimeout(syncTimer);
			syncTimer = setTimeout(sync, 250);
		};
		// Se sincroniza justo antes de enviar el formulario: sin esto se podría perder el último cambio
		// (insertar un iframe o una imagen no siempre dispara onChange). Va en captura para ejecutarse
		// antes de que el formulario lea sus campos.
		const syncNow = () => {
			clearTimeout(syncTimer);
			sync();
		};

		// Se crea en el siguiente ciclo: en desarrollo React monta, desmonta y vuelve a montar el
		// componente, y destruir un editor que aún se está inicializando lanza un error
		const timer = setTimeout(() => {
			const target = document.createElement('div');
			container.appendChild(target);

			editor = suneditor.create(
				target,
				buildEditorOptions({
					value: toEditorHtml(defaultValue),
					minHeight,
					onChange: syncSoon,
				}),
			);

			// Punto de partida: el HTML del editor recién creado. Mientras no cambie, el campo conserva el
			// valor original (un texto plano antiguo no se convierte en HTML si no se edita).
			const initial = editor.$.html.get();
			lastHtml = isEmptyEditorHtml(initial) ? '' : initial;

			// onChange no cubre todo (p. ej. insertar un iframe): se observa también el contenido
			const wysiwyg = container.querySelector('.se-wrapper-wysiwyg');
			if (wysiwyg) {
				observer = new MutationObserver(syncSoon);
				observer.observe(wysiwyg, { childList: true, subtree: true, attributes: true, characterData: true });
			}
			form?.addEventListener('submit', syncNow, true);
		}, 0);

		return () => {
			clearTimeout(timer);
			clearTimeout(syncTimer);
			observer?.disconnect();
			form?.removeEventListener('submit', syncNow, true);
			editor?.destroy();
			editor = null;
			container.replaceChildren();
		};
		// El contenido inicial solo se lee al crear el editor
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div>
			<div ref={containerRef} />
			{name && <input type='hidden' name={name} value={html} />}
		</div>
	);
}
