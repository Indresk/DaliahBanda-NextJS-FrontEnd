'use client';

import { useState } from 'react';
import Card from '@/frontend/components/ui/Card';
import TextEditor from '@/frontend/components/inputs/TextEditor/TextEditorLoader';
import { RICH_TEXT } from '@/shared/constants';
import { toEditorHtml } from '@/frontend/utils/richText';

// Texto plano como el que había antes del editor: debe cargarse en párrafos, no en uno solo
const LEGACY_TEXT = 'Esta historia estaba guardada como texto plano.\nSalto de línea simple.\n\nSegundo párrafo, tras una línea en blanco.';

export default function TestEditorDemo() {
	const [html, setHtml] = useState(LEGACY_TEXT);

	return (
		<div className='flex flex-col gap-6'>
			<Card title='Editor'>
				<TextEditor name='story' defaultValue={LEGACY_TEXT} onChange={setHtml} />
			</Card>

			<Card title='Vista previa (estilos globales del sitio)'>
				{html ? (
					// toEditorHtml también convierte el texto plano antiguo en párrafos: úsalo al mostrarlo.
					// `rich-text` (globals.css) da estilo a listas, títulos, citas, enlaces e iframes.
					<div className='rich-text' dangerouslySetInnerHTML={{ __html: toEditorHtml(html) }} />
				) : (
					<p className='text-sm text-lightgray'>El editor está vacío: se guardaría como campo vacío.</p>
				)}
			</Card>

			<Card title={`HTML que se guardaría (${html.length} de ${RICH_TEXT.MAX_LENGTH.toLocaleString('es-CO')} caracteres)`}>
				<pre className='max-h-96 overflow-auto whitespace-pre-wrap break-all bg-black p-3 text-xs'>{html || '(vacío)'}</pre>
			</Card>
		</div>
	);
}
