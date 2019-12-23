exports.showLoginPage = (req: any, res: any) => {
    let message = 'Welcome';
    res.render('login', {message: message})};

exports.showIndexPage = (req: any, res: any) => {
    res.render('index', {name: req.session.user.username});
};

exports.showSignUpPage = (req: any, res: any) => {
    var message = 'Welcome';
    res.render('signup', {message: message})
};