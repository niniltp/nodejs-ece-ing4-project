// Check if user logged in
exports.authCheck = (req: any, res: any, next: any) => {
    if (req.session.loggedIn) {
        next();
    } else res.redirect('/login');
};

exports.usernameCheck = (req: any, res: any, next: any) => {
    if (req.session.loggedIn && req.session.user && req.params.username && req.session.user.username === req.params.username) {
        next();
    } else  res.status(403).send("You don't have the rights");
};