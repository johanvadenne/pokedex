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

appelleAPI("http://127.0.0.1:5001/")
.then(donneePokemeon =>{
    const contenaireImage = document.getElementById("contenaireImage");
    element ="";
    console.log(donneePokemeon.length)
    for (let index = 0; index < donneePokemeon.length; index++) {
        strid = ""+donneePokemeon[index].id+"";
        num = strid.padStart(3, '0');
        if (index <= 8) {
            element+="<div class=\"image card pika\"><img src=\"./assets/POKEDEX/FILES/carte pokemon/"+num+".jpg\"></div>";
        }
        else {
            element+="<div class=\"image card pika\"><img src=\"./assets/images/pokemon_card_back.jpg\" data-src=\"./assets/POKEDEX/FILES/carte pokemon/"+num+".jpg\"></div>";
        }
    }
    contenaireImage.innerHTML += element;
    animationCard();
}
)

// Sélectionnez l'image de remplacement
const placeholder = document.getElementById("placeholder");

// Fonction pour cacher l'image de remplacement
function hidePlaceholder() {
    placeholder.style.display = "none";
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
      .on("mousemove touchmove", function(e) { 
        // normalise touch/mouse
        var pos = [e.offsetX,e.offsetY];
        e.preventDefault();
        if ( e.type === "touchmove" ) {
          pos = [ e.touches[0].clientX, e.touches[0].clientY ];
        }
        var $card = $(this);
        // math for mouse position
        var l = pos[0];
        var t = pos[1];
        var h = $card.height();
        var w = $card.width();
        var px = Math.abs(Math.floor(100 / w * l)-100);
        var py = Math.abs(Math.floor(100 / h * t)-100);
        var pa = (50-px)+(50-py);
        // math for gradient / background positions
        var lp = (50+(px - 50)/1.5);
        var tp = (50+(py - 50)/1.5);
        var px_spark = (50+(px - 50)/7);
        var py_spark = (50+(py - 50)/7);
        var p_opc = 20+(Math.abs(pa)*1.5);
        var ty = ((tp - 50)/2) * -1;
        var tx = ((lp - 50)/1.5) * .5;
        // css to apply for active card
        var grad_pos = `background-position: ${lp}% ${tp}%;`
        var sprk_pos = `background-position: ${px_spark}% ${py_spark}%;`
        var opc = `opacity: ${p_opc/100};`
        var tf = `transform: rotateX(${ty}deg) rotateY(${tx}deg)`
        // need to use a <style> tag for psuedo elements
        var style = `
          .card:hover:before { ${grad_pos} }  /* gradient */
          .card:hover:after { ${sprk_pos} ${opc} }   /* sparkles */ 
        `
        // set / apply css class and style
        $cards.removeClass("active");
        $card.removeClass("animated");
        $card.attr( "style", tf );
        $style.html(style);
        if ( e.type === "touchmove" ) {
          return false; 
        }
        clearTimeout(x);
      }).on("mouseout touchend touchcancel", function() {
        // remove css, apply custom animation on end
        var $card = $(this);
        $style.html("");
        $card.removeAttr("style");
        x = setTimeout(function() {
          $card.addClass("animated");
        },2500);
      });
}