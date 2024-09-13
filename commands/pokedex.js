const Discord = require("discord.js")
module.exports = {
    data: new Discord.SlashCommandBuilder()
    .setName("pokedex")
    .setDescription("Recherche un Pokémon")
    .addSubcommand(
        new Discord.SlashCommandSubcommandBuilder()
        .setName("pokemon")
        .setDescription("Recherche un Pokemon")
            .addStringOption(
                new Discord.SlashCommandStringOption()
                .setName("pokemon")
                .setDescription("Le Pokémon à chercher")
                .setRequired(true)
            )
    )
}