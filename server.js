const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware - form data process করার জন্য
app.use(bodyParser.urlencoded({ extended: true }));

// ফর্ম সার্ভ করার route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'form.html')); // Ensure form.html নাম ঠিক আছে
});

// ফর্ম সাবমিট হ্যান্ডল করার route
app.post('/register', (req, res) => {
  const formData = req.body;

  // পুরাতন ডেটা পড়া (ফাইল থাকলে)
  let existingData = [];
  if (fs.existsSync('data.json')) {
    const data = fs.readFileSync('data.json');
    existingData = JSON.parse(data);
  }

  // নতুন ডেটা যোগ করা
  existingData.push(formData);

  // নতুনভাবে JSON ফাইলে লেখা
  fs.writeFileSync('data.json', JSON.stringify(existingData, null, 2));

  // ধন্যবাদ পেজে রিডাইরেক্ট
  res.redirect('/thank-you');
});

// ধন্যবাদ পেজ
app.get('/thank-you', (req, res) => {
  res.send("<h2>ধন্যবাদ! আপনার রেজিস্ট্রেশন সফল হয়েছে।</h2><a href='/'>ফর্মে ফিরে যান</a>");
});

// সব রেজিস্ট্রেশন ডেটা দেখার পেইজ
app.get('/data', (req, res) => {
  if (fs.existsSync('data.json')) {
    const data = fs.readFileSync('data.json');
    const allData = JSON.parse(data);

    let html = `<h2>All Registered Students</h2><ul>`;
    allData.forEach((item, index) => {
      html += `<li><strong>${index + 1}.</strong> ${item.name}, Phone: ${item.phone}, Roll: ${item.roll}, Reg: ${item.reg}, Year: ${item.year}</li>`;
    });
    html += `</ul>`;
    res.send(html);
  } else {
    res.send('<h3>কোনো ডেটা পাওয়া যায়নি!</h3>');
  }
});

// সার্ভার চালু করা
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
