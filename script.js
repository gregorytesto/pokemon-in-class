function fetchPokemonDetails(pokemonName, shouldAddToRecent){

    let errMessage = document.querySelector("#error-message");
    if( pokemonName !== "default" ){
        errMessage.textContent = "";
        fetch("https://pokeapi.co/api/v2/pokemon/" + pokemonName)
            .then((res)=>res.json())
            .then((data)=>{
                console.log(data);
                let hp;
                let atk;
                let def;
                
                for(let statObj of data.stats){
                    if(statObj.stat.name === "hp"){
                        hp = statObj.base_stat;
                    } else if(statObj.stat.name === "attack"){
                        atk = statObj.base_stat;
                    } else if(statObj.stat.name === "defense"){
                        def = statObj.base_stat;
                    }
                }

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
                        <div>Name: <span id="details-name">${data.name}</span></div>
                        <div>Type: <span id="details-type">${typeStr}</span></div>
                        <div>Weight: <span id="details-weight">${data.weight}</span> hectograms</div>
                        <div>Height: <span id="details-height">${data.height}</span> decimeters</div>
                    </div>
                    <div id="details-sub-text">
                        <h3>Base Attributes</h3>
                        <div>Health Points: <span id="details-stats-hp">${hp}</span></div>
                        <div>Attack: <span id="details-stats-atk">${atk}</span></div>
                        <div>Defense: <span id="details-stats-def">${def}</span></div>
                    </div>`;

                    
                    if(shouldAddToRecent){
                        let recentList = document.querySelector("#recent-list");
                        // <div class="recent-list-item">
                        //     <img src="https://static.pokemonpets.com/images/monsters-images-800-800/147-Dratini.webp" alt="Evolution version image" />
                        //     <div>Dratini</div>
                        // </div>
                        let recentListItem = document.createElement("div");
                        recentListItem.classList.add("recent-list-item");
    
                        let recentListImg = document.createElement("img");
                        recentListImg.src = data.sprites.front_default;
                        recentListImg.alt = "Evolution version image";
    
                        let nameDiv = document.createElement("div");
                        nameDiv.textContent = data.name;
    
                        nameDiv.addEventListener("click", (event)=>{
                            fetchPokemonDetails(event.target.textContent, false);
                        });
    
                        recentListItem.append(recentListImg, nameDiv);
    
                        recentList.append(recentListItem);
                    }

                // let currentPokemonEl = document.querySelector("#current-pokemon");

                // let img = document.createElement("img");
                // img.src = data.sprites["front_default"];
                
                // currentPokemonEl.append(img);
            });
    } else {
        errMessage.textContent = "Please choose a Pokemon!";
    }
}

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
        fetchPokemonDetails(selectedPokemon, true);

//         // console.log(selectedPokemon);
    });

let addToTeamButton = document.querySelector("#add-to-team button");

addToTeamButton.addEventListener("click", ()=>{
    let currentPokemonEl = document.querySelector("#details-name");
    let currentPokemonImg = document.querySelector("#details-img-container img");

    if(!currentPokemonEl || !currentPokemonImg){
        return;
    }

    let team = document.querySelectorAll("#team-list li");

    for(let member of team){
        if(member.textContent === currentPokemonEl.textContent){
            return;
        }
    }


    let currentPokemonName = currentPokemonEl.textContent;

    let placeholder = document.querySelector("#team-list-placeholder");
    if(placeholder){
        placeholder.remove();
    }

    let li = document.createElement("li");
    
    let img = document.createElement("img");
    img.alt = "Pokémon Team Thumbnail";
    img.src = currentPokemonImg.src;

    let span = document.createElement("span");
    span.textContent = currentPokemonName;

    li.append(img, span);

    let ul = document.querySelector("#team-list");

    ul.append(li);


    let teamHp = document.querySelector("#team-stats-hp");
    let teamAtk = document.querySelector("#team-stats-atk");
    let teamDef = document.querySelector("#team-stats-def");

    let detailsHp = document.querySelector("#details-stats-hp");
    let detailsAtk = document.querySelector("#details-stats-atk");
    let detailsDef = document.querySelector("#details-stats-def");

    teamHp.textContent = Number(teamHp.textContent) + Number(detailsHp.textContent);
    teamAtk.textContent = Number(teamAtk.textContent) + Number(detailsAtk.textContent);
    teamDef.textContent = Number(teamDef.textContent) + Number(detailsDef.textContent);

})

let clearTeamButton = document.querySelector("#clear-team button");

// An event listener that clears stats of team
clearTeamButton.addEventListener("click", ()=>{
    let teamHp = document.querySelector("#team-stats-hp");
    let teamAtk = document.querySelector("#team-stats-atk");
    let teamDef = document.querySelector("#team-stats-def");
    teamHp.textContent = 0;
    teamAtk.textContent = 0;
    teamDef.textContent = 0;
    let team = document.querySelectorAll("#team-list li");

    for(let member of team){
        member.remove();
    }
});
