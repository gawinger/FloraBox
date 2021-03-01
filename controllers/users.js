const User = require('../models/user')

// show register/login page
module.exports.loginPage = (req, res) => {
    res.render("login");
  }

// login user
module.exports.login = (req, res) => {
    const requestedUrl = req.session.returnTo || "/";
    delete req.session.returnTo;
    req.flash("success", "Udało się zalogować");
    res.redirect(requestedUrl);
  }

// logout user 
module.exports.logout = (req, res) => {
    req.flash("success", "Wylogowano");
    req.logOut();
    delete req.session.returnTo;
    res.redirect("/");
  }

// register new user
module.exports.register = async (req, res) => {
    try {
      const { email, password, firstname, lastname } = req.body;
      const newUser = await User.register(new User({ username: email, email, firstname, lastname }), password);
      req.login(newUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Witaj, znajdź coś dla siebie!");
        res.redirect("/");
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/logowanie");
    }
  }

// show admin register page 
module.exports.registerAdminPage = (req, res) => {
    res.render("register-admin");
  }

// register new admin
module.exports.registerAdmin = async (req, res) => {
    try {
      // if user provided correct access key then add new user with admin role
      if (req.body.access_key == process.env.PASSWORD_SECRET) {
        const role = "admin";
        const { email, password, firstname, lastname } = req.body;
        const newUser = await User.register(new User({ username: req.body.email, email, firstname, lastname, role }), password);
        req.login(newUser, (err) => {
          if (err) return next(err);
          req.flash("success", "Witaj, otrzymałeś uprawnienia administratora");
          res.redirect("/");
        });
      } else {
        next();
      }
    } catch (err) {
      req.flash("error", "Access denied, no permission");
      res.redirect("/logowanie");
    }
  }

// show user
module.exports.showUser = (req, res) => {
    res.render("show-user");
  }

// edit user
module.exports.editUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { ...req.body });
    res.redirect("/moje-konto/:id");
  }

// add new address
module.exports.addAddress = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    const address = { ...req.body };
    // push address into user addresses array
    user.addresses.push(address);
    await user.save();
    req.flash("success", "Dodano nowy adres");
    res.redirect(`/moje-konto/${user.id}`);
  }

// delete user address
module.exports.deleteAddress = async (req, res) => {
    const { id, addressId } = req.params;
    const user = await User.findById(id);
    // pull address with provided id from user object
    await user.addresses.pull({ _id: addressId });
    await user.save();
    req.flash("success", "Adres usunięty");
    res.redirect(`/moje-konto/${user.id}`);
  }