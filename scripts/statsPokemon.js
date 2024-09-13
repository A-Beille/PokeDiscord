//Ce fichier permet d'afficher le panel des statistiques
const Discord = require("discord.js"),
name_fr = require("../data/fr.json"),
name_fr_unedited = require("../data/fr_original.json"),
name_en = require("../data/en.json"),
stats = require("../data/stats.json"), //Traduction des statistiques
removeAccents = require("./removeAccents.js"),
createPokemonImage = require("./createPokemonImage.js") //Modifie l'image pour rajouter le type

module.exports = function statsPokemon(interaction, pokemon){
    interaction.deferReply()
    let embed = new Discord.EmbedBuilder()
    .setTitle(`${name_fr_unedited[[name_fr.indexOf(pokemon)]]} - #${[name_fr.indexOf(pokemon)+1]}`)
    fetch(`https://pokeapi.co/api/v2/pokemon/${name_en[name_fr.indexOf(pokemon)]}/`)
    .then(res=>{
        res.json().then((infos)=>{
            let types = []
            infos.types.forEach(async (type)=>{
                let type_name_fr = (await (await fetch(`${type.type.url}`)).json()).names[3].name
                types.push(`./sprites/types/${removeAccents(type_name_fr.toLowerCase())}.png`)
            })
            let i = 0
            let ref
            let infos_clone = structuredClone(infos)
            let max_stat = infos_clone.stats.sort(function(a,b){return b.base_stat - a.base_stat})[0].base_stat
            ref = Math.round(max_stat*1.3)
            infos.stats.forEach((stat)=>{
            let squares = ""
                for(let x = 0; x <= 10 ; x++ ){
                    if(x <= Math.floor((stat.base_stat/ref)*10)){
                        if(x > 0) squares+="<:square_bl:1279436090037637180>"
                        else squares+="<:square_bl_radius:1279436088406179971>"
                    }
                    else if(x < 10) squares+="<:square_gr:1279127902482464799>"
                        else squares+="<:square_gr_radius:1279436186833780798>"
                }
                embed.setDescription(`${(embed.data.description) ? embed.data.description : ""}${[stats[i]]} (${stat.base_stat})\n${squares}\n\n`)
                i++
            })
            setTimeout(()=>{
                let button = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                    .setLabel("Vue informations")
                    .setEmoji("ℹ️")
                    .setCustomId(`infosView|${pokemon}`)
                    .setStyle(Discord.ButtonStyle.Secondary)
                )
            createPokemonImage(infos.sprites.other["official-artwork"].front_default, types, "./sprites/temp/temp.png").then(()=>{
                const attachment = new Discord.AttachmentBuilder("./sprites/temp/temp.png");
                embed.setThumbnail("attachment://temp.png")
                interaction.fetchReply().then(()=>{
                interaction.editReply({
                embeds:[embed],
                files:[attachment],
                components:[button]
            })
        })
        })
    },200)
        })
    })
}