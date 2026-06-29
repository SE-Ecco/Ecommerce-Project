// WHAT: Entry point — connects DB then starts HTTP server
// IMPORTS: app.ts, config/database.ts
// FLOW: connectDB() → app.listen(PORT)

import app from './app';    //the express setup
import database from './config/database';   //the connection
import {env} from './config/env';    //gets PORT number

async function startServer() 
{
    try 
    {    
        await database.authenticate();   //wait for DB //tests the connection "hey PostgreSQL, are you there?"
        console.log('database connected');   //safe to start

     app.listen(env.PORT, () =>  //starts accepting requests
     { 
      console.log(`server running on port ${env.PORT}`)
     });
    }
    catch (error)
    {``
        console.error('error starting server:', error);
        process.exit(1);  //force stop the whole program 1 = error 0 = stopped successfully
    }
}

startServer();
