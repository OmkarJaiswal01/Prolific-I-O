const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();

// Use absolute paths to avoid deployment issues
const SignUpModel = require(path.resolve(__dirname, '../Backend/Model/SignUpModel'));
const BoardingModel = require(path.resolve(__dirname, '../Backend/Model/BoardingModel'));
const CformModel = require(path.resolve(__dirname, '../Backend/Model/CformModel'));
const FormDataModel = require(path.resolve(__dirname, '../Backend/Model/FormDataModel'));
const PitchUsModel = require(path.resolve(__dirname, '../Backend/Model/PitchUsModel'));

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../details'))); // Use path.join for better compatibility

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database is connected'))
  .catch((err) => console.log('Database connection error:', err));

const port = process.env.PORT || 5000;

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
    res.status(500).json({ message: 'Error saving data', error: err.message });
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
    res.status(500).json({ message: 'Error signing in', error: err.message });
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
    res.status(500).json({ message: "Error saving data", error: err.message });
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
    console.error('Error in /ChatBot:', err);
    res.status(500).json({ message: "Error saving data", error: err.message });
  }
});

// Set up Multer for file storage
const catstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../details')); // Use path.join for better compatibility
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, 'dpic_' + Date.now() + '.' + ext);
  }
});

const catfilter = (req, file, cb) => {
  const ext = file.mimetype.split('/')[1];
  if (['jpg', 'png', 'jpeg', 'gif'].includes(ext)) {
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
    console.error('Error in /ContactUS:', err);
    res.status(500).json({ message: "Error saving data", error: err.message });
  }
});

app.post("/upload", UploadCatImg.single("dpic"), (req, res) => {
  console.log(req.body);
  console.log(req.file);

  return res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
