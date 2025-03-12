import express from 'express';
import dotenv from 'dotenv';

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import connectToMongoDB from './db/connectTomongoDB.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // to parse the incoming request with JSON payloads

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

//app.get('/', (req, res) => {
    // route route http://localhost:5000/
    //res.send('Hello World !!!');
//});



app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server is running on port ${PORT}`)
});

//wwwdanukasampath06