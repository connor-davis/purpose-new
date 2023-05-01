const adminRoute = (request, response, next) => {
    if (request.user.userType === "admin") return next();
    else return response.status(401).send("Unauthorized");
};

module.exports = adminRoute;