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

const app = express();

//express() → calling this function creates your app like turning the server ON result saved in const app  const app = express()  ✅ save it in a box named app
app.use(cors());                  //allows frontend (React) to call backend without this → browser BLOCKS requests 🛑
app.use(morgan('dev'));           //logs every request in terminal shows: GET /api/auth/login 200 'dev' = development format
app.use(express.json());          //reads JSON body from requests without this → req.body is undefined 😱
app.use('/api/auth', authRoutes);                       //app.use('/api/auth', authroutes);
app.use('/api/shops', shops);                                  // routes added here later
app.use('/api/products', products);
app.use('/api/categories', categories);
app.use('/api/orders', orders);
app.use('/api/auth', admin);
app.use('/api/cart', cartRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/wishlists', wishlistRoutes);
export default app;

// ROUTE REGISTRATION:
//   /api/auth       → auth.routes.ts
//   /api/shops      → shop.routes.ts
//   /api/products   → product.routes.ts
//   /api/categories → category.routes.ts
//   /api/orders     → order.routes.ts
//   /api/admin      → admin.routes.ts
