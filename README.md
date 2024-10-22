Overview
This assignment assesses your backend development skills using NextJS, focusing on SQL, authentication, data validation, timezones, file handling, and CSV/Excel parsing. 

Features
User Authentication:

Registration and login using JWT.
Email verification and password reset via OTP.
Contact Management:

Create, update, delete (soft delete), and retrieve contacts.
Batch processing for multiple contacts.
Filtering by name, email, and timezone.
Data Validation:

Validation using libraries like Joi.
Unique email constraints.
Date-Time Handling:

Store timestamps in UTC, retrieve based on user timezones.
Filter contacts by a date range.
File Handling:

Upload and validate CSV/Excel for bulk contacts.
Download contact list in CSV/Excel.
Database:

Use PostgreSQL.
Ensure data integrity with transactions for batch processes.
Security:

Rate limiting and secure password hashing.


The necessary packages include:

Next.js: next
JWT for Authentication: jsonwebtoken
Email Service (Nodemailer): nodemailer
Validation: joi
File Handling: multer, csv-parser, xlsx
SQL Database: pg (PostgreSQL) 
ORM (Optional): sequelize

----- to start the server -----

npm install 
npm run dev