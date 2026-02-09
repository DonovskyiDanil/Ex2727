const { Offers, User } = require('../models');
const emailService = require('../utils/emailService');

// Метод для отримання оферів модератором
module.exports.getOffersForModerator = async (req, res, next) => {
  try {
    const { limit, offset } = req.query;
    const offers = await Offers.findAndCountAll({
      where: { status: 'pending' },
      limit: limit || 10,
      offset: offset || 0,
      attributes: ['id', 'text', 'fileName', 'status', 'contestId'],
    });
    res.send(offers);
  } catch (err) {
    next(err);
  }
};

// Метод для зміни статусу (Approve/Reject)
module.exports.changeOfferStatus = async (req, res, next) => {
  try {
    const { offerId, command } = req.body;
    const status = command === 'approve' ? 'approved' : 'rejected';

    const [updatedCount, [updatedOffer]] = await Offers.update(
      { status },
      { where: { id: offerId }, returning: true },
    );

    if (updatedCount > 0) {
      const creative = await User.findByPk(updatedOffer.userId);
      // Відправка email (Завдання 12)
      await emailService.sendNotification(creative.email, status);
      res.send(updatedOffer);
    } else {
      res.status(404).send('Офер не знайдено');
    }
  } catch (err) {
    next(err);
  }
};
