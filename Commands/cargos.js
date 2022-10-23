const { Client, Message, MessageButton, MessageActionRow, MessageEmbed } = require('discord.js');
const config = require('../config');

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {String[]} args 
 */

module.exports.exec = (client, message, args) => {
    if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply({ content: `Sem permissão.` })

    let _btns = new MessageActionRow().addComponents(
        new MessageButton()
            .setEmoji("🔔")
            .setCustomId("notify_adverts")
            .setLabel("Ping Anúncios")
            .setStyle("PRIMARY"),
        new MessageButton()
            .setEmoji("🔄")
            .setCustomId("notify_updates")
            .setLabel("Ping Atualizações")
            .setStyle("PRIMARY"),
        new MessageButton()
            .setEmoji("🤝")
            .setCustomId("notify_parthers")
            .setLabel("Ping Parcerias")
            .setStyle("PRIMARY")
    )
	let _btns_2 = new MessageActionRow().addComponents(
        new MessageButton()
            .setEmoji("1000506523853787277")
            .setCustomId("add_all")
            .setLabel("Adicione todos os Ping's")
            .setStyle("SUCCESS"),
        new MessageButton()
            .setEmoji("⚠️")
            .setCustomId("remove_all")
            .setLabel("Remova todos os Ping's")
            .setStyle("DANGER")
    )

    message.channel.send({
        components:[_btns,_btns_2],
        embeds: [
            new MessageEmbed().setColor("#2F3136")
            .setThumbnail('https://media.discordapp.net/attachments/894619714435821578/1030243003383685140/logo-gif.gif')
            .setTitle(`**Cargos de Notificações**`)
            .setDescription(`➥ <@&1033538418346573834> - Para receber todos os anúncios de nossa cidade\n
                             ➥ <@&1033538505533554749> - Para receber qualquer tipo de atualizações de nossa loja\n
                             ➥ <@&1033538588509474906> - Para receber todos os ping's de vossos parceiros de nossa loja`)
            .setFooter({text:`Cidade™ Pixel ©️ Todos os direitos reservados.`, iconURL: 'https://media.discordapp.net/attachments/894619714435821578/1030243003383685140/logo-gif.gif'})
    ]
})    
}

module.exports.config = {
    name: "cargos",
    aliases: ["roles"]
}