const { Client, Collection, MessageEmbed, MessageActionRow, MessageButton }  = require('discord.js');
const { readdir }                           = require('fs');
const { token, intents, footer, prefix, permissionOverwrites }    = require('./config');
const colors                                = require('./API/colors.json');
const client                                = new Client({ intents })
const moment                                = require('moment');
const mongoose                              = require('mongoose');

client.commands = new Collection();
client.aliases = new Collection();
moment.locale('pt-BR')

readdir('./Commands', async (err, files) => {
    if(err) return console.log(err.message, err.name)
    const jsfiles = await files.filter(f => f.split(".").pop() == "js");
    if(jsfiles <= 0) return console.log('[X]: NÃ£o encontrei nenhum arquivo na pasta comandos.')
    jsfiles.forEach((f, i) => {
        let pull = require(`./Commands/${f}`);
        client.commands.set(pull.config.name, pull)
        pull.config.aliases.forEach(alias => {
            client.aliases.set(alias, pull.config.name)
        })
    })
});

client.on("ready", async() => {
    console.log(`ð: Bot online com sucesso "${client.user.tag}".`);

    client.user.setActivity({name: `Visual Studio Code ð`, type: "PLAYING"});
});

client.on("messageCreate", async (message) => {

    if(message.author.bot) return;
    if(!message.content.startsWith(prefix)) return;
    if(message.channel.type == "DM") return;

    let args    = await message.content.slice(prefix.length).trim().split(/ +/g);
    let command = await args.shift().toLowerCase();

    const commandRun = await client.commands.get(command) || client.commands.get(client.aliases.get(command));
    if (commandRun) {
        commandRun.exec(client, message, args)
    }

});

client.on("guildMemberAdd", (member) => {
	try {
		member.roles.add(require("./config.js").cargos.membro)
	} catch (e) {
		console.log(e);
	}
})

client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId.startsWith('notify_adverts')) {
            interaction.reply({ content: `Cargo adicionado com sucesso.`, ephemeral: true });
            interaction.member.roles.add(require("./config.js").cargos.notificacao.anuncios)
        }
        if (interaction.customId.startsWith('notify_updates')) {
            interaction.reply({ content: `Cargo adicionado com sucesso.`, ephemeral: true });
            interaction.member.roles.add(require("./config.js").cargos.notificacao.atualizacoes)
        }
        if (interaction.customId.startsWith('notify_parthers')) {
            interaction.reply({ content: `Cargo adicionado com sucesso.`, ephemeral: true });
            interaction.member.roles.add(require("./config.js").cargos.notificacao.parcerias)
        }
        if (interaction.customId.startsWith('add_all')) {
            interaction.reply({ content: `Todos os ping's foram adicionados em seu perfil.`, ephemeral: true });
            interaction.member.roles.add(require("./config.js").cargos.notificacao.anuncios)
            interaction.member.roles.add(require("./config.js").cargos.notificacao.atualizacoes)
            interaction.member.roles.add(require("./config.js").cargos.notificacao.parcerias)
        }
        if (interaction.customId.startsWith('remove_all')) {
            interaction.reply({ content: `Todos os ping's foram removidos do seu perfil.`, ephemeral: true });
            interaction.member.roles.add(require("./config.js").cargos.notificacao.anuncios)
            interaction.member.roles.add(require("./config.js").cargos.notificacao.atualizacoes)
            interaction.member.roles.add(require("./config.js").cargos.notificacao.parcerias)
        }
        // REPORTE DE DOAÃÃES - fundador
        if (interaction.customId.startsWith("compra-servico")) {
            const category = interaction.guild.channels.cache.find(c => c.topic === `Compra de ImplementaÃ§Ãµes => {${interaction.member.user.id}}`)
            if (category) return interaction.reply({ content: "VocÃª jÃ¡ tem um ticket aberto!", ephemeral: true });
            const canal = await interaction.guild.channels.create(`ð-${interaction.member.user.username}`, {
                parent: "848321633890336768", // Coloque o ID da Categoria de Tickets
                reason: `${interaction.user.tag} abriu um ticket!`,
                type: "GUILD_TEXT",
                topic: `Compra de ServiÃ§o => {${interaction.member.user.id}}`,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: ["VIEW_CHANNEL"]
                    },
                    {
                        id: interaction.user.id,
                        allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES", "ADD_REACTIONS"]
                    },
                    {
                        id: require("./config.js").cargos.staffs.fundador, //financeiro
                        allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES", "ADD_REACTIONS"]
                    }
                ]
            }).then((msg) => {
                interaction.reply({ content: "Ticket criado com sucesso.", ephemeral: true, })
                const _opts = new MessageActionRow().addComponents(
                    new MessageButton()
                    .setCustomId('button_close')
                    .setStyle('SECONDARY')
                    .setEmoji("ð")
                    .setLabel("Fechar").setDisabled(false),
                    new MessageButton()
                    .setCustomId("button_transcript")
                    .setEmoji("ðï¸").setLabel("Transcript")
                    .setStyle("SECONDARY").setDisabled(false)
                )
                msg.send({
                    content: `**Ticket aberto!** - <@&${require("./config.js").cargos.staffs.fundador}>`,
                    components: [_opts],
                    embeds: [
                        new MessageEmbed()
                        .setDescription(`
    â° <@${interaction.user.id}> Bem vindo ao seu ticket compra de implementaÃ§Ãµes!
    
    > *Por meio desse chat serÃ¡ feito o suporte por parte da equipe para lhe ajudar quanto a criaÃ§Ã£o deste ticket. Fique atento aos horÃ¡rios de atendimento.*`)
                        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true, }), })
                        .setThumbnail('https://media.discordapp.net/attachments/894619714435821578/1030243003383685140/logo-gif.gif')
                        .setColor('#2f3136')
                        .setFooter({text:`Cidadeâ¢ Pixel Â©ï¸ Todos os direitos reservados.`, iconURL: 'https://media.discordapp.net/attachments/894619714435821578/1030243003383685140/logo-gif.gif'})
                    ],
                });   
            }).catch((err) => {
                console.log(err)
                interaction.reply({ content: "NÃ£o foi possÃ­vel criar seu ticket, sinto muito.", ephemeral: true, })
            })
        }
        // REPORTE DE ATENDIMENTO - suporte
        if (interaction.customId.startsWith("ajuda-atendimento")) {
            const category = interaction.guild.channels.cache.find(c => c.topic === `Atendimento de Suporte => {${interaction.member.user.id}}`)
            if (category) return interaction.reply({ content: "VocÃª jÃ¡ tem um ticket aberto!", ephemeral: true });
            const canal = await interaction.guild.channels.create(`ð¨ð»âð¼-${interaction.member.user.username}`, {
                parent: "848321633890336768", // Coloque o ID da Categoria de Tickets
                reason: `${interaction.user.tag} abriu um ticket!`,
                type: "GUILD_TEXT",
                topic: `Atendimento de Suporte => {${interaction.member.user.id}}`,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: ["VIEW_CHANNEL"]
                    },
                    {
                        id: interaction.user.id,
                        allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES", "ADD_REACTIONS"]
                    },
                    {
                        id: require("./config.js").cargos.staffs.suporte,
                        allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES", "ADD_REACTIONS"]
                    }
                ]
            }).then((msg) => {
                interaction.reply({ content: "Ticket criado com sucesso.", ephemeral: true, })
                const _opts = new MessageActionRow().addComponents(
                    new MessageButton()
                    .setCustomId('button_close')
                    .setStyle('SECONDARY')
                    .setEmoji("ð")
                    .setLabel("Fechar").setDisabled(false),
                    new MessageButton()
                    .setCustomId("button_transcript")
                    .setEmoji("ðï¸").setLabel("Transcript")
                    .setStyle("SECONDARY").setDisabled(false)
                )
                msg.send({
                    content: `**Ticket aberto!** - <@&${require("./config.js").cargos.staffs.suporte}>`,
                    components: [_opts],
                    embeds: [
                        new MessageEmbed()
                        .setDescription(`
    â° <@${interaction.user.id}> Bem vindo ao seu ticket de suporte!
    
    > *Por meio desse chat serÃ¡ feito o suporte por parte da equipe para lhe ajudar quanto a criaÃ§Ã£o deste ticket. Fique atento aos horÃ¡rios de atendimento.*`)
                        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true, }), })
                        .setThumbnail('https://media.discordapp.net/attachments/894619714435821578/1030243003383685140/logo-gif.gif')
                        .setColor('#2f3136')
                        .setFooter({text:`Cidadeâ¢ Pixel Â©ï¸ Todos os direitos reservados.`, iconURL: 'https://media.discordapp.net/attachments/894619714435821578/1030243003383685140/logo-gif.gif'})
                    ],
                });   
            }).catch((err) => {
                console.log(err)
                interaction.reply({ content: "NÃ£o foi possÃ­vel criar seu ticket, sinto muito.", ephemeral: true, })
            })
        }
        // REPORTE DE DENUNCIA STAFF- manager
        if (interaction.customId.startsWith("denuncia-staff")) {
            const category = interaction.guild.channels.cache.find(c => c.topic === `Atendimento de DenÃºncia a Staff => {${interaction.member.user.id}}`)
            if (category) return interaction.reply({ content: "VocÃª jÃ¡ tem um ticket aberto!", ephemeral: true });
            const canal = await interaction.guild.channels.create(`ðµð½-${interaction.member.user.username}`, {
                parent: "848321633890336768", // Coloque o ID da Categoria de Tickets
                reason: `${interaction.user.tag} abriu um ticket!`,
                type: "GUILD_TEXT",
                topic: `Atendimento de Suporte => {${interaction.member.user.id}}`,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: ["VIEW_CHANNEL"]
                    },
                    {
                        id: interaction.user.id,
                        allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES", "ADD_REACTIONS"]
                    },
                    {
                        id: require("./config.js").cargos.staffs.manager,
                        allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES", "ADD_REACTIONS"]
                    }
                ]
            }).then((msg) => {
                interaction.reply({ content: "Ticket criado com sucesso.", ephemeral: true, })
                const _opts = new MessageActionRow().addComponents(
                    new MessageButton()
                    .setCustomId('button_close')
                    .setStyle('SECONDARY')
                    .setEmoji("ð")
                    .setLabel("Fechar").setDisabled(false),
                    new MessageButton()
                    .setCustomId("button_transcript")
                    .setEmoji("ðï¸").setLabel("Transcript")
                    .setStyle("SECONDARY").setDisabled(false)
                )
                msg.send({
                    content: `**Ticket aberto!** - <@&${require("./config.js").cargos.staffs.manager}>`,
                    components: [_opts],
                    embeds: [
                        new MessageEmbed()
                        .setDescription(`
    â° <@${interaction.user.id}> Bem vindo ao seu ticket de denÃºncia a staff !
    
    > *Por meio desse chat serÃ¡ feito o suporte por parte da equipe para lhe ajudar quanto a criaÃ§Ã£o deste ticket. Fique atento aos horÃ¡rios de atendimento.*`)
                        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true, }), })
                        .setThumbnail('https://media.discordapp.net/attachments/894619714435821578/1030243003383685140/logo-gif.gif')
                        .setColor('#2f3136')
                        .setFooter({text:`Cidadeâ¢ Pixel Â©ï¸ Todos os direitos reservados.`, iconURL: 'https://media.discordapp.net/attachments/894619714435821578/1030243003383685140/logo-gif.gif'})
                    ],
                });   
            }).catch((err) => {
                console.log(err)
                interaction.reply({ content: "NÃ£o foi possÃ­vel criar seu ticket, sinto muito.", ephemeral: true, })
            })
        }
        // REPORTE DE BUGS - developer
        if (interaction.customId.startsWith("bugs-report")) {
            const category = interaction.guild.channels.cache.find(c => c.topic === `Atendimento de DenÃºnicia Bugs => {${interaction.member.user.id}}`)
            if (category) return interaction.reply({ content: "VocÃª jÃ¡ tem um ticket aberto!", ephemeral: true });
            const canal = await interaction.guild.channels.create(`ð£-${interaction.member.user.username}`, {
                parent: "848321633890336768", // Coloque o ID da Categoria de Tickets
                reason: `${interaction.user.tag} abriu um ticket!`,
                type: "GUILD_TEXT",
                topic: `Atendimento de Suporte => {${interaction.member.user.id}}`,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: ["VIEW_CHANNEL"]
                    },
                    {
                        id: interaction.user.id,
                        allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES", "ADD_REACTIONS"]
                    },
                    {
                        id: require("./config.js").cargos.staffs.developer,
                        allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES", "ADD_REACTIONS"]
                    }
                ]
            }).then((msg) => {
                interaction.reply({ content: "Ticket criado com sucesso.", ephemeral: true, })
                const _opts = new MessageActionRow().addComponents(
                    new MessageButton()
                    .setCustomId('button_close')
                    .setStyle('SECONDARY')
                    .setEmoji("ð")
                    .setLabel("Fechar").setDisabled(false),
                    new MessageButton()
                    .setCustomId("button_transcript")
                    .setEmoji("ðï¸").setLabel("Transcript")
                    .setStyle("SECONDARY").setDisabled(false)
                )
                msg.send({
                    content: `**Ticket aberto!** - <@&${require("./config.js").cargos.staffs.developer}>`,
                    components: [_opts],
                    embeds: [
                        new MessageEmbed()
                        .setDescription(`
    â° <@${interaction.user.id}> Bem vindo ao seu ticket de denÃºnicia bugs!
    
    > *Por meio desse chat serÃ¡ feito o suporte por parte da equipe para lhe ajudar quanto a criaÃ§Ã£o deste ticket. Fique atento aos horÃ¡rios de atendimento.*`)
                        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true, }), })
                        .setThumbnail('https://media.discordapp.net/attachments/894619714435821578/1030243003383685140/logo-gif.gif')
                        .setColor('#2f3136')
                        .setFooter({text:`Cidadeâ¢ Pixel Â©ï¸ Todos os direitos reservados.`, iconURL: 'https://media.discordapp.net/attachments/894619714435821578/1030243003383685140/logo-gif.gif'})
                    ],
                });   
            }).catch((err) => {
                console.log(err)
                interaction.reply({ content: "NÃ£o foi possÃ­vel criar seu ticket, sinto muito.", ephemeral: true, })
            })
        }
        // REPORTE DE DENUNCIAS - admin
        if (interaction.customId.startsWith("denuncia-players")) {
            const category = interaction.guild.channels.cache.find(c => c.topic === `Atendimento de DenÃºnicia => {${interaction.member.user.id}}`)
            if (category) return interaction.reply({ content: "VocÃª jÃ¡ tem um ticket aberto!", ephemeral: true });
            const canal = await interaction.guild.channels.create(`ð®ââï¸-${interaction.member.user.username}`, {
                parent: "848321633890336768", // Coloque o ID da Categoria de Tickets
                reason: `${interaction.user.tag} abriu um ticket!`,
                type: "GUILD_TEXT",
                topic: `Atendimento de Suporte => {${interaction.member.user.id}}`,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: ["VIEW_CHANNEL"]
                    },
                    {
                        id: interaction.user.id,
                        allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES", "ADD_REACTIONS"]
                    },
                    {
                        id: require("./config.js").cargos.staffs.admin,
                        allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES", "ADD_REACTIONS"]
                    }
                ]
            }).then((msg) => {
                interaction.reply({ content: "Ticket criado com sucesso.", ephemeral: true, })
                const _opts = new MessageActionRow().addComponents(
                    new MessageButton()
                    .setCustomId('button_close')
                    .setStyle('SECONDARY')
                    .setEmoji("ð")
                    .setLabel("Fechar").setDisabled(false),
                    new MessageButton()
                    .setCustomId("button_transcript")
                    .setEmoji("ðï¸").setLabel("Transcript")
                    .setStyle("SECONDARY").setDisabled(false)
                )
                msg.send({
                    content: `**Ticket aberto!** - <@&${require("./config.js").cargos.staffs.admin}>`,
                    components: [_opts],
                    embeds: [
                        new MessageEmbed()
                        .setDescription(`
    â° <@${interaction.user.id}> Bem vindo ao seu ticket de denÃºnicia!
    
    > *Por meio desse chat serÃ¡ feito o suporte por parte da equipe para lhe ajudar quanto a criaÃ§Ã£o deste ticket. Fique atento aos horÃ¡rios de atendimento.*`)
                        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true, }), })
                        .setThumbnail('https://media.discordapp.net/attachments/894619714435821578/1030243003383685140/logo-gif.gif')
                        .setColor('#2f3136')
                        .setFooter({text:`Cidadeâ¢ Pixel Â©ï¸ Todos os direitos reservados.`, iconURL: 'https://media.discordapp.net/attachments/894619714435821578/1030243003383685140/logo-gif.gif'})
                    ],
                });   
            }).catch((err) => {
                console.log(err)
                interaction.reply({ content: "NÃ£o foi possÃ­vel criar seu ticket, sinto muito.", ephemeral: true, })
            })
        }
        if (interaction.customId.startsWith("button_close")) {
            //if (interaction.member.permissions.has("MANAGE_CHANNELS")) return interaction.reply({content:`Sem acesso.`, ephemeral: true})
            interaction.reply({content:`\\ð OlÃ¡ ${interaction.user}, este ticket serÃ¡ fechado em \`5 segundos\`...`}).then(() => {
                setTimeout(() => {
                    interaction.channel.delete();
                }, 5000)
            })
        }
        // OrÃ§amento
        if (interaction.customId.startsWith("financero")) {
            const category = interaction.guild.channels.cache.find(c => c.topic === `Fazendo OrÃ§amento na Cidadeâ¢ Pixel => {${interaction.member.user.id}}`)
            if (category) return interaction.reply({ content: "VocÃª jÃ¡ tem um ticket aberto!", ephemeral: true });
            const canal = await interaction.guild.channels.create(`ð³-${interaction.member.user.username}`, {
                parent: "848321633890336768", // Coloque o ID da Categoria de Tickets
                reason: `${interaction.user.tag} abriu um ticket!`,
                type: "GUILD_TEXT",
                topic: `Fazendo OrÃ§amento na Cidadeâ¢ Pixel => {${interaction.member.user.id}}`,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: ["VIEW_CHANNEL"]
                    },
                    {
                        id: interaction.user.id,
                        allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES", "ADD_REACTIONS"]
                    },
                    {
                        id: require("./config.js").cargos.staffs.fundador, //financeiro
                        allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES", "ADD_REACTIONS"]
                    }
                ]
            }).then((msg) => {
                interaction.reply({ content: "OrÃ§amento criado com sucesso.", ephemeral: true, })
                const _opts = new MessageActionRow().addComponents(
                    new MessageButton()
                    .setCustomId('button_done')
                    .setStyle('SUCCESS')
                    .setEmoji("âï¸")
                    .setLabel("Concluir Pagamento.").setDisabled(false)
                )
                msg.send({
                    content: "**OrÃ§amento aberto!** -" + require("./config.js").cargos.staffs.fundador, //financeiro
                    components: [_opts],
                    embeds: [
                        new MessageEmbed().setDescription(`> ApÃ³s a terminar o pagamento favor mandar o comprovante e clicar no botÃ£o abaixo.`)
                        .addField(`ð¸ MÃ©todos de Pagamento.`, `  â¥ Mercado Pago (\`Pixel.Adicionar\`)\n  â¥ PayPal (\`C. Credito\`)\n  â¥ PicPay (\`Pixel.Adicionar\`)`, true)
                        .setImage("https://media.discordapp.net/attachments/894619714435821578/1030243003383685140/logo-gif.gif")
                        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true, }), })
                        .setThumbnail('https://media.discordapp.net/attachments/894619714435821578/1030243003383685140/logo-gif.gif')
                        .setColor('#2f3136')
                        .setFooter({text:`Cidadeâ¢ Pixel Â©ï¸ Todos os direitos reservados.`, iconURL: 'https://media.discordapp.net/attachments/894619714435821578/1030243003383685140/logo-gif.gif'})
                    ],
                });   
            }).catch((err) => {
                console.log(err)
                interaction.reply({ content: "NÃ£o foi possÃ­vel criar seu ticket, sinto muito.", ephemeral: true, })
            })
        }
        if (interaction.customId.startsWith("button_done")) {
            interaction.guild.channels.edit(interaction.channel.id, {
                name: `ð³-${interaction.member.user.username}-âï¸`,
                topic: `âï¸ Pagamento concluido. {${interaction.member.user.id}}`,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: ["VIEW_CHANNEL"]
                    },
                    {
                        id: interaction.user.id,
                        allow: ["VIEW_CHANNEL","ATTACH_FILES"],
                        deny: ["SEND_MESSAGES", "ATTACH_FILES", "ADD_REACTIONS"]
                    },
                    {
                        id: require("./config.js").cargos.staffs.fundador, //financeiro
                        allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES", "ADD_REACTIONS"]
                    }
                ]
            }).then(msg => {
                interaction.reply({content:`\\ð OlÃ¡ ${interaction.user}, Pagamento concluido com sucesso, agora sÃ³ aguardar a loja entrar em contato. Fique atendo este ticket serÃ¡ fechado em \`1 Dia\`...`}).then(() => {
                    setTimeout(() => {
                        interaction.channel.delete();
                    }, 86400)
                })
            })
        }
        // Transcript
        if (interaction.customId.startsWith("button_transcript")) {
            if (!interaction.member.permissions.has("MANAGE_CHANNELS"));

            const channel = await interaction.channel
            const moment = require('moment'); moment.locale('pt-BR')
            let messages = []

            await channel.messages
                .fetch({ limit: 100 })
                .then(messagePage => {
                    messagePage.forEach(m => {

                        messages.push(`[0;30m${moment(m.createdTimestamp).format('(hh:mm:ss) DD/MM/YYYY')} - ${m.author.username}#${m.author.discriminator}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`)
                            
                    });
                    message = 0 < messagePage.size ? messagePage.at(messagePage.size - 1) : null;
                    messages.reverse().join("\n")
                })

            const hastebin = require("hastebin-gen");

            hastebin(messages.join("\n"), { extension: "txt" }).then(haste => {
                const haste_button = new MessageActionRow().addComponents(
                    new MessageButton()
                    .setStyle("LINK")
                    .setLabel(`Ver codigo.`)
                    .setURL(haste)
                )
                //interaction.channel.send(haste); //ID CANAL LOG
                client.channels.cache.get("1033539899447578674").send({ components: [haste_button], content: `<#${channel.id}> - *${channel.name}*
\`\`\`ansi
[0;37m
====================== Registro de Auditoria. Ticket's ======================

${messages.join("\n")}

\`\`\`` })
                interaction.reply({ content: `Transcript enviado para o canal Logs.` })
            })
        }
    }
})


client.login(token)