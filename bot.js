var Discord = require('discord.js');
var config = require('./config.js');
var tools = require('./modules/tools.js');
var db = require('./modules/db.js');
var fs = require('fs');

var client = new Discord.Client();
client.commands = new Discord.Collection();

var cache = new Object();
(async function () {
    cache.servers = new Object();
    var result = await db.loadCacheFromDb()
    if (!!result.rows) {
        cache = result.rows[0].mycacheobject;
    };
})()

function saveCache() {
    db.saveCacheInDb(cache);
    setTimeout(() => saveCache(), 300 * 1000);
};

setTimeout(() => saveCache(), 30 * 1000);

function checkCache(idGuild) {
    cacheGuild = cache.servers[idGuild];
    if (!cacheGuild) {
        cache.servers[idGuild] = new Object();
    };
    if (!cacheGuild || !cache.servers[idGuild].economy) {
        cache.servers[idGuild].economy = new Object();
    };
    if (!cacheGuild || !cache.servers[idGuild].players) {
        cache.servers[idGuild].players = new Object();
    };
    if (!cacheGuild || !cache.servers[idGuild].embeds) {
        cache.servers[idGuild].embeds = new Object();
    };
    if (!cacheGuild || !cache.servers[idGuild].access) {
        cache.servers[idGuild].access = new Object();
    };
    if (!cacheGuild || !cache.servers[idGuild].roles) {
        cache.servers[idGuild].roles = new Object();
    };
};

module.exports.setCurrency = (idServer, idUser, currency) => {
    idServer = (idServer).toString();
    idUser = (idUser).toString();
    currency = parseInt(currency, 10);

    checkCache(idServer);

    if (currency < 0) {
        currency = 0;
    } else if (currency > 100000000) {
        currency = 1000000000000;
    };

    cache.servers[idServer].economy[idUser] = currency;
};

module.exports.getCurrency = (idServer, idUser) => {
	idServer = (idServer).toString();
	checkCache(idServer);
	
	if (!!idServer && !idUser) {
		  return cache.servers[idServer].economy;
	} else {
    idUser = (idUser).toString();

    if (idUser in cache.servers[idServer].economy) {
        return parseInt(cache.servers[idServer].economy[idUser]);
    };

    return 0;
};

module.exports.setPlayer = (idServer, idUser, player) => {
    idServer = (idServer).toString();
    idUser = (idUser).toString();

    checkCache(idServer);

    if (!(idUser in cache.servers[idServer].players)) {
        cache.servers[idServer].players[idUser] = new Object();
    };

    if (!!player.nick) {
        cache.servers[idServer].players[idUser].nick = player.nick;
    };

    if (!!player.mode) {
        cache.servers[idServer].players[idUser].mode = player.mode;
    };

    if (!!player.server) {
        cache.servers[idServer].players[idUser].server = player.server;
    };
};

module.exports.getPlayer = (idServer, idUser) => {
    idServer = (idServer).toString();
    idUser = (idUser).toString();

    checkCache(idServer);

    if (idUser in cache.servers[idServer].players) {
        return Object.create(cache.servers[idServer].players[idUser]);
    };

    return {};
};

module.exports.setEmbed = (idServer, idUser, embed) => {
    idServer = (idServer).toString();
    idUser = (idUser).toString();

    checkCache(idServer);

    cache.servers[idServer].embeds[idUser] = embed;
};

module.exports.getEmbed = (idServer, idUser) => {
    idServer = (idServer).toString();
    idUser = (idUser).toString();

    checkCache(idServer);

    if (idUser in cache.servers[idServer].embeds) {
        return Object.create(cache.servers[idServer].embeds[idUser]);
    };

    return {};
};

function getFiles(dir, files_) {
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files) {
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files_);
        } else {
            command = require(name);
            client.commands.set(command.name, command);
            if (command.aliases) {
                for (var aliase of command.aliases) {
                    client.commands.set(aliase, command);
                };
            };
        };
    };
};

getFiles('./commands');

var cooldowns = new Discord.Collection();

var events = {
    MESSAGE_REACTION_ADD: 'messageReactionAdd',
};

client.on('raw', async event => {
    if (!events.hasOwnProperty(event.t)) {
        return;
    };

    var { d: data } = event;
    var user = client.users.get(data.user_id);
    var channel = client.channels.get(data.channel_id) || await user.createDM();

    if (channel.messages.has(data.message_id)) {
        return;
    };

    var message = await channel.fetchMessage(data.message_id);

    var emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
    var reaction = message.reactions.get(emojiKey);

    client.emit(events[event.t], reaction, user);
});

client
    .on('error', console.error)
    .on('warn', console.warn)
    .on('disconnect', () => {
        console.warn('Обрыв связи!');
    })
    .on('reconnecting', () => {
        console.warn('Переподключение.');
    })
    .on('ready', () => {
        console.log(
            `* ${client.user.tag} на связи! Подключения: ${client.guilds.size} Пользователи: ${client.users.size}\n` +
            `\n--- Подключенные сервера ---\n` +
            client.guilds.map(g => `| ${g.name}`).join('\n') +
            `\n----------------------------\n`);
        client.user.setActivity(`${config.bot_prefix}help`);
    })
    .on('guildCreate', guild => {
        console.log(`Новое подключение: ${guild.name} (id: ${guild.id}). Участники: ${guild.memberCount}`);
    })
    .on('guildDelete', guild => {
        console.log(`Отключение от: ${guild.name} (id: ${guild.id})`);
    })
    .on('guildMemberAdd', member => {
        /*var rolesGuild = roleGuilds.get(member.guild);
        if (!!rolesGuild) {
            for (role of rolesGuild) {
                role = member.guild.roles.get(role);
                member.addRole(role);
            };
        };*/
    })
    .on('guildMemberRemove', member => {
        console.log(`'${member.user.username}' вышел из '${member.guild.name}'`);
    })
    .on('messageReactionAdd', (messageReaction, user) => {
        /*var message = messageReaction.message;
        var guildReaction = reactGuilds.get(message.guild);
        if (!!guildReaction) {
            var msg = guildReaction.get(message.id);
            if (!!msg) {
                var emoji;
                if (!!messageReaction.emoji.id) {
                    emoji = `<:${messageReaction.emoji.name}:${messageReaction.emoji.id}>`;
                } else {
                    emoji = messageReaction.emoji.name;
                };

                if (emoji in msg) {
                    member = message.guild.members.get(user.id);
                    role = msg[emoji].match(/\d/g).join('');
                    if (!member.roles.exists('id', role)) {
                        role = message.guild.roles.get(role);
                        member.addRole(role);
                    };
                };
            };
        };*/
    })
    .on('message', async message => {
        if (message.author.bot) {
            return;
        };

        if (message.mentions.members.size === 1 && message.content.split(/ +/).length === 1) {
            if (message.mentions.members.first().id === client.user.id) {
                message.content = `${config.bot_prefix}about`;
            };
        };

        var prefix;

        for (var thisPrefix of [config.bot_prefix, '.']) {
            if (message.content.startsWith(thisPrefix)) {
                prefix = thisPrefix;
            };
        };

        if (!prefix) {
            return;
        };

        var args = message.content.slice(prefix.length).split(/ +/);

        var commandName = args.shift().toLowerCase();
        var command = client.commands.get(commandName);

        if (!command) {
            return;
        };

        if (message.guild && !message.channel.permissionsFor(message.client.user).has('SEND_MESSAGES')) {
            return message.author.send(`${message.author}, нет разрешения отправлять сообщения в ${message.channel} на сервере **${message.guild}**!`).catch(O_o => { });
        };

        setTimeout(() => message.delete().catch(O_o => { }), 500);

        if (command.guild && message.channel.type !== 'text') {
            return message.reply('эту команду можно вызывать только на сервере!');
        };

        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection());
        };

        var now = Date.now();
        var timestamps = cooldowns.get(command.name);
        var cooldownAmount = (command.cooldown || 3) * 1000;

        function CooldownReset(idUser) {
            timestamps.delete(idUser);
        };

        if (!timestamps.has(message.author.id)) {
            timestamps.set(message.author.id, now);
            setTimeout(() => CooldownReset(message), cooldownAmount);
        } else {
            var expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                var timeLeft = tools.convertSecondsToTime((expirationTime - now) / 1000);
                if (!command.cooldownMessage) {
                    return message.reply(`пожалуйста, подождите ${timeLeft} прежде, чем снова вызвать команду: \`${command.name}\`!`);
                } else {
                    return message.reply(command.cooldownMessage[tools.randomInteger(0, command.cooldownMessage.length - 1)].replace('${leftTime}', timeLeft));
                };
            } else {
                timestamps.set(message.author.id, now);
                setTimeout(() => CooldownReset(message), cooldownAmount);
            };
        };

        try {
            command.execute(message, args, CooldownReset);
        } catch (error) {
            console.error(error);
            message.reply('при вызове команды произошла ошибка.');
        };
    });

client.login(config.bot_token);