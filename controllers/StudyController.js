
const Study = require('../models/Study');

module.exports = class StudyController {

  static createStudy(req, res) {
    res.render('studies/create');
  }

  static async createStudySave(req, res) {

    const study = {
      subject: req.body.subject,
      notes: req.body.notes,
      completed: false,
      userId: req.user.id,
    };

    await Study.create(study);
    res.redirect('/studies');
  }

  static async removeStudy(req, res) {

    const id = req.body.id;
    await Study.destroy({ where: { id: id, userId: req.user.id } });
    res.redirect('/studies');

  }

  static async updateStudy(req, res) {

    const id = req.params.id;
    const study = await Study.findOne({ where: { id: id, userId: req.user.id }, raw: true });
    res.render('studies/edit', { study });

  }

  static async updateStudyPost(req, res) {

    const id = req.body.id;

    const study = {
      subject: req.body.subject,
      notes: req.body.notes
    };

    await Study.update(study, { where: { id: id, userId: req.user.id } });
    res.redirect('/studies');

  }

  static async toggleStudyStatus(req, res) {

    const id = req.body.id;

    try {
    // Busca a tarefa do usuário logado
    const study = await Study.findOne({where: {id: id,userId: req.user.id,}});

    if (!study) {
      return res.redirect('/studies'); 
    }

    await study.update({
      completed: !study.completed, 
    });

    res.redirect('/studies');
    } catch (error) {
      console.error('Erro ao alternar status da tarefa:', error);
      res.redirect('/studies');
    }
  }

  static async index(req, res) {

    const studies = await Study.findAll({ raw: true, where: { userId: req.user.id } });
    res.render('studies/all', { studies });
  }
  
};
