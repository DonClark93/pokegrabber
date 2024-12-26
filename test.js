


async function getPokemon(){
    let response = await fetch("https://pokeapi.co/api/v2/pokemon/2")
    let tempPoke = await response.json()
    finalPoke = {
        "name":tempPoke.name,
        "pokeNumber": tempPoke.order,
        "types": tempPoke.types,
        "height": tempPoke.height,
        "weight": tempPoke.weight,
        "abilities": tempPoke.abilities,
        "heldItems": tempPoke.held_items,
        "baseExp": tempPoke.base_experience,
        //"moves": tempPoke.moves[1]
        "stats": tempPoke.stats
    }
    //final2 = JSON.stringify(final)
    console.log(tempPoke)
}


getPokemon()