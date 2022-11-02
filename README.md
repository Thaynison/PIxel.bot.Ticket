# Cloud-Bot-Discord-js-v13

Bot oficial para a sua empresa ainda esta na versão 1.0

## Config => (config.js)

```js
module.exports = {
    token: "Coloque o token do seu bot aqui!!",
    prefix: ";",
    intents:  [
        'GUILDS',
        'GUILD_MESSAGE_REACTIONS',
        'GUILD_MESSAGES',
        'GUILD_INVITES',
        'GUILD_VOICE_STATES',
        'GUILD_MEMBERS',
        'GUILD_PRESENCES'
    ],
    footer: "Bot.Cloud ©️ Todos os direitos reservados.",
    semperm: ":x: **‣** Você não possui a permissão necessaria para executar este comando.",
    onwerBot: "Coloque o seu id aqui!",
	cargos: {
		membro: "ID do cargo principal da sua empresa.",
		notificacao: {
			anuncios: "ID CARGO PING DE ANUNCIOS",
			atualizacoes: "ID CARGO PING DE ATUALIZACOES",
			parcerias: "ID CARGO PING DE PARCERIAS"
		},
		staffs: {
			suporte: "ID CARGO SUPORTE",
			moderador: "ID CARGO MODERADOR",
			admin: "ID CARGO ADMIN",
			fundador: "ID CARGO FUNDADOR"
		}
	}
}
```
