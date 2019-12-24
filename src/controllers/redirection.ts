exports.showLoginPage = (req: any, res: any) => {
<<<<<<< HEAD
    let message = 'Welcome !';
=======
    let message = 'Welcome ';
>>>>>>> ec76462e07461c9867aa9b2dba59c8d7542e47b0
    res.render('login', {message: message})};

exports.showIndexPage = (req: any, res: any) => {
    let message = '';
    res.render('index', {message: message, name: req.session.user.username});
};

exports.showSignUpPage = (req: any, res: any) => {
<<<<<<< HEAD
    var message = 'Welcome !';
=======
    var message = 'Welcome ';
>>>>>>> ec76462e07461c9867aa9b2dba59c8d7542e47b0
    res.render('signup', {message: message})
};