const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = class AuthController {

  static showLogin(req, res) {
    res.render('auth/login',{ layout: false });
  }

  static showRegister(req, res) {
    res.render('auth/register',{ layout: false });
  }

  static async register(req, res) {

    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.render('auth/register', { error: 'As senhas não coincidem',layout: false });
    }

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.render('auth/register', { error: 'E-mail já cadastrado',layout: false });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = {
      name,
      email,
      password: hashedPassword,
    };

    try {
      await User.create(user);
      res.redirect('/auth/login');
    } catch (error) {
      res.render('auth/register', { error: 'Erro ao criar usuário',layout: false });
    }

  }

  static async login(req, res) {

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.render('auth/login', { error: 'Usuário não encontrado',layout: false });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.render('auth/login', { error: 'Senha ou Email incorretos',layout: false });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/studies');
  }

  static logout(req, res) {
    res.clearCookie('token');
    res.redirect('/auth/login');
  }

};