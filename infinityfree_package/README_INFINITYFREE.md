# 🚀 InfinityFree-তে SEU Adda আপলোড ও কনফিগারেশন নির্দেশিকা

এই ফোল্ডারের ফাইলগুলো সরাসরি **InfinityFree**-এর `htdocs` ফোল্ডারে আপলোড করে আপনি সম্পূর্ণ ফ্রিতে আপনার নিজস্ব পিএইচপি ও মাইএসকিউএল (MySQL) সার্ভারে SEU Adda চালাতে পারবেন!

---

## 📋 ধাপ ১: InfinityFree-তে MySQL ডাটাবেস তৈরি করুন

১. আপনার [InfinityFree Client Area](https://app.infinityfree.com/) থেকে আপনার একাউন্টের **Control Panel (vPanel)**-এ লগইন করুন।
২. **MySQL Databases** অপশনে যান।
৩. একটি নতুন ডাটাবেস তৈরি করুন (যেমন: `seu_adda`)।
৪. আপনার ডাটাবেসের তথ্যগুলো নোট করে রাখুন:
   - **MySQL Hostname:** (যেমন: `sql300.infinityfree.com`)
   - **MySQL Database Name:** (যেমন: `if0_38123456_seu_adda`)
   - **MySQL Username:** (যেমন: `if0_38123456`)
   - **MySQL Password:** (আপনার vPanel পাসওয়ার্ড)

---

## 📋 ধাপ ২: phpMyAdmin-এ টেবিল তৈরি (SQL Import)

১. vPanel-এর **phpMyAdmin** বাটনে ক্লিক করে phpMyAdmin খুলুন।
২. বাম পাশ থেকে আপনার নতুন তৈরি করা ডাটাবেসের নামের উপর ক্লিক করুন।
৩. উপরের মেনু থেকে **Import** ট্যাবে ক্লিক করুন।
৪. `Choose File` বাটনে চাপ দিয়ে এই প্যাকেজের `api/schema.sql` ফাইলটি নির্বাচন করুন।
৫. নিচে স্ক্রোল করে **Import** বা **Go** বাটনে চাপ দিন।
   - সব টেবিল (`rooms`, `participants`, `messages`, `confessions`) স্বয়ংক্রিয়ভাবে তৈরি হয়ে যাবে!

---

## 📋 ধাপ ৩: `api/config.php` ফাইলে ডাটাবেসের তথ্য বসান

আপনার কম্পিউটারে থাকা `api/config.php` ফাইলটি যেকোনো এডিটর (Notepad বা VS Code) দিয়ে খুলুন এবং ধাপ ১-এ পাওয়া তথ্যগুলো বসিয়ে সেভ করুন:

```php
define('DB_HOST', 'sql300.infinityfree.com'); // আপনার MySQL Hostname
define('DB_NAME', 'if0_38123456_seu_adda');    // আপনার Database Name
define('DB_USER', 'if0_38123456');             // আপনার Database Username
define('DB_PASS', 'YourPasswordHere');         // আপনার vPanel পাসওয়ার্ড
```

---

## 📋 ধাপ ৪: InfinityFree-র `htdocs` ফোল্ডারে ফাইল আপলোড করুন

১. InfinityFree vPanel থেকে **Online File Manager** (Monsta FTP) খুলুন।
২. **`htdocs`** ফোল্ডারের ভেতরে প্রবেশ করুন।
৩. যদি আগে থেকে কোনো ডিফল্ট ফাইল (যেমন `index2.html` বা ডামি ফাইল) থাকে, তা মুছে দিন।
৪. এই `infinityfree_package` ফোল্ডারের ভেতরের **সব ফাইল ও ফোল্ডার** ড্র্যাগ-অ্যান্ড-ড্রপ করে `htdocs`-এর ভেতরে আপলোড করে দিন:
   - `index.html`
   - `.htaccess`
   - `assets/`
   - `images/`
   - `api/`
৫. আপলোড শেষ হলে আপনার InfinityFree ওয়েবসাইট লিংক ব্রাউজারে খুলুন (যেমন: `https://yourdomain.infinityfreeapp.com`)!

---

## ✨ কী কী স্বয়ংক্রিয়ভাবে কাজ করবে?
- **রুম ও চ্যাট:** সব কিছু আপনার নিজস্ব MySQL ডাটাবেসে সেভ হবে।
- **২ ঘণ্টার অটো-ডিলিট:** প্রতিটি আড্ডা রুম তৈরির ঠিক ২ ঘণ্টা পর ডাটাবেস থেকে স্বয়ংক্রিয়ভাবে সম্পূর্ণ মুছে যাবে!
- **সব ফিচার:** ক্যাম্পাসের আর্টওয়ার্ক, ৩৫ ক্যারেক্টার, দিন/রাত, বৃষ্টি, অডিও রেডিও, ফটো কার্ড এবং কনফেশন ওয়াল সব কিছু আগের মতোই ১০০% লাইভ কাজ করবে।
