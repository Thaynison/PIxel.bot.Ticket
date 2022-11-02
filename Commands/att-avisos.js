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
            new MessageEmbed().setColor("#2F3136")
            .setColor(16711680)
            .setThumbnail('https://media.discordapp.net/attachments/894619714435821578/1030243003383685140/logo-gif.gif')
            .setTitle(`ATUALIZAÇÃO 🎉`)
            .setDescription(`
                            Oiie pessoal, Pixelzin trazendo mais uma **ATUALIZAÇÃO** a vocês! SE LIGA!\n
                            📌 Sistema de empregos levais adicionados;\n📌 Sistema compra de empresas adicionado;\n📌 Sistema de tuning/nitro adicionado.
                                
            `)
            .addField(`Data:`, `02/11/2022`, false)
            .setFooter({text:`Cidade™ Pixel ©️ Todos os direitos reservados.`, iconURL: 'https://media.discordapp.net/attachments/894619714435821578/1030243003383685140/logo-gif.gif'})
    ]
})    

}

module.exports.config = {
    name: "att",
    aliases: ["att"]
}
