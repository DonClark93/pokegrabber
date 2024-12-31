import { Argument, Command } from 'commander';
import * as fs from 'node:fs';

let finalList = [];
const program = new Command();
program
    .name("pokegrabber")
    .description("A Utility for grabbing pokemon details and converting to other file formats")
    .version("0.0.1")
    .option('-d, --debug', 'output extra debugging')
    .option('-o, --only', "only the number specified")
    .option('-f, --file <string>', "type of file to export")
    .requiredOption('-p, --poke <number>', 'get the pokemon up to provided number')
program.parse();

const options = program.opts();

if (options.debug) console.log(options);

async function getPokemon(i){

        let pokeResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`)
        let tempPoke = await pokeResponse.json()
        let speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${i}`)
        let tempSpecies = await speciesResponse.json()
        let finalPoke = {
            "pokeNumber": tempPoke.id,
            "details":{
                "name":tempPoke.name,
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
        }   
        return finalPoke;     
}

function breakDownTypes(poketypes){
    let tempString = "";
    for(const x of poketypes){
        tempString += x.type.name;
        if(x.type.name){
            tempString += ",";
        }
    }
    return tempString;
}

function breakDownAbilities(pokeabilities){
    let tempString = "";
    for(const x of pokeabilities){
        tempString += x.ability.name;
        if(x.ability){
            tempString += ",";
        }
    }
    return tempString;
}

function breakDownSpecies(pokespecies){
    let tempString = "";
    console.log(pokespecies)
    for(const x of pokespecies){
        tempString += x;
        if(x.ability){
            tempString += ",";
        }
    }
    console.log(tempString);
    return tempString;
}

function breakDownHeldItems(pokehelditems){
    let tempString = "";
    console.log(pokehelditems)
    for(const x of pokehelditems){
        tempString += x+",";
        
    }
    console.log(tempString);
    return tempString;
}

function breakDownStats(pokestats){
    let tempString = "";
    console.log(pokestats)
    for(const x of pokestats){
        tempString += x + ",";
        
    }
    console.log(tempString);
    return tempString;
}

function convertToCSV(tempPokemon){
    console.log(tempPokemon)
    return tempPokemon.details.name + "," + 
            breakDownTypes(tempPokemon.details.types) + 
            tempPokemon.details.height + "," + 
            tempPokemon.details.weight + "," + 
            breakDownAbilities(tempPokemon.details.abilities) + 
            tempPokemon.details.species.name + "," + 
            tempPokemon.details.held_items + "," + 
            tempPokemon.details.base_experience + "," + 
            tempPokemon.details.stats + "," + 
            tempPokemon.details.egg_groups + "," + 
            tempPokemon.details.evolves_from_species + "," + 
            tempPokemon.details.generation + "," + 
            tempPokemon.details.is_baby + "," + 
            tempPokemon.details.is_legendary + "," + 
            tempPokemon.details.is_mythical;
}

if (options.only == true){

    finalList.push( await getPokemon(options.poke));

    if(options.file == "csv"){
        let file = JSON.stringify(convertToCSV(finalList[0]))

        fs.appendFile('pokedex.csv', file, (err) => {
            console.log("ddd")
            if (err) throw err;
            console.log(err)
        })
    
    }

}else{

    for(let i = 1; i <= options.poke; i++){
        finalList.push(await getPokemon(i));
    }

    if(options.file == "csv"){
        
        fs.writeFile('pokedex.csv')
    
    }

}

console.log(finalList);