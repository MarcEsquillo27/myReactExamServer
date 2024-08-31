const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise'); 
const connection = require("../config/dbConnection");

let picture_name = ""
// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const desktopPath = process.env.HOME || process.env.USERPROFILE; // Get the user's home directory
    const folderPath = path.join(desktopPath, 'Desktop', 'uploads'); // Create the path to the 'uploads' folder on the desktop

    // if not exist create a folder
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    cb(null, folderPath); // transfer the path to multer
  },
  filename: (req, file, cb) => {
    picture_name = Date.now() + path.extname(file.originalname)
    cb(null,picture_name);
  },
});

const upload = multer({ storage });

const router = express.Router();

router.use(cors());
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

// Create the uploads directory if not exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// INSERT Employee
router.post("/api/insertEmployee", upload.single('picture'), async (req, res) => {
  req.body.picture = picture_name

    const { first_name, middle_name, last_name, email, phone, picture } = req.body;

    const sql = `INSERT INTO employees (firstName, middleName, lastName, email, phoneNumber,picture) 
                 VALUES (?, ?, ?, ?, ?,?)`;
    const values = [first_name, middle_name, last_name, email, phone,picture];

    try {
      await connection.execute(sql, values);
        res.send({ message: "Employee data received", data: req.body, file: req.file });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


module.exports = router;
