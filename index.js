const Discord = require("discord.js"),
config = require("./config.json"),
fs = require("fs"),
intents = [Discord.GatewayIntentBits.Guilds],
client = new Discord.Client({intents: intents}),
name_fr_unedited = require("./data/fr_original.json"), //Ces noms ne sont pas mis en minuscules sans accents
name_fr = require("./data/fr.json"), //Noms français
name_en = require("./data/en.json"), //Noms anglais (pour traduire et envoyer à l'API)
correct = require("./data/correct.json"), //Auto correction
removeAccents = require("./scripts/removeAccents.js"),
//Fichiers de commandes
infosPokemon = require("./scripts/infosPokemon.js"),
statsPokemon = require("./scripts/statsPokemon.js")
//Login
client.login(config.TOKEN)
client.commands = []
client.on("ready",()=>{
//Lecture des fichiers de commande
const commandsFolder = fs.readdirSync("./commands").filter(file => file.endsWith(".js"))
for(let file of commandsFolder){
    //Pour chaque fichier de "commands", le fichier est inscrit dans la collection client.commands
    let commandPath = `./commands/${file}`
    let command = require(commandPath)
    client.commands.push(command.data.toJSON())
}
let rest = new Discord.REST().setToken(config.TOKEN)
rest.put(
    Discord.Routes.applicationCommands(client.user.id),
    {body: client.commands}
)
console.log("Bot lancé !")
})
//Gère les commandes
client.on("interactionCreate",async (interaction)=>{
    if(interaction.isButton()){
        if(interaction.customId.startsWith("statsView")){
            statsPokemon(interaction, `${interaction.customId.split("|")[1]}`)
        }
        if(interaction.customId.startsWith("infosView")){
            infosPokemon(interaction, `${interaction.customId.split("|")[1]}`)
        }
    }
    if(interaction.isCommand()){
        if(interaction.commandName != "pokedex") return; //Comme la seule commande est "/pokedex", pourquoi se fatiguer
        let pokemon = removeAccents(interaction.options.getString("pokemon").toLowerCase())
        if(!name_fr.includes(pokemon)){
            let addstring = "" //Autocorrection
            if(correct[pokemon]) addstring = `\n\n**Tip : vouliez vous dire __${correct[pokemon]}__ ?**`
            if(name_en.includes(pokemon)) addstring = `\n\n**Tip : vous semblez avoir inscrit un nom anglais. Vouliez vous dire __${name_fr_unedited[name_en.indexOf(pokemon)]}__ ?**`
            return interaction.reply({
            embeds:[new Discord.EmbedBuilder()
                .setTitle("Erreur")
                .setDescription(`Ce Pokémon n'existe pas ! Vérifiez l'orthographe et réessayez.${addstring}`)
                .setColor(Discord.Colors.Red)
            ]
        })
    }
    infosPokemon(interaction, pokemon)
}
})