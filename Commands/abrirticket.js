const { Client, Message, MessageButton, MessageActionRow, MessageEmbed, Interaction, MessageSelectMenu } = require('discord.js');
const config = require('../config');

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {String[]} args 
 */

module.exports.exec = (client, message, args) => {
    if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply({ content: `Sem permissão.` })

    /*let _opts = new MessageActionRow().addComponents(
        new MessageSelectMenu()
        .setCustomId('values-setupticket')
        .setPlaceholder(`Selecione o atendimento.`)
        .addOptions(
            { value: 0, name: "compra-servico", label: "Comprar um Serviço.", description: "Selecione para comprar um serviço de nossa Hospedagem.", emoji: "🛒" },
            { value: 1, name: "ajuda-atendimento", label: "Tire Dúvidas com gente.", description: "Selecione para você tirar algumas dúvidas sobre nois.", emoji: "🖐️" },
            { value: 2, name: "denuncia", label: "denuncia.", description: "Selecione para fazer o forumalario para a nossa equipe.", emoji: "👮‍♂️" }
        )
    )*/

    let _opts = new MessageActionRow().addComponents(
        new MessageButton()
        .setCustomId("compra-servico")
        .setEmoji("🛒")
        .setLabel("Doações.")
        .setStyle("PRIMARY"),
        
        new MessageButton()
        .setCustomId("bugs-report")
        .setEmoji("💣")
        .setLabel("Bugs.")
        .setStyle("PRIMARY"),

        new MessageButton()
        .setCustomId("ajuda-atendimento")
        .setEmoji("👨🏻‍💼")
        .setLabel("Suporte")
        .setStyle("PRIMARY"),

        new MessageButton()
        .setCustomId("denuncia-staff")
        .setEmoji("🕵🏽")
        .setLabel("Denúncia Staff.")
        .setStyle("PRIMARY"),

        new MessageButton()
        .setCustomId("denuncia-players")
        .setEmoji("👮‍♂️")
        .setLabel("Denúncia Players.")
        .setStyle("PRIMARY")


    )

    message.channel.send({
        components:[_opts],
        embeds: [
            new MessageEmbed()
            .setColor("#2F3136")
            .setThumbnail('https://media.discordapp.net/attachments/894619714435821578/1030243003383685140/logo-gif.gif')
            .setTitle(`🪧 Menu de Seleção para o Atendimento.`)
            .setDescription(`📢 Para iniciar o atendimento selecione qual atendimento você queira, após a iniciação do atendimento a nossa equipe tem até 24h para responder você então sempre fique atendo pois a gente não irar menciona-lô ou algo assim.`)
            .addField(`💁🏽 Atendente(s)`, `<@&678775796600406027>`, true)
            .addField(`💁🏽 Atendente(s) 24hr`, `<@&678775796600406027>`, true)
            .setFooter({text:`Cidade™ Pixel ©️ Todos os direitos reservados.`, iconURL: 'https://media.discordapp.net/attachments/894619714435821578/1030243003383685140/logo-gif.gif'})
        ]
    })    

}

module.exports.config = {
    name: "abrirticket",
    aliases: ["a-t"]
}