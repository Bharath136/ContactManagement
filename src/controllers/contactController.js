const Contact = require('../models/Contact');

// Add Contact
const addContact = async (req, res) => {
    const { name, email, phone, address, timezone } = req.body;

    const contact = await Contact.create({ name, email, phone, address, timezone, userId: req.user.id });
    return res.status(201).json(contact);
};

// Retrieve Contacts
const getContacts = async (req, res) => {
    const { name, email, timezone, sort } = req.query;

    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (timezone) where.timezone = timezone;

    const contacts = await Contact.findAll({
        where,
        order: sort ? [[sort, 'ASC']] : [],
    });

    return res.status(200).json(contacts);
};

// Update Contact
const updateContact = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, address, timezone } = req.body;

    const contact = await Contact.findByPk(id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });

    contact.name = name || contact.name;
    contact.email = email || contact.email;
    contact.phone = phone || contact.phone;
    contact.address = address || contact.address;
    contact.timezone = timezone || contact.timezone;
    await contact.save();

    return res.status(200).json(contact);
};

// Soft Delete Contact
const deleteContact = async (req, res) => {
    const { id } = req.params;

    const contact = await Contact.findByPk(id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });

    contact.deletedAt = new Date();
    await contact.save();

    return res.status(204).json();
};

module.exports = {
    addContact,
    getContacts,
    updateContact,
    deleteContact,
};
