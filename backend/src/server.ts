// WHAT: Entry point — connects DB then starts HTTP server
// IMPORTS: app.ts, config/database.ts
// FLOW: connectDB() → app.listen(PORT)
import './models/index';
import app from './app';
import database from './config/database';
import {env} from './config/env';

async function startServer() 
{
    try 
    {    
        await database.authenticate();
        console.log('database connected');

        app.listen(env.PORT, () => 
        { 
            console.log(`server running on port ${env.PORT}`)
        });
    }
    catch (error)
    {
        console.error('error starting server:', error);
        process.exit(1);
    }
}

startServer();