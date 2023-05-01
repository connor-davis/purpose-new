const userFormatter = (userData) => {
    return {...userData, password: undefined};
}

module.exports = userFormatter;