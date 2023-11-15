/* Serveur Backend Pokedex */


// init
const fs = require('fs');
const cors = require('cors');
const express = require('express');
const app = express();

// FR: Définir l'emplacement des fichiers bases de données
// EN: Define the location of database files
const POKEDEX = "./assets/POKEDEX/DATA/pokedex.json";

// FR: Définir un port 
// EN: Define a port 
const port = 5001;


// FR: Utilisez "cors" pour gérer les en-têtes CORS.
// EN: Use "cors" to manage CORS headers.
app.use(cors());

// FR: lancer le serveur et attendre
// EN: start the server and wait
app.listen(port, '127.0.0.1',
    () => {
        console.log('Server Pokedex is listening on ' + port);
    }
);

// FR: création des routes
// EN: creating roads
app.get('/',findAllPokemon); // return all pokemon
app.get('/hazard',findHazardPokemon); // return a random pokemon
app.get('/pokemon', findPokemon); // return one pokemon


// FR: retourner tous les pokémon
// EN: return all pokemon
function findAllPokemon(request, reponse) {
    // FR: Lecture du fichier
    // EN: Read file
    let data = fs.readFileSync(POKEDEX);

    let pokedex = JSON.parse(data);

    // FR: Renvoie tout le json interprété
    // EN: Returns all interpreted json
    reponse.send(pokedex);
}

// FR: retourne un pokémon aléatoire
// EN: return a random pokemon
function findHazardPokemon(request, reponse) {

    // FR: Lecture du fichier
    // EN: Read file
    let data = fs.readFileSync(POKEDEX);

    let pokedex = JSON.parse(data);

    // FR: choisis un pokémon aléatoire
    // EN: choose a random pokémon
    let id = 0;
    id = Math.floor(Math.random() * pokedex.length) + 1;

    // FR: Renvoie tout le json interprété
    // EN: Returns all interpreted json
    reponse.send(pokedex[id]);
}

// FR: return un pokémon
// EN: return one pokemon
function findPokemon(request, reponse) {

    // init
    const pokemon = request.query.pokemon;
    const id = request.query.id;
    let pokemonData = null;

    // FR: Lecture du fichier
    // EN: Read file
    let data = fs.readFileSync(POKEDEX);
    let pokedex = JSON.parse(data);

    // FR: si un nom de pokémon est saisie
    // EN: if a pokémon name is entered
    if (pokemon) {

        // FR: cherche un pokémon par son nom
        // EN: search for a pokémon by name
        for (let i = 0; i < pokedex.length; i++) {
            if (
                pokedex[i].name.english == pokemon ||
                pokedex[i].name.japanese == pokemon ||
                pokedex[i].name.chinese == pokemon ||
                pokedex[i].name.french == pokemon
            ) {
                pokemonData = pokedex[i];
                break;
            }
        }

        if (pokemonData) {
            // FR: Renvoie le Pokémon trouvé
            // EN: Returns the Pokémon founds
            reponse.send(pokemonData);
        } else {
            // not found
            reponse.send('Aucun Pokémon trouvé avec ce nom.');
        }
    } 
    // FR: si un id de pokémon est saisie
    // EN: if a pokémon id is entered
    else if(id) {

        // FR: cherche un pokémon par son id
        // EN: search for a pokémon by id
        for (let i = 0; i < pokedex.length; i++) {
            if ( pokedex[i].id == id) {
                pokemonData = pokedex[i];
                break;
            }
        }

        if (pokemonData) {
            // FR: Renvoie le Pokémon trouvé
            // EN: Returns the Pokémon founds
            reponse.send(pokemonData);
        } else {
            // not found
            reponse.send('Aucun Pokémon trouvé avec cette id.');
        }
    }
     else {
        // erreur
        reponse.send('Veuillez entrer un champ dans l\'URL en utilisant ?pokemon=nom_du_pokemon ou ?id=id_pokemon.');
    }
}