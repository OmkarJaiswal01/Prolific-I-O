const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Import fs module
require('dotenv').config()
const app = express();

const SignUpModel = require('../Backend/Model/SignUpModel');
const BoardingModel = require('../Backend/Model/BoardingModel');
const CformModel = require('../Backend/Model/CformModel');
const FormDataModel = require('../Backend/Model/FormDataModel');
const UnverifiedUser = require('../Backend/Model/UnverifiedUser'); // Adjust path as needed
const PitchUsModel = require('../Backend/Model/PitchUsModel');
const SpackWithSalesModel = require('../Backend/Model/SpeakWithSalesModel');

app.use(express.json());
app.use(cors());
app.use(express.static("details"));

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Database is connected'))
  .catch((err) => console.log('Database is not connected', err));

  const port=process.env.PORT;

app.post('/SignUp', async (req, res) => {
  const { email, pass, aws } = req.body;

  try {
    const existingUser = await SignUpModel.findOne({ email });

    if (existingUser) {
      console.log('User already exists:', existingUser);
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new SignUpModel({
      email,
      pass, // Store the plain text password
      aws: aws || null,
    });

    await user.save();
    console.log('User registered successfully:', user);
    res.json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error in /SignUp:', err);
    res.status(500).json({ message: 'Error saving data', error: err });
  }
});

app.post('/SignIn', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Sign-In Request:', { email, password });

    const user = await SignUpModel.findOne({ email });

    if (user) {
      console.log('User Found:', user);
      if (user.pass === password) { // Compare plain text passwords
        res.json({ email: user.email });
      } else {
        console.log('Password mismatch');
        res.status(400).json({ message: 'Invalid email or password' });
      }
    } else {
      console.log('User not found');
      res.status(400).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    console.error('Error in /SignIn:', err);
    res.status(500).json({ message: 'Error signing in', error: err });
  }
});

app.post("/Boarding", async (req, res) => {
  const newBoarding = new BoardingModel({
    name: req.body.name,
    OrganisationName: req.body.OrganisationName,
    email: req.body.email,
    phone: req.body.phone
  });
  try {
    await newBoarding.save({ validateBeforeSave: false });
    res.json({ message: "OnBoarding data Saved" });
  } catch (err) {
    console.error('Error in /Boarding:', err);
    res.status(500).json({ message: "Error saving data", error: err });
  }
});

app.post("/ChatBot", async (req, res) => {
  const { name, email, contactNumber, companyName } = req.body;

  if (!name && !email && !contactNumber && !companyName) {
    return res.status(400).json({ message: 'At least one field is required' });
  }

  const dataModel = new CformModel({
    name,
    email,
    contactNumber,
    companyName
  });

  try {
    await dataModel.save();
    res.json({ message: "Data Saved" });
  } catch (err) {
    console.error('Error in /Cform:', err);
    res.status(500).json({ message: "Error saving data", error: err });
  }
});




// Set up Multer for file storage
const catstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './details');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, 'dpic_' + Date.now() + '.' + ext);
  }
});

const catfilter = (req, file, cb) => {
  const ext = file.mimetype.split('/')[1];
  if (ext === 'jpg' || ext === 'png' || ext === 'jpeg' || ext === 'gif') {
    cb(null, true);
  } else {
    cb(new Error('Invalid Pic'), false);
  }
};

const UploadCatImg = multer({
  storage: catstorage,
  fileFilter: catfilter
});

// Route for Form submission
app.post('/Form', UploadCatImg.single('dpic'), async (req, res) => {
  const {
    IOPS_Threshold_for_Scaling,
    Expected_Peak_IOPS,
    Dynamic_IOPS_Configuration,
    frequency,
    time,
    Default_VPC,
    Security_Group_Name,
    Placement_Group_Name,
    AWS_Region,
    CPU_Threshold_for_Dynamic_IOPS,
    PIOSA_Server_Name,
    PIOSA_Server_Login_Details,
    Accelerated_Server_Name,
    Count_of_EBS_Volumes,
    Total_EBS_Volume_Size,
    VPC_CIDR
  } = req.body;

  const newForm = new FormDataModel({
    IOPS_Threshold_for_Scaling,
    Expected_Peak_IOPS,
    Dynamic_IOPS_Configuration,
    frequency,
    time,
    Default_VPC,
    Security_Group_Name,
    Placement_Group_Name,
    AWS_Region,
    CPU_Threshold_for_Dynamic_IOPS,
    PIOSA_Server_Name,
    PIOSA_Server_Login_Details,
    Accelerated_Server_Name,
    Count_of_EBS_Volumes,
    Total_EBS_Volume_Size,
    VPC_CIDR,
    dpic: req.file ? req.file.path : null // Save file path if available
    
  });

  try {
    await newForm.save();
    res.status(201).json({ message: 'Data Saved.' });
  } catch (err) {
    console.error('Error in /Form:', err);
    res.status(500).json({ message: 'Error saving data', error: err.message });
  }
});





app.post("/ContactUS", async (req, res) => {
  const {
    name, email, phone, CompanyName, country, message
  } = req.body;

  const newForm = new PitchUsModel({
    name, email, phone, CompanyName, country, message
  });

  try {
    await newForm.save();
    res.status(201).json({ message: "Data Saved.." });
  } catch (err) {
    console.error('Error in /PitchUs:', err);
    res.status(500).json({ message: "Error saving data", error: err });
  }
});








app.post("/upload", UploadCatImg.single("dpic"), (req, res) => {
  console.log(req.body);
  console.log(req.file);

  return res.redirect("/");
});

app.listen(port, () => {
  console.log('Server started on port 5000');
});
