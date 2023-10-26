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
        element+="<div class=\"image card\"><img src=\"./assets/POKEDEX/FILES/carte pokemon/"+num+".jpg\"></div>"
    }
    contenaireImage.innerHTML += element;
    VanillaTilt.init(document.querySelectorAll(".card"),{
        max: 25,
        speed: 400,
        glare: true,
        "max-glare": 1,
    });
}
)


// <div class="image">
// <img src="./assets/images/carte pokemon/poke (9).jpg" alt="Image 3">
// </div>