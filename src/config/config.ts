import dotenv from 'dotenv';
dotenv.config();

export const config = {
    jwtSecret: process.env.JWT_SECRET,
    host: process.env.BD_HOST,
    user: process.env.BD_USER,
    password:process.env.BD_PASSWORD,
    database: process.env.BD_NAME,
    port: parseInt(process.env.BD_PORT || "3306"),
}
