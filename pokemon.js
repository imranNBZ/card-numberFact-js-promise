document.getElementById("generate-btn").addEventListener("click", fetchAndDisplayPokemon);

async function getAllPokemon() {
    try {
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=100000");
        return response.data.results;
    } catch (error) {
        console.error("Error fetching Pokémon list:", error);
        return [];
    }
}

async function getPokemonDetails(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching Pokémon details:", error);
        return null;
    }
}

async function getSpeciesDescription(speciesUrl) {
    try {
        const response = await axios.get(speciesUrl);
        const entry = response.data.flavor_text_entries.find(entry => entry.language.name === "en");
        return entry ? entry.flavor_text.replace(/\n|\f/g, ' ') : "No description available.";
    } catch (error) {
        console.error("Error fetching species description:", error);
        return "No description available.";
    }
}

async function fetchAndDisplayPokemon() {
    document.getElementById("pokemon-display").innerHTML = "Loading...";
    const allPokemon = await getAllPokemon();
    if (allPokemon.length === 0) {
        document.getElementById("pokemon-display").innerHTML = "Error fetching Pokémon. Please try again.";
        return;
    }

    const randomPokemon = [];
    while (randomPokemon.length < 3) {
        const randIndex = Math.floor(Math.random() * allPokemon.length);
        if (!randomPokemon.includes(allPokemon[randIndex])) {
            randomPokemon.push(allPokemon[randIndex]);
        }
    }

    const pokemonData = await Promise.all(
        randomPokemon.map(async (pokemon) => {
            const details = await getPokemonDetails(pokemon.url);
            if (!details) return null;
            const speciesDescription = await getSpeciesDescription(details.species.url);
            return {
                name: pokemon.name,
                image: details.sprites.front_default,
                description: speciesDescription
            };
        })
    );

    document.getElementById("pokemon-display").innerHTML = pokemonData.filter(Boolean).map(pokemon => `
        <div class="pokemon-card">
            <h3>${pokemon.name}</h3>
            <img src="${pokemon.image}" alt="${pokemon.name}">
            <p>${pokemon.description}</p>
        </div>
    `).join('');
}
