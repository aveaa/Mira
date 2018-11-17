var package = require('../../package.json');
var config = require('../../config.js');
var Discord = require('discord.js');

module.exports = {
	name: __filename.slice(__dirname.length + 1).split('.')[0],
	description: 'Пригласить бота на свой сервер',
	aliases: undefined,
	usage: undefined,
	guild: false,
	hide: true,
	cooldown: undefined,
	cooldownMessage: undefined,
	permissions: undefined,
	group: __dirname.split(/[\\/]/)[__dirname.split(/[\\/]/).length - 1],
	execute(message, args, CooldownReset) {
		var embed = new Discord.RichEmbed()
			.setAuthor(`Спасибо за интерес!`)
			.setTitle('Исходный код на GitHub-е')
			.setURL(`https://github.com/${package.author.split('#')[0]}/${package.name}`)
			.setDescription(`К сожалению, бот недоступен для приглашений`)
			.setColor('#99D8E9');

		message.author.send({ embed }).catch(err => {
			var memberRequest = message.guild.members.get(message.author.id);
			embed.setFooter(`Запрос от ${(!memberRequest || !memberRequest.nickname) ? message.author.username : memberRequest.nickname} | ${config.bot_prefix}${this.name}`, message.author.displayAvatarURL);
		})
	},
};