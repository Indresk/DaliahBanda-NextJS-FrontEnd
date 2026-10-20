import 'server-only';

// Convierte un FormData en un objeto plano para validarlo con un schema:
//  lists     campos con varios valores (checkboxes con el mismo name) → arreglo
//  booleans  checkboxes (marcado = "on"/"true") → booleano
//  el resto  texto; los vacíos quedan como "" y el schema decide qué hacer
export function formDataToObject(formData, { lists = [], booleans = [] } = {}) {
	const result = {};

	for (const key of new Set(formData.keys())) {
		if (lists.includes(key)) result[key] = formData.getAll(key).map(String);
		else if (booleans.includes(key)) result[key] = ['on', 'true'].includes(String(formData.get(key)));
		else result[key] = String(formData.get(key) ?? '');
	}

	// Un checkbox sin marcar no se envía: se registra como false
	for (const key of booleans) result[key] ??= false;
	for (const key of lists) result[key] ??= [];

	return result;
}
