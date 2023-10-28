var elementEnreg = "";
var jsonEnreg = null;
const contenaireImage = document.getElementById("contenaireImage");
const corpsTable = document.getElementById("corps_table");
const barreDeRecherchePokemon = document.getElementById("barre_de_recherche_pokemon");
const popupRecherche = document.getElementById("popup_recherche");

// FR: fait une requette GET à une API
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

function afficheToutPokemon() {
  if (elementEnreg != "") {
    reafficheTout()
  } else {
    appelleAPI("http://127.0.0.1:5001/")
      .then(donneePokemeon => {
        jsonEnreg = donneePokemeon;
        element = "";
        for (let index = 0; index < donneePokemeon.length; index++) {
          strid = "" + donneePokemeon[index].id + "";
          nom = donneePokemeon[index].name.french;
          num = strid.padStart(3, '0');
          if (index <= 8) {
            element += "<div onclick=\"affichePokemonNom('" + nom + "')\" class=\"image card pika\"><img id=\"" + num + "\" src=\"./assets/POKEDEX/FILES/carte pokemon/" + num + ".jpg\"></div>";
          }
          else {
            element += "<div onclick=\"affichePokemonNom('" + nom + "')\" class=\"image card pika\"><img id=\"" + num + "\" src=\"./assets/images/pokemon_card_back.jpg\" data-src=\"./assets/POKEDEX/FILES/carte pokemon/" + num + ".jpg\"></div>";
          }
        }
        contenaireImage.innerHTML = element;
        elementEnreg = element;
        animationCard();
      }
      )
  }
}

// Fonction pour charger les images lorsque l'utilisateur fait défiler
function lazyLoadImages() {
  const images = document.querySelectorAll("img[data-src]");

  images.forEach(image => {
    const rect = image.getBoundingClientRect();
    const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);

    if (rect.top >= 0 && rect.top <= viewHeight) {
      // L'image est visible, chargez-la
      image.src = image.getAttribute("data-src");
      image.removeAttribute("data-src");
      image.onload = hidePlaceholder; // Cacher l'image de remplacement lorsque l'image est chargée
    }
  });
}

// Attachez un gestionnaire d'événement à l'événement "scroll" pour déclencher le chargement des images lorsque l'utilisateur fait défiler
window.addEventListener("scroll", lazyLoadImages);

// Appelez la fonction une fois au chargement initial de la page pour charger les images visibles
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

function aleatoirePokemon() {
  appelleAPI("http://127.0.0.1:5001/hazard")
    .then(donneesPokemon => affichePokemon(donneesPokemon))
}

function affichePokemonNom(nom, recherche = false) {
  appelleAPI("http://127.0.0.1:5001/pokemon?pokemon=" + nom + "")
    .then(donneesPokemon => {
      if (recherche) {
        popupRecherche.style.display = "none";
        affichePokemon(donneesPokemon, false);
      } else {
        affichePokemon(donneesPokemon, true);
      }
    }
      )

}

function affichePokemon(donneePokemeon, returnAll = false) {
  const name = donneePokemeon.name.french;
  const type = donneePokemeon.type.join("/");
  const HP = donneePokemeon.base.HP;
  const Attack = donneePokemeon.base.Attack;
  const Defense = donneePokemeon.base.Defense;
  const SpAttack = donneePokemeon.base["Sp. Attack"];
  const SpDefense = donneePokemeon.base["Sp. Defense"];
  const Speed = donneePokemeon.base.Speed;
  element = "";
  strid = "" + donneePokemeon.id + "";
  num = strid.padStart(3, '0');
  if (returnAll) {
    element += "<button onclick=\"reafficheTout()\" id=\"returnAll\">returnAll</button>"
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

function reafficheTout() {
  contenaireImage.innerHTML = elementEnreg;
}

barreDeRecherchePokemon.addEventListener('input', function() {
    pokemonRechercher = barreDeRecherchePokemon.value;
    if (jsonEnreg != null) {
      recherchePokemon(pokemonRechercher);
    } else {
      appelleAPI("http://127.0.0.1:5001/")
      .then(donneePokemeon => {
        jsonEnreg = donneePokemeon;
        recherchePokemon(pokemonRechercher);
      }
  )
    }
});

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
      lignes += "<tr class=\"ligne\" onclick=\"affichePokemonNom('"+jsonEnreg[i].name.french+"', true)\">";
      lignes += "<td>"+num+"</td>";
      lignes += "<td><img class=\"sprites\" src=\"./assets/POKEDEX/FILES/sprites/" + num + "MS.png\"></td>";
      lignes += "<td>"+jsonEnreg[i].name.french+"</td>";
      lignes += "</tr>";
    }
  }

  corpsTable.innerHTML = lignes;
}

function affichePopup() {
  popupRecherche.style.display = "block";
}