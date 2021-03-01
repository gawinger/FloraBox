const express = require('express');
const passport = require('passport');
const router = express.Router();

const users = require('../controllers/users');
const { isLogged } = require('../public/utils/middleware');

router.route('/logowanie')
    // Show register/login page
    .get(users.loginPage)
    // Login user
    .post(passport.authenticate("local", {
        failureRedirect: "/logowanie",
        failureFlash: "Invalid email or password.",
      }), users.login);

router.route('/wyloguj')
    // Logout user
    .get(isLogged, users.logout)

router.route('/rejestracja')
    // Register new user
    .post(users.register)

router.route('/rejestracja/role/admin')
    // Show admin register form
    .get(users.registerAdminPage)
    // Register admin
    .post(users.registerAdmin)

router.route('/moje-konto/:id')
    // Show user
    .get(isLogged, users.showUser)
    // Edit user
    .put(isLogged, users.editUser)

router.route('/moje-konto/:id/adresy')
    // Add user address
    .post(isLogged, users.addAddress)

router.route('/moje-konto/:id/adresy/:addressId')
    // Delete user address
    .delete(isLogged, users.deleteAddress)

module.exports = router;
