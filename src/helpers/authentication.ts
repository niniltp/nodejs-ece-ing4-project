// Check if user logged in
exports.authCheck = (req: any, res: any, next: any) => {
    if (req.session.loggedIn) {
        next();
    } else res.redirect('/login');
};