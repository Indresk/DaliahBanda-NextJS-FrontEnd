// Datos estructurados (schema.org) para buscadores. Se reemplaza "<" para que un texto
// con "</script>" no pueda cerrar la etiqueta (recomendación de Next para JSON-LD).
export default function JsonLd({ data }) {
	return (
		<script
			type='application/ld+json'
			dangerouslySetInnerHTML={{
				__html: JSON.stringify(data).replace(/</g, '\\u003c'),
			}}
		/>
	);
}
