var elementEnreg = "";
var jsonEnreg = null;
const contenaireImage = document.getElementById("contenaireImage");
const bodyTable = document.getElementById("body_table");
const searchBarrePokemon = document.getElementById("search_barre_pokemon");
const popupSearchPokemon = document.getElementById("popup_search_pokemon");

// FR: effectue une requette GET à une API
// EN: makes a GET request to an API
function appelleAPI(url) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur de réseau');
      }
      return response.json();
    })
    .catch(error => {
      //console.error('Erreur :', error);
      throw error;
    });
}

// FR: affiche toutes les cartes pokémon
// EN: displays all pokemon cards
function viewAllPokemon() {
  // FR: Vérifie si des éléments sont déjà enregistrés
  // EN: Checks if elements are already registered
  if (elementEnreg != "") {
    // FR: Si des éléments sont enregistrés, réaffiche-les
    // EN: If items are saved, redisplay them
    reafficheTout();
  } else {
    // FR: Si aucun élément n'est enregistré, effectue une requête API
    // EN: If no elements are registered, perform an API request
    appelleAPI("http://127.0.0.1:5001/")
      .then(pokemonData => {
        
        // FR: Les données des Pokémon sont stockées dans pokemonData
        // EN: Pokémon data are stored in pokemonData
        jsonEnreg = pokemonData;
        element = "";

        // FR: Parcours des données de chaque Pokémon
        // EN: Data browsing for each Pokémon
        for (let index = 0; index < pokemonData.length; index++) {
          strid = "" + pokemonData[index].id + "";
          name = pokemonData[index].name.french;
          num = strid.padStart(3, '0');

          // FR: les 9 premières cartes sont affichées, les autres sont cachés pour économiser de la bande passante
          // EN: the first 9 cards are displayed, the others are hidden to save bandwidth
          if (index <= 8) {
            element += "<div onclick=\"displayPokemonName('" + name + "')\" class=\"image card pika\"><img id=\"" + num + "\" src=\"./assets/POKEDEX/FILES/carte pokemon/" + num + ".jpg\"></div>";
          } else {
            element += "<div onclick=\"displayPokemonName('" + name + "')\" class=\"image card pika\"><img id=\"" + num + "\" src=\"./assets/images/pokemon_card_back.jpg\" data-src=\"./assets/POKEDEX/FILES/carte pokemon/" + num + ".jpg\"></div>";
          }
        }

        // FR: affiche toutes les cartes pokémon
        // EN: displays all pokémon cards
        contenaireImage.innerHTML = element;

        // FR: Enregistre le HTML généré dans la variable elementEnreg
        // EN: Stores the generated HTML in the elementEnreg variable
        elementEnreg = element;

        // FR: Appelle la fonction pour animer les cartes
        // EN: Calls up the function for animating cards
        animationCard();
      });
  }
}


// FR: Fonction pour charger les images lorsque l'utilisateur fait scroll
// EN: Function to load images when user scrolls
function lazyLoadImages() {
  const images = document.querySelectorAll("img[data-src]");

  images.forEach(image => {
    const rect = image.getBoundingClientRect();
    const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);

    if (rect.top >= 0 && rect.top <= viewHeight) {
      image.src = image.getAttribute("data-src");
      image.removeAttribute("data-src");
      image.onload = hidePlaceholder;
    }
  });
}

// FR: Attachez un gestionnaire d'événement à l'événement "scroll" pour déclencher le chargement des images lorsque l'utilisateur fait défiler
// EN: Attach an event handler to the "scroll" event to trigger image loading when the user scrolls
window.addEventListener("scroll", lazyLoadImages);

// FR: Appelez la fonction une fois au chargement initial de la page pour charger les images visibles
// EN: Call the function once on initial page load to load visible images
window.addEventListener("load", lazyLoadImages);


function animationCard() {
  /*
  using 
    - an animated gif of sparkles.
    - an animated gradient as a holo effect.
    - color-dodge mix blend mode
  */
  var x;
  var $cards = $(".card");
  var $style = $(".hover");

  $cards
    .on("mousemove touchmove", function (e) {
      // normalise touch/mouse
      var pos = [e.offsetX, e.offsetY];
      e.preventDefault();
      if (e.type === "touchmove") {
        pos = [e.touches[0].clientX, e.touches[0].clientY];
      }
      var $card = $(this);
      // math for mouse position
      var l = pos[0];
      var t = pos[1];
      var h = $card.height();
      var w = $card.width();
      var px = Math.abs(Math.floor(100 / w * l) - 100);
      var py = Math.abs(Math.floor(100 / h * t) - 100);
      var pa = (50 - px) + (50 - py);
      // math for gradient / background positions
      var lp = (50 + (px - 50) / 1.5);
      var tp = (50 + (py - 50) / 1.5);
      var px_spark = (50 + (px - 50) / 7);
      var py_spark = (50 + (py - 50) / 7);
      var p_opc = 20 + (Math.abs(pa) * 1.5);
      var ty = ((tp - 50) / 2) * -1;
      var tx = ((lp - 50) / 1.5) * .5;
      // css to apply for active card
      var grad_pos = `background-position: ${lp}% ${tp}%;`
      var sprk_pos = `background-position: ${px_spark}% ${py_spark}%;`
      var opc = `opacity: ${p_opc / 100};`
      var tf = `transform: rotateX(${ty}deg) rotateY(${tx}deg)`
      // need to use a <style> tag for psuedo elements
      var style = `
          .card:hover:before { ${grad_pos} }  /* gradient */
          .card:hover:after { ${sprk_pos} ${opc} }   /* sparkles */ 
        `
      // set / apply css class and style
      $cards.removeClass("active");
      $card.removeClass("animated");
      $card.attr("style", tf);
      $style.html(style);
      if (e.type === "touchmove") {
        return false;
      }
      clearTimeout(x);
    }).on("mouseout touchend touchcancel", function () {
      // remove css, apply custom animation on end
      var $card = $(this);
      $style.html("");
      $card.removeAttr("style");
      x = setTimeout(function () {
        $card.addClass("animated");
      }, 2500);
    });
}

// FR: affiche un pokémon aléatoire
// EN: display random pokemon
function randomPokemon() {
  appelleAPI("http://127.0.0.1:5001/hazard")
    .then(pokemonData => displayPokemon(pokemonData))
}

// FR: affiche un pokémon par nom
// EN: display pokemon by name
function displayPokemonName(name, recherche = false) {
  appelleAPI("http://127.0.0.1:5001/pokemon?pokemon=" + name + "")
    .then(pokemonData => {
      if (recherche) {
        popupSearchPokemon.style.display = "none";
        displayPokemon(pokemonData, false);
      } else {
        displayPokemon(pokemonData, true);
      }
    }
      )

}

// FR: affiche un pokémon
// EN: display pokemon
function displayPokemon(pokemonData, returnAll = false) {

  // init
  const name = pokemonData.name.french;
  const type = pokemonData.type.join("/");
  const HP = pokemonData.base.HP;
  const Attack = pokemonData.base.Attack;
  const Defense = pokemonData.base.Defense;
  const SpAttack = pokemonData.base["Sp. Attack"];
  const SpDefense = pokemonData.base["Sp. Defense"];
  const Speed = pokemonData.base.Speed;
  element = "";
  strid = "" + pokemonData.id + "";
  num = strid.padStart(3, '0');


  if (returnAll) {
    element += "<button onclick=\"reafficheTout()\" id=\"returnAll\">retour</button>"
  }
  element += "<div class=\"present_pokemon\">";
  element += "    <div class=\"container_card\">";
  element += "        <div class=\"image card pika\">";
  element += "            <img src=\"./assets/POKEDEX/FILES/carte pokemon/" + num + ".jpg\">";
  element += "        </div>";
  element += "    </div>";
  element += "    <div>";
  element += "        <div class=\"image_pokemon\">";
  element += "            <img src=\"./assets/POKEDEX/FILES/images/" + num + ".png\">";
  element += "            <img class=\"sprites\" src=\"./assets/POKEDEX/FILES/sprites/" + num + "MS.png\">";
  element += "        </div>";
  element += "        <div>";
  element += "            <h2>" + name + " " + num + "</h2>";
  element += "            <p>";
  element += "                <b>Type</b>: " + type + "<br>";
  element += "                <b>HP</b>: " + HP + "<br>";
  element += "                <b>Attaque</b>: " + Attack + "<br>";
  element += "                <b>Défense</b>: " + Defense + "<br>";
  element += "                <b>Sp.</b> Attaque: " + SpAttack + "<br>";
  element += "                <b>Sp.</b> Défense: " + SpDefense + "<br>";
  element += "                <b>Vitesse</b>: " + Speed + "<br>";
  element += "            </p>";
  element += "        </div>";
  element += "    </div>";
  element += "</div>";
  contenaireImage.innerHTML = element;
  animationCard();
}

// FR: réaffiche les pokémon
// EN: redisplay the pokemon
function reafficheTout() {
  contenaireImage.innerHTML = elementEnreg;
}

// FR: à chaque modification de saisie, cherche les pokémon correspondant à la recherche de l'utilisateur
// EN: each time you modify an entry, searches for pokémon matching the user's query
searchBarrePokemon.addEventListener('input', function() {
    pokemonRechercher = searchBarrePokemon.value;
    if (jsonEnreg != null) {
      recherchePokemon(pokemonRechercher);
    } else {
      appelleAPI("http://127.0.0.1:5001/")
      .then(pokemonData => {
        jsonEnreg = pokemonData;
        recherchePokemon(pokemonRechercher);
      }
  )
    }
});

// FR: cherche les pokémon correspondant à la recherche de l'utilisateur
// EN: searches for pokémon matching the user's query
function recherchePokemon(pokemonRechercher) {
  var lignes = "";

  for (let i = 0; i < jsonEnreg.length; i++) {
    console.log(pokemonRechercher);
    console.log(
      jsonEnreg[i].name.english.includes(pokemonRechercher) ||
      jsonEnreg[i].name.japanese.includes(pokemonRechercher) ||
      jsonEnreg[i].name.chinese.includes(pokemonRechercher) ||
      jsonEnreg[i].name.french.includes(pokemonRechercher));
    if (
        jsonEnreg[i].name.english.includes(pokemonRechercher) ||
        jsonEnreg[i].name.japanese.includes(pokemonRechercher) ||
        jsonEnreg[i].name.chinese.includes(pokemonRechercher) ||
        jsonEnreg[i].name.french.includes(pokemonRechercher)
    ) {
      strid = "" + jsonEnreg[i].id + "";
      num = strid.padStart(3, '0');
      lignes += "<tr class=\"ligne\" onclick=\"displayPokemonName('"+jsonEnreg[i].name.french+"', true)\">";
      lignes += "<td>"+num+"</td>";
      lignes += "<td><img class=\"sprites\" src=\"./assets/POKEDEX/FILES/sprites/" + num + "MS.png\"></td>";
      lignes += "<td>"+jsonEnreg[i].name.french+"</td>";
      lignes += "</tr>";
    }
  }

  bodyTable.innerHTML = lignes;
}

// FR: affiche popup
// EN: display popup
function viewPopup() {
  popupSearchPokemon.style.display = "block";
}