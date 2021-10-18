function fetchPokemonDetails(pokemonName, shouldAddToRecent){

    let errMessage = document.querySelector("#error-message");
    if( pokemonName !== "default" ){
        errMessage.textContent = "";
        fetch("https://pokeapi.co/api/v2/pokemon/" + pokemonName)
            .then((res)=>res.json())
            .then((data)=>{

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
                        <div>Weight: <span id="details-weight">${Math.round(Number(data.weight)/4.536)}</span> lbs</div>
                        <div>Height: <span id="details-height">${Math.round(Number(data.height)/3.048)}</span> feet</div>
                    </div>
                    <div id="details-sub-text">
                        <h3>Base Attributes</h3>
                        <div>Health Points: <span id="details-stats-hp">${hp}</span></div>
                        <div>Attack: <span id="details-stats-atk">${atk}</span></div>
                        <div>Defense: <span id="details-stats-def">${def}</span></div>
                    </div>`;

                    
                    if(shouldAddToRecent){
                        // Check if pokèmon already exists
                        let pokemonInList = document.querySelectorAll("#recent-list div");
                        for(let pokemon of pokemonInList){
                            if(pokemon.textContent === data.name){
                                return;
                            };
                        }

                        let recentList = document.querySelector("#recent-list");
                        let recentListItem = document.createElement("div");
                        recentListItem.classList.add("recent-list-item");
    
                        let recentListImg = document.createElement("img");
                        recentListImg.src = data.sprites.front_default;
                        recentListImg.alt = "Evolution version image";

                        let nameDiv = document.createElement("div");
                        nameDiv.textContent = data.name;

                        recentListItem.addEventListener("click", function(event){
                            let pokemonName = event.target.textContent;
                            if(!event.target.textContent){
                                pokemonName = event.target.parentElement.textContent;
                            }
                            fetchPokemonDetails(pokemonName, false);
                        });
    
                        recentListItem.append(recentListImg, nameDiv);
    
                        recentList.append(recentListItem);
                    }

                    fetch(data.species.url)
                        .then((res)=>res.json())
                        .then((speciesData)=>{
                            fetch(speciesData.evolution_chain.url)
                                .then((res)=>res.json())
                                .then((evolutionData)=>{
                                    let { chain } = evolutionData;
                                    let versionList = document.querySelector("#versions-list");
                                    while (versionList.firstChild) {
                                        versionList.removeChild(versionList.firstChild);
                                    }
                                    function getEvo(evoChain){
                                        fetch("https://pokeapi.co/api/v2/pokemon/" + evoChain.species.name)
                                            .then(res=>res.json())
                                            .then(data=>{
                                                let div = document.createElement("div");
                                                div.className = "versions-list-item";
                                                if(pokemonName === evoChain.species.name){
                                                    div.style.backgroundColor = "lightgray";
                                                }        
                                                div.innerHTML = (
                                                    `<img src=${data.sprites.front_default} alt="Evolution version image" />
                                                    <div>${evoChain.species.name}</div>`
                                                );
                                                versionList.append(div);
                                                if(evoChain.evolves_to.length < 1){
                                                    return;
                                                }
                                                for(let i=0;i<evoChain.evolves_to.length;i++){
                                                    getEvo(evoChain.evolves_to[i]);
                                                }
                                            }).catch(err=>console.log(err));
                                    }
                                    getEvo(chain);
                                })
                                .catch(err=>console.log(err));
                        })
                        .catch(err=>console.log(err));
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
        fetchPokemonDetails(selectedPokemon, true);
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
