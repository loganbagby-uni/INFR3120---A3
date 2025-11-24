var express = require('express');
var router = express.Router();
let contact = require('../models/employee_record');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

/* GET Create page - Show create form */

router.get('/create', function(req, res, next) {
  res.render('contacts/create', {
    title: 'Create Contact',
    contact: {}
  });
});

/* POST Create page - Handle form submission */
router.post('/create', async function(req, res, next) {
  try {
    const newContact = new contact({
      name: req.body.name,
      address: req.body.address,
      phone_number: req.body.phone_number
    });
    
    await newContact.save();
    res.redirect('/employee_records'); // Redirect to records after creation
  }
  catch(err) {
    console.error(err);
    res.render('contacts/create', {
      title: 'Create Contact - Error',
      contact: req.body,
      error: 'Error creating contact: ' + err.message
    });
  }
});

/* GET Update page - Show contact selection */
router.get('/update', async function(req, res, next) {
  try {
    const contacts = await contact.find();
    res.render('update', { 
      title: 'Update Contact',
      contacts: contacts
    });
  }
  catch(err) {
    console.error(err);
    res.render('error', { error: err });
  }
});

/* GET Update form for specific contact */
router.get('/update/:id', async function(req, res, next) {
  try {
    const contact_data = await contact.findById(req.params.id);
    if (!contact_data) {
      return res.render('error', { error: 'Contact not found' });
    }
    
    res.render('update_form', {
      title: 'Edit Contact',
      contact: contact_data
    });
  }
  catch(err) {
    console.error(err);
    res.render('error', { error: err });
  }
});

/* POST Update form - Handle contact update */
router.post('/update/:id', async function(req, res, next) {
  try {
    const updatedContact = {
      name: req.body.name,
      address: req.body.address,
      phone_number: req.body.phone_number
    };

    await contact.findByIdAndUpdate(req.params.id, updatedContact);
    res.redirect('/employee_records');
  }
  catch(err) {
    console.error(err);
    const contact_data = await contact.findById(req.params.id);
    res.render('update_form', {
      title: 'Edit Contact - Error',
      contact: contact_data,
      error: 'Error updating contact: ' + err.message
    });
  }
});

/* GET Delete page. Redirect to employee records delete listing */
router.get('/delete', function(req, res, next) {
  res.redirect('/employee_records/delete');
});

module.exports = router;