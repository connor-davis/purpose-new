const userFormatter = (userData) => {
    return {...userData, password: undefined, __v: undefined };
}

module.exports = userFormatter;