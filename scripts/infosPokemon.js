//Ce fichier permet d'afficher les informations générales sur le Pokémon
const Discord = require("discord.js"),
name_fr = require("../data/fr.json"),
name_fr_unedited = require("../data/fr_original.json"),
name_en = require("../data/en.json"),
stats = require("../data/stats.json"),
removeAccents = require("./removeAccents.js"),
colorCodes = require("../data/colorCodes.json"), //Couleurs de l'API traduites pour discord.js si elles ne sont pas reconnues
createPokemonImage = require("./createPokemonImage.js"), //Modifie l'image pour rajouter le type
capitalizeFirstLetter = require("./capitalizeFirstLetter.js")

module.exports = async function infosPokemon(interaction, pokemon){
let button = new Discord.ActionRowBuilder()
    .addComponents(
        new Discord.ButtonBuilder()
        .setCustomId(`statsView|${pokemon}`)
        .setLabel("Vue statistiques")
        .setStyle(Discord.ButtonStyle.Secondary)
        .setEmoji("📊")
    )
    let embed = new Discord.EmbedBuilder()
    .setTitle(`${name_fr_unedited[[name_fr.indexOf(pokemon)]]} - #${[name_fr.indexOf(pokemon)+1]}`)
    .setDescription("## Fiche descriptive\n\n")
    let infos_poke = await (await fetch(`https://pokeapi.co/api/v2/pokemon/${name_en[name_fr.indexOf(pokemon)]}/`)).json() //Utilisation de "await" pour éviter des .then() imbriqués
    let infos_species = await (await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name_en[name_fr.indexOf(pokemon)]}/`)).json() //Utilisation de "await" pour éviter des .then() imbriqués
      //2 "await" car .json() est aussi une promise
    let types = []
    interaction.deferReply()
    embed.setDescription(embed.data.description + `**${name_fr_unedited[[name_fr.indexOf(pokemon)]]}**, le ${infos_species.genera.find(gen => gen.language.name == "fr").genus}. ${infos_species.flavor_text_entries.find(flavor => flavor.language.name == "fr").flavor_text.split("\n").join(" ")}\n\n**Type(s)** : `)
    let y = 1 //Permet d'éviter de mettre un trait d'union à la fin des types
    //Traduction du talent et mise dans un tableau
    let abilities = []
    infos_poke.abilities.forEach(async (ability)=>{
        abilities.push((await (await fetch(ability.ability.url)).json()).names[3].name+((ability.ability.url != infos_poke.abilities.at(-1).ability.url) ? " / " : ""))
    })
    let color = (await (await fetch(infos_species.color.url)).json()).names[3].name
    let habitat
    if(infos_species.habitat){
    habitat = (await (await fetch(infos_species.habitat.url)).json()).names[0].name
    }
    infos_poke.types.forEach(async (type)=>{
        let type_name_fr = (await (await fetch(`${type.type.url}`)).json()).names[3].name
        types.push(`./sprites/types/${removeAccents(type_name_fr.toLowerCase())}.png`)
        embed.setDescription(embed.data.description + ` ${type_name_fr} ${y < infos_poke.types.length ? "-" : ""}`)
        y++
    })
    setTimeout(()=>{
            interaction.fetchReply().then(()=>{
                createPokemonImage(infos_poke.sprites.other["official-artwork"].front_default, types, "./sprites/temp/temp.png").then(async ()=>{
                    let embed_color = capitalizeFirstLetter(infos_species.color.name)
                    if(!Discord.Colors[embed_color]) embed_color = colorCodes[embed_color]
                    if(!embed_color) embed_color = "White"
                    const attachment = new Discord.AttachmentBuilder("./sprites/temp/temp.png");
                    embed.setThumbnail("attachment://temp.png")
                embed.setDescription(embed.data.description + `\n\n**Talent(s) :** ${abilities.join("")}\n\n **Couleur** : ${color}\n\n **Taux de capture** : ${infos_species.capture_rate}\n\n **Habitat** : ${habitat ? capitalizeFirstLetter(habitat) : "Aucun"}`)
                embed.setColor(embed_color)
                interaction.editReply(
        {embeds:[embed], files:[attachment], components:[button]})
    },200)
})
})
}