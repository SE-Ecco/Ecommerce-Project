import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
                                  //import authroutes from './routes/auth.routes';
const app = express();            //express() → calling this function creates your app like turning the server ON result saved in const app  const app = express()  ✅ save it in a box named app
app.use(cors());                  //allows frontend (React) to call backend without this → browser BLOCKS requests 🛑
app.use(morgan('dev'));           //logs every request in terminal shows: GET /api/auth/login 200 'dev' = development format
app.use(express.json());          //reads JSON body from requests without this → req.body is undefined 😱
                                  //app.use('/api/auth', authroutes);
                                  // routes added here later

export default app;

























// WHAT: Express app setup — registers all middleware and routes
// IMPORTS: all routes, error.middleware, rateLimiter.middleware
// USED BY: server.ts
// ORDER MATTERS: cors → helmet → rateLimiter → body-parser → routes → error handler (last!)
//
// ROUTE REGISTRATION:
//   /api/auth       → auth.routes.ts
//   /api/shops      → shop.routes.ts
//   /api/products   → product.routes.ts
//   /api/categories → category.routes.ts
//   /api/orders     → order.routes.ts
//   /api/admin      → admin.routes.ts
