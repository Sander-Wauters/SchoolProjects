function getDateOnly(date) {
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
}

module.exports = {
    getDateOnly,
};
