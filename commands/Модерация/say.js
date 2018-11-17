module.exports = {
    name: __filename.slice(__dirname.length + 1).split('.')[0],
    description: 'Сказать что-нибудь от имени бота',
    aliases: undefined,
    usage: '[edit] [#канал] [id-сообщения] <крутая речь>',
    guild: true,
    hide: false,
    cooldown: 1,
    cooldownMessage: undefined,
    permissions: ['MANAGE_MESSAGES', 'SEND_MESSAGES'],
    group: __dirname.split(/[\\/]/)[__dirname.split(/[\\/]/).length - 1],
    execute(message, args, CooldownReset) {
        var edit = false,
            targetChannel = message.mentions.channels.first(),
            targetMessageId,
            targetText = '';

        if (args.length === 0) {
            return message.reply('вы не указали, что нужно сказать.');
        };

        if (args[0].toString() === 'edit') {
            edit = true;
            args = args.slice(1);
        };

        if (args[0] === (!!targetChannel ? targetChannel.toString() : undefined)) {
            if (!targetChannel.permissionsFor(message.member).has(this.permissions[0])) {
                return message.reply('у тебя недостаточно привилегий в указанном канале!');
            } else if (!targetChannel.permissionsFor(message.client.user).has(this.permissions[1])) {
                return message.reply('у меня нет возможности отправлять сообщения в указанном канале!');
            };
            args = args.slice(1);
        } else {
            targetChannel = message.channel;
            if (!targetChannel.permissionsFor(message.member).has(this.permissions[0])) {
                return message.reply('недостаточно привилегий!');
            };
        };

        if (edit && !isNaN(parseInt(args[0], 10))) {
            targetMessageId = args[0];
            args = args.slice(1);
        };

        targetText = args.join(' ');

        if (targetText == '') {
            return message.reply(`вы не указали, что нужно сказать.`);
        };

        if (edit) {
            targetChannel.fetchMessage(targetMessageId)
                .then(message => message.edit(targetText))
                .catch(error => {
                    message.reply(`сообщение для редактирования не найдено!\nКанал: ${targetChannel}\nID: ${targetMessageId}\nОтправляемый текст: \`\`\`fix\n${targetText.substr(0, 1424)}\`\`\` ${error}`);
                });
        } else {
            targetChannel.send(targetText);
        };
    },
};