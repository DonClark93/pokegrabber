


async function getPokemon(){
    let response = await fetch("https://pokeapi.co/api/v2/pokemon/1")
    let clean = await response.json()
    final = {
        "name":clean.name
    }
    console.log(final)
}


getPokemon()