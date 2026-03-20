// Importation des modules 
import express from "express"
import cors from "cors"
import dotenv from "dotenv"

// Configuration
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routing
app.get("/", (req, res) => { 
    res.status(200).json({
        message: "C'est mon serveur fonctionne"
    })
})

// Lancement du serveur 
app.listen(PORT, () => {
    console.log("Mon serveur tourne sur le port", PORT);
})



