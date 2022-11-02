const { Client, Message, MessageButton, MessageActionRow, MessageEmbed, Interaction, MessageSelectMenu } = require('discord.js');
const config = require('../config');

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {String[]} args 
 */

module.exports.exec = (client, message, args) => {
    if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply({ content: `Sem permissão.` })

    message.channel.send({
        embeds: [
            new MessageEmbed()
            .setColor("#2F3136")
            .setColor(16711680)
            .setThumbnail('https://media.discordapp.net/attachments/894619714435821578/1030243003383685140/logo-gif.gif')
            .setTitle(`LINKS 💻`)
            .setDescription(`
                            Oiie pessoal, Pixelzin informa! Todas nossas redes sociais estão disponiveis abaixo!\n
                            📌 **Discord**\nhttps://discord.gg/8JTNrXFD\n
                            📌 **Instagram**\nhttps://www.instagram.com/cidade.pixel\n
                            📌 **TikTok**\nhttps://www.tiktok.com/@cidadepixel\n
                                
            `)
            .setFooter({text:`Cidade™ Pixel ©️ Todos os direitos reservados.`, iconURL: 'https://media.discordapp.net/attachments/894619714435821578/1030243003383685140/logo-gif.gif'})
    ]
})    

}

module.exports.config = {
    name: "social",
    aliases: ["social"]
}
