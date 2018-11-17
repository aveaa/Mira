var request = require('sync-request');
var tools = require('./tools.js');
var config = require('./../config.js');
var cache = require('./../bot.js');

module.exports.get_user = (id_or_name, mode = 0, server = 'ppy') => {
    var url = `https://${this.getValueOnKeyFromJson('server', server)}/api/get_user?m=${mode}&u=${id_or_name}`;

    if (server === 'ppy') {
        url += `&k=${config.osu_token}`;
    };

    var res = request('GET', url);
    return JSON.parse(res.getBody('utf8'));
};

module.exports.get_user_recent = (id_or_name, mode = 0, server = 'ppy') => {
    var url = `https://${this.getValueOnKeyFromJson('server', server)}/api/get_user_recent?m=${mode}&u=${id_or_name}&limit=${1}`;

    if (server === 'ppy') {
        url += `&k=${config.osu_token}`;
    };

    var res = request('GET', url);
    return JSON.parse(res.getBody('utf8'));
};

module.exports.get_user_best = (id_or_name, mode = 0, server = 'ppy', limit = 5) => {
    if (limit > 10) {
        limit = 10;
    };

    var url = `https://${this.getValueOnKeyFromJson('server', server)}/api/get_user_best?m=${mode}&u=${id_or_name}&limit=${limit}`;

    if (server === 'ppy') {
        url += `&k=${config.osu_token}`;
    };

    var res = request('GET', url);
    return JSON.parse(res.getBody('utf8'));
};

module.exports.get_scores = (id_map, id_user, mode = 0, server = 'ppy') => {
    var url = `https://${this.getValueOnKeyFromJson('server', server)}/api/get_scores?m=${mode}&b=${id_map}&u=${id_user}&limit=${1}`;

    if (server === 'ppy') {
        url += `&k=${config.osu_token}`;
    };

    var res = request('GET', url);
    return JSON.parse(res.getBody('utf8'));
};

module.exports.get_beatmap = (id_map, mode = 0, server = 'ppy') => {
    var url = `https://${this.getValueOnKeyFromJson('server', server)}/api/get_beatmaps?m=${mode}&b=${id_map}`;

    if (server === 'ppy') {
        url += `&k=${config.osu_token}`;
    };

    var res = request('GET', url);
    return JSON.parse(res.getBody('utf8'));
};

module.exports.convertLength = (length) => {
    var dt = new Date();
    dt.setTime(length * 1000);
    var seconds = dt.getUTCSeconds();
    if (parseInt(dt.getUTCSeconds()) < 10) {
        return dt.getUTCMinutes() + ':0' + dt.getUTCSeconds();
    } else {
        return dt.getUTCMinutes() + ':' + dt.getUTCSeconds();
    };
};

module.exports.convertDatetime = (datetime) => {
    var [date, time] = datetime.split(' ');
    var [year, month, day] = date.split('-');
    var [hours, minutes, seconds] = time.split(':');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
};

module.exports.calculateAccuracity = (mode, count300, count100, count50, countmiss, countkatu, countgeki) => {
    if (parseInt(mode) === 0) {
        user_score = parseInt(count300) * 300;
        user_score += parseInt(count100) * 100;
        user_score += parseInt(count50) * 50;
        total_score = parseInt(count300);
        total_score += parseInt(count100);
        total_score += parseInt(count50);
        total_score += parseInt(countmiss);
        total_score *= 300;
        return user_score / total_score * 100;
    } else if (parseInt(mode) === 1) {
        user_score = parseInt(count100) * 0.5;
        user_score += parseInt(count300);
        total_score = parseInt(countmiss) + parseInt(count50);
        total_score += parseInt(count300);
        total_score += parseInt(count100);
        return user_score / total_score * 100;
    } else if (parseInt(mode) === 2) {
        user_score = parseInt(count50); //droplet!
        user_score += parseInt(count100); //drop?
        user_score += parseInt(count300); //fruit?
        total_score = parseInt(countkatu); //missed droplet!
        total_score += parseInt(count100); //missed drop?
        total_score += parseInt(countgeki); //missed fruit?
        total_score += parseInt(count50); //droplet!
        total_score += parseInt(count100); //drop?
        total_score += parseInt(count300); //fruit?
        return user_score / total_score * 100;
    } else if (parseInt(mode) === 3) {
        user_score = parseInt(count50) * 50;
        user_score += parseInt(count100) * 100;
        user_score += parseInt(countkatu) * 200;
        user_score += parseInt(count300) * 300;
        user_score += parseInt(countgeki) * 300;
        total_score = parseInt(countgeki);
        total_score += parseInt(count300);
        total_score += parseInt(countkatu);
        total_score += parseInt(count100);
        total_score += parseInt(count50);
        total_score += parseInt(countmiss);
        total_score *= 300;
        return user_score / total_score * 100;
    } else return null;
};

module.exports.showStatistic = (mode, count300, count100, count50, countmiss, countkatu, countgeki) => {
    count300 = tools.separateThousandth(count300);
    countgeki = tools.separateThousandth(countgeki);
    count100 = tools.separateThousandth(count100);
    countkatu = tools.separateThousandth(countkatu);
    count50 = tools.separateThousandth(count50);
    countmiss = tools.separateThousandth(countmiss);
    mode = parseInt(mode);

    if (mode === 0) {
        return `**300:** ${count300} **Geki:** ${countgeki}
                **100:** ${count100}    **Katu:** ${countkatu}
                **50:** ${count50}  **×:** ${countmiss}`;
    } else if (mode === 1) {
        return `**✪:** ${count300}   **⍟:** ${countgeki}
                **★:** ${count100}  **☆:** ${countkatu}
                **×:** ${count50}`;
    } else if (mode === 2) {
        return `**300:** ${count300} **×:** ${countgeki}
                **100:** ${count100}    **×:** ${countkatu}
                **50:** ${count50}  **×:** ${countmiss}`;
    } else if (mode === 3) {
        return `**MAX:** ${countgeki}   **300:** ${count300}
                **200:** ${countkatu}    **100:** ${count100}
                **50:** ${count50}  **×:** ${countmiss}`;
    } else {
        return '-';
    };
};

module.exports.searchPlayer = (message, args) => {
    if (Array.isArray(args)) {
        args = args.join(' ');
    };

    function findPlayer(user, message) {
        var findedPlayer = cache.getPlayer(message.guild.id, user.id);

        if (!findedPlayer.nick) {
            if (!!(member = message.guild.members.get(user.id))['nickname']) {
                findedPlayer.nick = member.nickname;
            } else {
                findedPlayer.nick = user.username;
            };
        };

        if (user.id !== message.author.id) {
            var requestPlayer = cache.getPlayer(message.guild.id, message.author.id);

            if (!findedPlayer.mode) {
                findedPlayer.mode = requestPlayer.mode;    
            };

            if (!findedPlayer.server) {
                findedPlayer.server = requestPlayer.server;
            };
        };

        if (!findedPlayer.mode) {
            findedPlayer.mode = 0;
        };

        if (!findedPlayer.server) {
            findedPlayer.server = 'ppy';
        };

        return findedPlayer;
    };

    var player = {};

    if (message.mentions.users.size) {
        player = findPlayer(message.mentions.users.first(), message);
    } else {
        player = findPlayer(message.author, message);

        if (args.length) {
            player.nick = args;
        };
    };

    return player;
};

module.exports.getModsFromJson = (code) => {
    var mods = require('./../data/osu!/mods.json');
    code = parseInt(code, 10);
    var result = [];

    for (var i = 0; i < Object.keys(mods).length; i++) {
        if (parseInt(Object.keys(mods)[i], 10) === code) {
            result.push(Object.values(mods)[i]);
            break;
        };

        if (parseInt(Object.keys(mods)[i], 10) > code) {
            code = code - Object.keys(mods)[i - 1];
            result.push(Object.values(mods)[i - 1]);
            i = 0;
        };
    };

    return result.join(', ');
};

module.exports.getKeyFromSearchOnValueFromJson = (filename, value) => {
    var list = require(`../data/osu!/${filename}.json`);
    var searchResult = false;
    var result;

    for (key in list) {
        if (list[key].includes(value)) {
            result = key;
            searchResult = true;
            return { result, searchResult };
        };
    };

    result = [];

    for (key in list) {
        if (Array.isArray(list[key])) {
            result.push(list[key].join(', '));
        } else {
            result.push(list[key]);
        };
    };
    result = `~~${value}~~ нет. Но есть: ${result.join(', ')}.`

    return { result, searchResult };
};

module.exports.getValueOnKeyFromJson = (filename, key) => {
    var list = require(`../data/osu!/${filename}.json`);

    var result = list[key];

    if (Array.isArray(result)) {
        result = result[0];
    };

    return result ? result : key;
};