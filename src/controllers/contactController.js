const Contact = require('../models/Contact');
const { Op } = require('sequelize'); // Import Op from Sequelize
const fs = require('fs');
const xlsx = require('xlsx');
const { sequelize } = require('../utils/database');

// Excel Upload Handler
const bulkUploadExcel = async (req, res) => {
    const { id } = req.user; // Assuming user is authenticated
    const contacts = [];

    try {
        // Parse the Excel file
        const workbook = xlsx.readFile(req.file.path);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);

        // Validate and prepare contact data
        data.forEach((row) => {
            if (row.name && row.email && row.phone) {
                contacts.push({
                    name: row.name,
                    email: row.email,
                    phone: row.phone,
                    address: row.address || null,
                    timezone: row.timezone || null,
                    UserId: id, // Assuming userId exists
                });
            }
        });

        // Bulk create contacts within a transaction
        await sequelize.transaction(async (t) => {
            await Contact.bulkCreate(contacts, { transaction: t });
        });

        res.status(200).json({ message: 'Contacts uploaded successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading contacts', error });
    }
};

// Add Contact
const addContact = async (req, res) => {
    try {
        const { name, email, phone, address, timezone } = req.body;

        if (!name || !email || !phone) {
            return res.status(400).json({ message: 'Name, email, and phone are required.' });
        }

        const contact = await Contact.create({
            name,
            email,
            phone,
            address,
            timezone,
            UserId: req.user.id, // Assuming authenticated user
        });
        return res.status(201).json(contact);
    } catch (error) {
        res.status(500).json({ message: 'Error adding contact', error });
    }
};

// Retrieve Contacts
const getContacts = async (req, res) => {
    try {
        const { name, email, timezone, sort } = req.query;

        const where = { deletedAt: null }; // Fetch only non-deleted contacts
        if (name) where.name = { [Op.iLike]: `%${name}%` };
        if (email) where.email = { [Op.iLike]: `%${email}%` };
        if (timezone) where.timezone = timezone;

        const contacts = await Contact.findAll({
            where,
            order: sort ? [[sort, 'ASC']] : [], // Default sorting if provided
        });

        return res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving contacts', error });
    }
};

// Update Contact
const updateContact = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, address, timezone } = req.body;

        const contact = await Contact.findByPk(id);
        if (!contact || contact.deletedAt) {
            return res.status(404).json({ message: 'Contact not found or deleted' });
        }

        // Update fields only if new data is provided
        contact.name = name || contact.name;
        contact.email = email || contact.email;
        contact.phone = phone || contact.phone;
        contact.address = address || contact.address;
        contact.timezone = timezone || contact.timezone;
        await contact.save();

        return res.status(200).json(contact);
    } catch (error) {
        res.status(500).json({ message: 'Error updating contact', error });
    }
};

// Soft Delete Contact
const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;

        const contact = await Contact.findByPk(id);
        if (!contact || contact.deletedAt) {
            return res.status(404).json({ message: 'Contact not found or already deleted' });
        }

        contact.deletedAt = new Date();
        await contact.save();

        return res.status(204).json();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting contact', error });
    }
};

module.exports = {
    bulkUploadExcel,
    addContact,
    getContacts,
    updateContact,
    deleteContact,
};
