import 'server-only';

import { NextResponse } from 'next/server';

// Itera por cada función en el array para aplicar los middlewares necesarios en proxy.js

export default function middlewareIterator(functions = [], index = 0) {
	const current = functions[index];
	if (current) {
		const next = middlewareIterator(functions, index + 1);
		return current(next);
	}
	return () => NextResponse.next();
}
