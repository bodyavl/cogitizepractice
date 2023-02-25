
function getRandomArbitrary(min, max) {
    max += 1;
    return Math.random() * (max - min) + min;
}

module.exports = getRandomArbitrary;