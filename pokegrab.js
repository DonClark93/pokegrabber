
import { Argument, Command } from 'commander';
const program = new Command();

program
    .name("pokegrabber")
    .description("A Utility for grabbing pokemon details and converting to other file formats")
    .version("0.0.1")
    .option('-d, --debug', 'output extra debugging')
    .option('-o, --only', "only the number specified")
    .requiredOption('-p, --poke <number>')

    
program.parse();

const options = program.opts();
if (options.debug) console.log(options);

console.log(options)

async function getPokemon(end){
    let tempArray =[];
    for(let i = 1; i <= end; i++){
        let pokeResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`)
        let tempPoke = await pokeResponse.json()
        let speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${i}`)
        let tempSpecies = await speciesResponse.json()
        //console.log(tempSpecies)
        let finalPoke = {
            "name":tempPoke.name,
            "pokeNumber": tempPoke.id,
            "types": tempPoke.types,
            "height": tempPoke.height,
            "weight": tempPoke.weight,
            "abilities": tempPoke.abilities,
            "species": tempPoke.species,
            "heldItems": tempPoke.held_items,
            "baseExp": tempPoke.base_experience,
            "stats": tempPoke.stats,
            "eggGroups": tempSpecies.egg_groups,
            "evolvesFromSpecies": tempSpecies.evolves_from_species,
            "generation": tempSpecies.generation,
            "isBaby": tempSpecies.is_baby,
            "isLegendary": tempSpecies.is_legendary,
            "isMythical": tempSpecies.is_mythical,
        }
        tempArray.push(finalPoke)
        
    }
        //final2 = JSON.stringify(final)
        console.log(tempArray)
}
getPokemon(options.poke);