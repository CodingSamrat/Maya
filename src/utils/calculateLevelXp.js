
module.exports = (level) => {

    if (level === 0) return 30;

    let xp = Math.ceil(Math.pow(level/0.17, 2));
    return xp;
}