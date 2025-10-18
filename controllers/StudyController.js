
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
    await Study.destroy({ where: { id: id } });
    res.redirect('/studies');

  }

  static async updateStudy(req, res) {

    const id = req.params.id;
    const study = await Study.findOne({ where: { id: id }, raw: true });
    res.render('studies/edit', { study });

  }

  static async updateStudyPost(req, res) {

    const id = req.body.id;

    const study = {
      subject: req.body.subject,
      notes: req.body.notes
    };

    await Study.update(study, { where: { id: id } });
    res.redirect('/studies');

  }

  static async toggleStudyStatus(req, res) {

    const id = req.body.id;

    const study = {
      completed: req.body.completed === '0' ? true : false
    };

    await Study.update(study, { where: { id: id } });
    res.redirect('/studies');

  }

  static async index(req, res) {

    const studies = await Study.findAll({ raw: true });
    res.render('studies/all', { studies });
  }
  
};
