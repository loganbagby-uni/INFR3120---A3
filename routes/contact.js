let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let contact = require('../models/employee_record');

//  Get route for the read contacts -- read operation
router.get('/', async (req, res, next) => {
  try {
    const contacts = await contact.find();
    res.render('contacts/list', {
      title: 'Contacts',
      contacts: contacts
    });
  }
  catch (err) {
    console.error(err);
    res.render('error', { error: err });
  }
});

// GET - Show Create Contact Form
router.get('/create', (req, res) => {
  res.render('contacts/create', {
    title: 'Add New Contact',
    contact: {}
  });
});

// POST - Handle Create Contact Form Submission
router.post('/create', async (req, res) => {
  try {
    const newContact = new contact({
      name: req.body.name,
      address: req.body.address,
      phone_number: req.body.phone_number
    });

    await newContact.save();
    res.redirect('/employee_records');
  }
  catch (err) {
    console.error(err);
    res.render('contacts/create', {
      title: 'Add New Contact - Error',
      error: 'Error creating contact: ' + err.message
    });
  }
});

// GET - Show Edit Contact Form
router.get('/:id/edit', async (req, res) => {
  try {
    const contact_data = await contact.findById(req.params.id);
    if (!contact_data) {
      return res.render('error', { error: 'Contact not found' });
    }

    res.render('employee_records/update', {
      title: 'Edit Contact',
      contact: contact_data
    });
  }
  catch (err) {
    console.error(err);
    res.render('error', { error: err });
  }
});

// POST - Handle Update Contact Form Submission
router.post('/:id/update', async (req, res) => {
  try {
    const updatedContact = {
      name: req.body.name,
      address: req.body.address,
      phone_number: req.body.phone_number
    };

    await contact.findByIdAndUpdate(req.params.id, updatedContact);
    res.redirect('/employee_records');
  }
  catch (err) {
    console.error(err);
    const contact_data = await contact.findById(req.params.id);
    res.render('employee_records/update', {
      title: 'Edit Contact - Error',
      contact: contact_data,
      error: 'Error updating contact: ' + err.message
    });
  }
});

// GET - Show delete listing page (same table but allows deletion)
router.get('/delete', async (req, res) => {
  try {
    const contacts = await contact.find();
    res.render('contacts/delete', {
      title: 'Delete Contacts',
      contacts: contacts
    });
  } catch (err) {
    console.error(err);
    res.render('error', { error: err });
  }
});

// POST - Perform deletion and redirect back to delete listing
router.post('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await contact.deleteOne({ _id: id });
    return res.redirect('/employee_records/delete');
  } catch (err) {
    console.error(err);
    return res.render('error', { error: err });
  }
});

module.exports = router;