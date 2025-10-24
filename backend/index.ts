import dotenv from 'dotenv';
import app from "./src/app";
dotenv.config();
console.log(process.env.PORT);
const PORT:any = process.env.PORT || 8000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${process.env.PORT || 8000}`);
});
