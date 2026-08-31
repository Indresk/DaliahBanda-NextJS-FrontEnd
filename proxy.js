import { auth } from '@/back/config/auth';
import authMiddleware from './src/backend/middlewares/auth.middleware';
import middlewareIterator from './src/backend/utils/middlewareIterator';

const pipeline = middlewareIterator([authMiddleware]);

const proxy = auth((request, event) => {
	return pipeline(request, event);
});

export const config = {
	matcher: ['/dashboard/:path*'],
};

export default proxy;
