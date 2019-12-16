exports.showLoginPage = (req: any, res: any) => {
    res.render('login');
};

exports.showIndexPage = (req: any, res: any) => {
    res.render('index', {name: req.session.user.username});
};

exports.showSignUpPage = (req: any, res: any) => {
    res.render('signup');
};