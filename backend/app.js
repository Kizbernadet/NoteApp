// Importation des modules 
import express from "express"
import cors from "cors"
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import authRoutes from "./routes/authRoutes.js";
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import noteRoutes from './routes/noteRoutes.js';

// Configuration
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routing
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use('/tasks', taskRoutes);
app.use('/categories', categoryRoutes);
app.use("/notes", noteRoutes);

app.get("/test", (req, res) => { 
    res.status(200).json({
        message: "C'est mon serveur fonctionne"
    })
})

// Lancement du serveur 
app.listen(PORT, () => {
    console.log("Mon serveur tourne sur le port", PORT);
})



