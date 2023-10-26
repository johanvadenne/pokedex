/** 
 
Serveur Backend Pokedex*/

const fs= require('fs');
const cors = require('cors');

// Définir l'emplacement des fichiers bases de données

const POKEDEX = "./assets/POKEDEX/DATA/pokedex.json";

// Définir l'emplacement des images

const IMAGE_POKEMON = "./assets/POKEDEX/FILES/images";

// Définir un port 

const port = 5001;

// lancer un serveur express
const express = require('express');

const app = express();

// Utilisez "cors" pour gérer les en-têtes CORS.
app.use(cors());

// lancer le serveur et attendre
app.listen(port, '127.0.0.1',
    ()=>{
        console.log('Server Pokedex is listening on ' + port);
    }
);

// Crée la route qui renvoie tout

app.get('/',
    findAllPokemon
);

app.get('/hazard',
findHazardPokemon
);

app.get('/type',
typePok
);

// fonction
function findAllPokemon(request, reponse)
{
   // Lecture du fichier
   let data = fs.readFileSync(POKEDEX);

   // Analyse du JSON
   let pokedex = JSON.parse(data);

   // Renvoie tout le json interprété

   reponse.send(pokedex);
}

function findHazardPokemon(request, response) {

   // Lecture du fichier
   let data = fs.readFileSync(POKEDEX);

   // Analyse du JSON
   let pokedex = JSON.parse(data);

   let x=0;

   x = Math.floor(Math.random() * pokedex.length) + 1;

   let lienImage = ("0"*(3-String(x)))+x;


   // Renvoie tout le jso0n interprété
   // response.send(pokedex[x]);
   response.send(IMAGE_POKEMON+"/"+lienImage+".png");
}

function typePok(request, response) {
    
   // Lecture du fichier
   let data = fs.readFileSync(POKEDEX);

   // Analyse du JSON
   let pokedex = JSON.parse(data);
   let reponse = "";

   for (let i = 0; i < pokedex.length; i++) {
    for (let j = 0; j < pokedex[i].type.length; j++) {
        if (!reponse.includes(pokedex[i].type[j])) {
            reponse += pokedex[i].type[j]+"<br>";
        }
    }
   }

   // Renvoie tout le json interprété
   response.send(reponse);
}