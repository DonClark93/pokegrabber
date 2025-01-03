import { Argument, Command } from 'commander';
import * as fs from 'node:fs';

let finalListCSV = [];
let finalListJSON = {};
const program = new Command();
program
    .name("pokegrabber")
    .description("A Utility for grabbing Pokemon details and converting to other file formats")
    .version("0.0.1")
    .option('-d, --debug', 'Output extra debugging information')
    .option('-o, --only', "Only return information of Pokemon Specified")
    .option('-f, --file <string>', "Type of file to export to")
    .requiredOption('-p, --poke <number>', 'Get the information for all Pokemon up to provided number')
program.parse();

const options = program.opts();

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

function breakDownHeldItems(pokehelditems){
    let tempString = "";
    for(const x of pokehelditems){
        tempString += x+",";
    }
    return "none";
}

function breakDownStats(pokestats){
    let tempString = "";
    for(const x of pokestats){
        tempString += x.base_stat + ",";
    }
    return tempString;
}

function breakDownEggGroup(pokeegg){
    let tempString = "";
    for(const x of pokeegg){
        tempString += x.name + ",";
    }
    return tempString;
}

function convertToFile(file, tempPokemon){

    if(file == "csv"){
        
        return tempPokemon.details.name + "," + 
            breakDownTypes(tempPokemon.details.types) + 
            tempPokemon.details.height + "," + 
            tempPokemon.details.weight + "," + 
            breakDownAbilities(tempPokemon.details.abilities) + 
            tempPokemon.details.species.name + "," + 
            breakDownHeldItems(tempPokemon.details.heldItems) + "," + 
            tempPokemon.details.baseExp + "," + 
            breakDownStats(tempPokemon.details.stats) + 
            breakDownEggGroup(tempPokemon.details.eggGroups) + 
            /*tempPokemon.details.evolvesFromSpecies.name*/"test" + "," + 
            tempPokemon.details.generation.name + "," + 
            tempPokemon.details.isBaby + "," + 
            tempPokemon.details.isLegendary + "," + 
            tempPokemon.details.isMythical;

    }else if(file == "json"){
        return {
            id: tempPokemon.pokeNumber,
            data : {
                "name": tempPokemon.details.name,
                "types": breakDownTypes(tempPokemon.details.types),
                "height": tempPokemon.details.height ,
                "weight": tempPokemon.details.weight ,
                "abilities": breakDownAbilities(tempPokemon.details.abilities) ,
                "species": tempPokemon.details.species.name,
                "heldItems": breakDownHeldItems(tempPokemon.details.heldItems),
                "baseExp": tempPokemon.details.baseExp ,
                "stats": breakDownStats(tempPokemon.details.stats) ,
                "eggGroups": breakDownEggGroup(tempPokemon.details.eggGroups)  ,
                "evolvesFromSpecies": "test",
                "generation": tempPokemon.details.generation.name ,
                "isBaby": tempPokemon.details.isBaby,
                "isLegendary": tempPokemon.details.isLegendary ,
                "isMythical": tempPokemon.details.isMythical,
            }
            
        }   
    }

}

if (options.debug){ 
    console.log(options)
};

//options

if (options.only == true){

    if(options.file == "csv"){
        finalListCSV.push( convertToFile(options.file, await getPokemon(options.poke)));
    }
    if(options.file == "json"){
        let temppoke = convertToFile( options.file , await getPokemon(options.poke))
        finalListJSON = { ...finalListJSON, [temppoke.data.name]: temppoke};
    }

}else{

    if(options.file == "csv"){
        for(let i = 1; i <= options.poke; i++){
            finalListCSV.push( convertToFile(options.file, await getPokemon(i)));
        }
    }
    if(options.file == "json"){
        for(let i = 1; i <= options.poke; i++){
            let temppoke = convertToFile( options.file , await getPokemon(i))
            finalListJSON = { ...finalListJSON, [temppoke.data.name]: temppoke};
        }
    }
}

//writing to file

if(options.file == "csv"){
    
    for( let i = 0; i < (finalListCSV.length); i++ ){
        fs.appendFileSync('pokedex.csv', finalListCSV[i] +'\n', (err) => {
            if (err) throw err;
        })
    }
}

if(options.file == "json"){

        fs.appendFileSync('pokedex.json', JSON.stringify(finalListJSON), (err) => {
            if (err) throw err;
        })
}




console.log(finalListJSON);