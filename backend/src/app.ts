// WHAT: Express app setup — registers all middleware and routes
// IMPORTS: all routes, error.middleware, rateLimiter.middleware
// USED BY: server.ts
// ORDER MATTERS: cors → helmet → rateLimiter → body-parser → routes → error handler (last!)

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes';
import shops from './routes/shop.routes';
import products from './routes/product.routes';
import categories from './routes/category.routes';
import orders from './routes/order.routes';
import admin from './routes/admin.routes';
import cartRoutes from './routes/cart.routes';
import addressRoutes from './routes/address.routes';
import notificationRoutes from './routes/notification.routes';
import wishlistRoutes from './routes/wishlist.routes';
import reviewRoutes from './routes/review.routes';
import shippingRoutes from './routes/shipping.routes';
import shopSettingsRoutes from './routes/shop-setting.routes'; // 🔧 added
import { errorMiddleware } from './middleware/error.middleware'; // 🔧 added

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/shops', shops);
app.use('/api/products', products);
app.use('/api/categories', categories);
app.use('/api/orders', orders);
app.use('/api/admin', admin);
app.use('/api/cart', cartRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/wishlists', wishlistRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/shipping', shippingRoutes);
app.use('/api/shop-settings', shopSettingsRoutes); // 🔧 added

app.use(errorMiddleware); // 🔧 LAST — catches all errors

export default app;
// ROUTE REGISTRATION:
//   /api/auth       → auth.routes.ts
//   /api/shops      → shop.routes.ts
//   /api/products   → product.routes.ts
//   /api/categories → category.routes.ts
//   /api/orders     → order.routes.ts
//   /api/admin      → admin.routes.ts
