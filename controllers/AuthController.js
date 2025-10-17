const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = class AuthController {

  static showLogin(req, res) {
    res.render('auth/login');
  }

  static showRegister(req, res) {
    res.render('auth/register');
  }

  static async register(req, res) {

    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.render('auth/register', { error: 'As senhas não coincidem' });
    }

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.render('auth/register', { error: 'E-mail já cadastrado' });
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
      res.render('auth/register', { error: 'Erro ao criar usuário' });
    }

  }

  static async login(req, res) {

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.render('auth/login', { error: 'Usuário não encontrado' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.render('auth/login', { error: 'Senha incorreta' });
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