module.exports.getValueOnKeyFromJson = (filename, key) => {
    var list = require(`../data/${filename}.json`);

    var result = list[key];

    if (Array.isArray(result)) {
        result = result[0];
    };

    return result ? result : key;
};

module.exports.getKeyOnValueFromJson = (filename, value) => {
    var list = require(`../data/${filename}.json`);

    for (key in list) {
        if (list[key].includes(value)) {
            return key;
        };
    };

    return value;
};

module.exports.separateThousandth = (number) => {
    if (!!number) {
        return number.toString().replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1,')
    };
    return '-';
};

module.exports.toDate = (date) => {
    day = date.getDate()
    if (day < 10) {
        day = '0' + day;
    };
    month = date.getMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    };
    minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = '0' + minutes;
    };
    seconds = date.getSeconds();
    if (seconds < 10) {
        seconds = '0' + seconds;
    };
    return day + '.' + month + '.' + date.getFullYear() + ' ' + date.getHours() + ':' + minutes + ':' + seconds;
};

module.exports.toTitle = (string) => {
    return string.replace(/\b\w/g, l => l.toUpperCase());
};

module.exports.toTwoDecimalPlaces = (num, decimals = 2) => {
    var sign = num >= 0 ? 1 : -1;
    return (Math.round((num * Math.pow(10, decimals)) + (sign * 0.001)) / Math.pow(10, decimals)).toFixed(decimals)
};

module.exports.convertSecondsToTime = (seconds) => {
    seconds = seconds.toFixed();

    if (seconds > 3600) {
        var hours = Math.trunc(seconds / 3600);
        var minutes = Math.trunc((seconds - (hours * 3600)) / 60);
        if (minutes) {
            return `${hours} ч ${minutes} мин`;
        };
        return `${hours} ч`;
    } else if (seconds > 60) {
        return `${Math.trunc(seconds / 60)} мин`;
    } else {
        return `${seconds} сек`;
    };
};

module.exports.randomInteger = (minimum, maximum) => {
    var result = minimum - 0.5 + Math.random() * (maximum - minimum + 1);
    return Math.round(result);
};

module.exports.randomBoolean = () => {
    return Math.random() >= 0.5;
};

module.exports.randomHexColor = () => {
    return '#' + Math.random().toString(16).slice(2, 8)
};