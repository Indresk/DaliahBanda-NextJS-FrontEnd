import { USER_ROLES } from '@/shared/constants';

const { ADMIN, MEMBER } = USER_ROLES;

// Secciones del dashboard y los roles que pueden verlas.
// Cada página vuelve a exigir su rol con requirePageRole: ocultar un enlace no protege la ruta.
export const DASHBOARD_SECTIONS = [
	{ href: '/dashboard', label: 'Resumen', icon: 'dashboard', roles: [ADMIN, MEMBER] },
	{ href: '/dashboard/stream', label: 'Transmisión', icon: 'podcasts', roles: [ADMIN, MEMBER] },
	{ href: '/dashboard/emails', label: 'Correos permitidos', icon: 'admin_panel_settings', roles: [ADMIN] },
	{ href: '/dashboard/subscribers', label: 'Suscriptores', icon: 'mail', roles: [ADMIN] },
	{ href: '/dashboard/assets', label: 'Assets', icon: 'folder', roles: [ADMIN] },
	{ href: '/dashboard/music', label: 'Música', icon: 'album', roles: [ADMIN] },
	{ href: '/dashboard/members', label: 'Miembros', icon: 'groups', roles: [ADMIN] },
	{ href: '/dashboard/lineup', label: 'Formación', icon: 'timeline', roles: [ADMIN] },
	{ href: '/dashboard/flyers', label: 'Flyers', icon: 'campaign', roles: [ADMIN] },
	{ href: '/dashboard/gallery', label: 'Galería', icon: 'photo_library', roles: [ADMIN] },
];
