import dotenv from 'dotenv';
import app from "./src/app";
dotenv.config();
console.log(process.env.PORT);
const PORT:any = process.env.PORT || 3000;

app.listen(PORT,()=> console.log(`Server listening at http://localhost:${PORT}`));