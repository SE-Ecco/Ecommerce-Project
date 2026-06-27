import dotenv from 'dotenv' //reads your .env file loads all values into process.env
dotenv.config()

const required = (name: string): string => {    
  throw new Error(`${name} is missing from .env!`)
}

/*
const required     → locked box named required
(name: string)     → takes one input, must be string
: string           → returns a string
=> {               → arrow function body starts
throw new Error()  → crashes with message
`${name}...`       → puts name variable inside the message*/



export const env = {
  DATABASE_URL: process.env.DATABASE_URL || required('DATABASE_URL'),
  JWT_SECRET:   process.env.JWT_SECRET   || required('JWT_SECRET'),
  PORT:         process.env.PORT         || '5000',
  CLOUDINARY_URL: process.env.CLOUDINARY_URL || required('CLOUDINARY_URL'),
}

/*  
export        → share this with other files
const env     → create a locked box function called env
= {           → the box contains an OBJECT
object = collection of key:value pairs
DATABASE_URL: → key name (what we call it)
other files will use env.DATABASE_URL
process.env.DATABASE_URL → go read DATABASE_URL from .env file||→ 
OR if left side is empty → go to right side required('DATABASE_URL') → call our helper crashes with message
"DATABASE_URL is missing!" 🛑
PORT:         → key name
process.env.PORT → read PORT from .env
|| '5000'     → OR use '5000' as default
PORT is optional → has fallback value
} → close the object */