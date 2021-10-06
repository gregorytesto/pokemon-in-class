fetch("https://pokeapi.co/api/v2/pokemon?limit=30")
    .then((res)=>{
        return res.json();
    }).then((data)=>{
        let pokemonList = data.results;
        for(let pokemon of pokemonList){
            let { name } = pokemon;
            let select = document.querySelector("#pokemon-selector select");
            
            /////////////////// Option
            let newOption = document.createElement("option");
            newOption.textContent = name[0].toUpperCase() + name.slice(1);
            newOption.value = name;
            /////////////////// Option

            select.append(newOption);
        }
    }).catch((err)=>{
        console.log(err);
    });

    let form = document.querySelector("form#pokemon-selector");

    form.addEventListener("submit", (e)=>{
        e.preventDefault();
        let selectedPokemon = e.target["pokemon-select"].value;
//         // console.log("https://pokeapi.co/api/v2/pokemon/" + selectedPokemon)
        let errMessage = document.querySelector("#error-message");
        if( selectedPokemon !== "default" ){
            errMessage.textContent = "";
            fetch("https://pokeapi.co/api/v2/pokemon/" + selectedPokemon)
                .then((res)=>res.json())
                .then((data)=>{
                    console.log(data);
                    let details = document.querySelector("#details");

                    let typeStr = data.types.map((typeEl)=>{
                        return typeEl.type.name;
                    }).join("/");

                    details.innerHTML = `<div id="details-title">
                            <h2>Details</h2>
                        </div>
                        <div id="details-img-container">
                            <img src=${data.sprites.front_default} alt="Image of selected pokémon" />
                        </div>
                        <div id="details-text">
                            <div id="details-name">Name: ${data.name}</div>
                            <div id="details-type">Type: ${typeStr}</div>
                        </div>
                        <div id="details-sub-text">
                            <h3>Base Attributes</h3>
                            <div>Hit Points: 35</div>
                            <div>Attack: 55</div>
                            <div>Defense: 40</div>
                        </div>
                        <div id="details-action">
                            <button>Add -></button>
                        </div>`;
                    // let currentPokemonEl = document.querySelector("#current-pokemon");

                    // let img = document.createElement("img");
                    // img.src = data.sprites["front_default"];
                    
                    // currentPokemonEl.append(img);
                });
        } else {
            errMessage.textContent = "Please choose a Pokemon!";
        }

//         // console.log(selectedPokemon);
    });