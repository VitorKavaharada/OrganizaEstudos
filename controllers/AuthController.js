const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

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

    if (password.length < 8) {
      return res.render('auth/register', { error: 'A senha deve ter pelo menos 8 caracteres', layout: false });
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

  //recuperar e redefinir senha =>
  static showForgotPassword(req, res) {
    res.render('auth/forgot-password', { layout: false });
  }

  static async forgotPassword(req, res) {

    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.render('auth/forgot-password', { message: 'Se o e-mail estiver cadastrado, enviaremos um link de redefinição.', layout: false });
    }

    const resetToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '15m' });
    const resetLink = `${process.env.APP_URL}/auth/reset-password?token=${resetToken}`;

    // Configure o nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Envie o e-mail
    try {

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Redefinição de Senha - Organiza Estudos',
        text: `Clique no link para redefinir sua senha: ${resetLink}. Este link expira em 15 minutos.`,
        html: `<p>Clique no link para redefinir sua senha: <a href="${resetLink}">Redefinir Senha</a>. Este link expira em 15 minutos.</p>`,
      });

      res.render('auth/forgot-password', { message: 'Se o e-mail estiver cadastrado, enviaremos um link de redefinição.', layout: false });

    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      res.render('auth/forgot-password', { error: 'Erro ao enviar o e-mail. Tente novamente.', layout: false });
    }
  }

  static showResetPassword(req, res) {

    const { token } = req.query;

    if (!token) {
      return res.redirect('/auth/login');
    }

    try {
      jwt.verify(token, JWT_SECRET); 
      res.render('auth/reset-password', { token, layout: false });
    } catch (error) {
      res.render('auth/forgot-password', { error: 'Token inválido ou expirado. Solicite um novo.', layout: false });
    }
  }

  static async resetPassword(req, res) {

    const { token, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.render('auth/reset-password', { token, error: 'As senhas não coincidem', layout: false });
    }

    try {

      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findByPk(decoded.id);

      if (!user) {
        return res.render('auth/reset-password', { token, error: 'Usuário não encontrado', layout: false });
      }

      if (password.length < 8) {
        return res.render('auth/reset-password', { token, error: 'A senha deve ter pelo menos 8 caracteres', layout: false });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await user.update({ password: hashedPassword });

      res.redirect('/auth/login?message=Senha redefinida com sucesso');
    } catch (error) {
      res.render('auth/reset-password', { token, error: 'Token inválido ou expirado. Solicite um novo.', layout: false });
    }
  }

};