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
            .setTitle(`CONNECT 🔰`)
            .setDescription(`
                            Oiie pessoal, Pixelzin informa! Cidade **ONLINE**!\n
                            IP: connect cidadepixel.com.br\n
                            Promoção de Inauguração rolando\n🎉 25% Em toda nossa loja 
                                
            `)
            .setFooter({text:`Cidade™ Pixel ©️ Todos os direitos reservados.`, iconURL: 'https://media.discordapp.net/attachments/894619714435821578/1030243003383685140/logo-gif.gif'})
    ]
})    

}

module.exports.config = {
    name: "rr",
    aliases: ["rr"]
}
