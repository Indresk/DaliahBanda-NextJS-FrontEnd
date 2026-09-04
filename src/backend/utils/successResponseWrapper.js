export default function successResponseWrapper(payload, message) {
	return { status: 'success', payload, message };
}
