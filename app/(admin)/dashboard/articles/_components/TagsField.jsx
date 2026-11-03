'use client';

import { useState } from 'react';
import Field, { controlClass } from '@/frontend/components/ui/Field';
import { slugify } from '@/shared/utils/slug';

// Etiquetas separadas por comas. Debajo salen las que ya existen (sin repetir las escritas) para añadirlas con un clic.
export default function TagsField({ defaultValue = [], suggestions = [] }) {
	const [text, setText] = useState(defaultValue.join(', '));

	const used = new Set(text.split(',').map((tag) => slugify(tag)));
	const available = suggestions.filter((name) => !used.has(slugify(name)));

	function add(name) {
		setText((current) => (current.trim() ? `${current.trim().replace(/,$/, '')}, ${name}` : name));
	}

	return (
		<Field
			label='Etiquetas'
			htmlFor='a-tags'
			hint='Separadas por comas. Informan al lector, categorizan el artículo (cada una tiene su página) y son las keywords.'>
			<input id='a-tags' name='tags' value={text} onChange={(e) => setText(e.target.value)} className={controlClass} />
			{available.length > 0 && (
				<ul aria-label='Etiquetas existentes' className='mt-1 flex flex-wrap gap-2'>
					{available.map((name) => (
						<li key={name}>
							<button
								type='button'
								onClick={() => add(name)}
								className='cursor-pointer bg-black px-2 py-1 text-xs hover:bg-primary'>
								+ {name}
							</button>
						</li>
					))}
				</ul>
			)}
		</Field>
	);
}
