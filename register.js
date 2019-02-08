const express = require('express');
const { check, validationResult } = require('express-validator/check');
const { sanitize } = require('express-validator/filter');

const { insert } = require('./db');

const router = express.Router();

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

const validation = [
  check('name').isLength({ min: 1 }).withMessage('Nafn má ekki vera tómt'),
  check('email').isLength({ min: 1 }).withMessage('Netfang má ekki vera tómt'),
  check('email').isEmail().withMessage('Netfang verður að vera netfang'),
  check('phone').isLength({ min: 1 }).withMessage('Símanúmer verður að vera sjö stafir'),
  check('phone')
    .matches(/^[0-9]{3}-?[0-9]{4}$/)
    .withMessage('Símanúmer verður að vera á formi xxx-xxxx eða xxxxxxx'),
  check('text').isLength({ min: 100 }).withMessage('Kynning verður að vera að minnsta kosti 100 stafir'),
  check('job').isLength({ min: 1 }).withMessage('Verður að velja starf'),
];

const sanitazion = [
  sanitize('name')
    .trim()
    .escape(),
  sanitize('email')
    .normalizeEmail(),
  sanitize('phone')
    .toInt(),
];

function form(req, res) {
  res.render('index', {
    name: '', email: '', phone: '', text: '', job: '', errors: [],
  });
}

async function register(req, res) {
  const {
    body: {
      name, email, phone, text, job,
    } = {},
  } = req;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array();
    res.render('index', {
      name, email, phone, text, job, errors: errorMessages,
    });
  } else {
    try {
      await insert(name, email, phone, text, job, 'false');
    } catch (e) {
      throw e;
    }
    res.render('thanks');
  }
}

router.get('/', (form));
router.post('/register', validation, sanitazion, (register));


module.exports = router;
