// fetch("https://pokeapi.co/api/v2/pokemon?limit=30")
//     .then((res)=>{
//         return res.json();
//     }).then((data)=>{
//         let pokemonList = data.results;

//         // console.log(pokemonList);
//         // .sort((a,b)=>{
//         //     return a.name > b.name ? 1 : -1;
//         // });
//         for(let pokemon of pokemonList){
//             // let select = document.querySelector("select");

//             // let newOption = document.createElement("option");
//             // newOption.textContent = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
//             // newOption.value = pokemon.name;

//             // select.append(newOption);

//             /////////////////// Option
//             let newOption = document.createElement("option");
//             newOption.textContent = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
//             newOption.value = pokemon.name;
//             /////////////////// Option

//             let select = document.querySelector("select");
//             select.append(newOption);
//         }
//     }).catch((err)=>{
//         console.log(err);
//     });

//     // a[target="_blank"]

//     let form = document.querySelector("form");

//     form.addEventListener("submit", (e)=>{
//         e.preventDefault();
//         let selectedPokemon = e.target["pokemon-select"].value;

//         // console.log("https://pokeapi.co/api/v2/pokemon/" + selectedPokemon)
//         let errMessage = document.querySelector("#error-message");
//         if( selectedPokemon !== "default" ){
//             errMessage.textContent = "";
//             fetch("https://pokeapi.co/api/v2/pokemon/" + selectedPokemon)
//                 .then((res)=>res.json())
//                 .then((data)=>{
//                     let currentPokemonEl = document.querySelector("#current-pokemon");

//                     let img = document.createElement("img");
//                     img.src = data.sprites["front_default"];
                    
//                     currentPokemonEl.append(img);
//                 });
//         } else {
//             errMessage.textContent = "Please select a Pokemon!";
//         }

//         // console.log(selectedPokemon);
//     });