module.exports = function(time) {
    var date = new Date(Math.round(time * 1000));
    var hours = date.getHours();
    var minutes = date.getMinutes();
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return hours + ':' + minutes + ' ' + ampm;
};
