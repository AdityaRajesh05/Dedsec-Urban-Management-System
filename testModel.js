// testModel.js
const mongoose = require('mongoose');
const Report = require('./models/reportModel');

mongoose.connect('mongodb://127.0.0.1:27017/DedSec')
.then(async () => {
    console.log('✅ Connected to DB');
    const reports = await Report.find();
    console.log('Reports count:', reports.length);
    mongoose.disconnect();
})
.catch(err => console.error(err));