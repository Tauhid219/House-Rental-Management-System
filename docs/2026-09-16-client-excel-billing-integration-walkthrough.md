# Walkthrough: Client Excel Rent Invoice Integration (ক্লায়েন্ট এক্সেল বিলিং ইন্টিগ্রেশন)

**Date:** 2026-09-16  
**Reference Document:** [`docs/9. RENT SEP  2026.xlsm - Rent Invoice.csv`](file:///C:/xampp/htdocs/Practice/House-Rental-Management-System/docs/9.%20RENT%20SEP%20%202026.xlsm%20-%20Rent%20Invoice.csv)  
**System:** Skyline Heights / House Rental Management System

---

## ১. ভূমিকা ও উদ্দেশ্য (Overview & Objective)

ক্লায়েন্ট তার বাড়িভাড়ার হিসাব ও রসিদ তৈরির জন্য যে এক্সেল ফাইলটি ব্যবহার করতেন ([`9. RENT SEP  2026.xlsm - Rent Invoice.csv`](file:///C:/xampp/htdocs/Practice/House-Rental-Management-System/docs/9.%20RENT%20SEP%20%202026.xlsm%20-%20Rent%20Invoice.csv)), সেটি গভীরভাবে বিশ্লেষণ করে সেই অনুযায়ী আমাদের সফটওয়্যারে ডেটাবেজ স্কিমা, কন্ট্রোলার লজিক, ভ্যালিডেশন, ইনভয়েস তৈরি এবং সাইড-বাই-সাইড ডাবল-কপি প্রিন্ট স্লিপ (Dual-Copy Bill Slip) সফলভাবে যুক্ত করা হয়েছে।

---

## ২. ক্লায়েন্টের এক্সেল ফাইলের উপাদান বিশ্লেষণ (Analysis of Client's Excel)

ক্লায়েন্টের এক্সেল শিটে প্রতি মাসের ভাড়ার বিলে নির্দিষ্ট কিছু উপাদান ও বিন্যাস বিদ্যমান ছিল:
1. **হেডার ও প্রোপার্টি ঠিকানা:**
   - `HOUSE RENT BILL`
   - `PLOT NO.54, ROAD NO. 10, SECTOR NO. 10`
   - `UTTARA, MODEL TOWN, DHAKA-1230`
2. **ডাবল-কপি লেআউট (Dual-Copy Side-by-Side):**
   - প্রতি A4 পাতায় পাশাপাশি দুটি স্লিপ: বামে **Tenant Copy** এবং ডানে **Office Copy**।
3. **ভাড়াটিয়া ও ফ্ল্যাটের তথ্য:**
   - `Serial No.` (ক্রমিক নম্বর)
   - `Dated:` বিল তৈরির তারিখ (যেমন: `2-Sep-26`)
   - `Flat No.` (যেমন: `54/1`, `54/2`, `54/6`, `54/7`, `54/8`, `54/9`, `54/10`, `54/B`, `54/A`)
   - `Resident Name` (ভাড়াটিয়ার নাম)
   - `Date of Occupation:` ফ্ল্যাটে ওঠার / চুক্তির শুরুর তারিখ (যেমন: `9/1/2024`, `1/1/2024`, `01.05.2024`)
4. **বিল আইটেমস (৬টি মূল ক্যাটাগরি):**
   - **Monthly Rent** (মাসিক ফ্ল্যাট ভাড়া)
   - **GAS Bill** (প্রিপেইড কার্ড — "Prepaid", 0.00 / ` - `)
   - **Electric Bill** (প্রিপেইড মিটার — "Prepaid", 0.00 / ` - `)
   - **Water Bill** (আলাদা ফ্ল্যাটভিত্তিক পানি বিল, যেমন: ৳১,০০০ থেকে ৳১,৬০০)
   - **Service Charge** (আবাসিক ফ্ল্যাটের জন্য নির্দিষ্ট সার্ভিস চার্জ: ৳৩,৫০০)
   - **Others if any / Advance adjustment / Shop rent** (যেমন: দোকান ভাড়া `Shop rent JULY 26: ৳5,000` বা বকেয়া/এডভান্স কর্তন)
   - **Total Taka** (সর্বমোট টাকা)
   - **Total in Words** (কথায় টাকা: এক্সেলে `=SpellNumber(Total)` ম্যাক্রো ছিল)
5. **বিল পরিশোধের নিয়ম ও রসিদ অংশ:**
   - `REQUESTED TO PAY BILL BY 7TH EACH MONTH.`
   - `Paid On: ________________________`
   - `House Owner Signature` এবং `Dated`

---

## ৩. প্রজেক্টে বাস্তবায়িত পরিবর্তনসমূহ (Changes Implemented)

### ক. ডেটাবেজ মাইগ্রেশন (Database Schema)
- নতুন মাইগ্রেশন তৈরি ও চালানো হয়েছে:
  [`database/migrations/2026_09_16_000001_add_client_billing_fields_to_rent_invoices_and_leases.php`](file:///C:/xampp/htdocs/Practice/House-Rental-Management-System/database/migrations/2026_09_16_000001_add_client_billing_fields_to_rent_invoices_and_leases.php)
  - `rent_invoices` টেবিলে যোগ করা হয়েছে:
    - `water_bill` (decimal 10,2)
    - `service_charge` (decimal 10,2)
    - `gas_bill` (decimal 10,2)
    - `gas_type` (string, ডিফল্ট 'prepaid')
    - `electricity_bill` (decimal 10,2)
    - `electricity_type` (string, ডিফল্ট 'prepaid')
    - `advance_adjustment` (decimal 10,2)
    - `other_charges_description` (string, nullable)
  - `leases` টেবিলে ফ্ল্যাটের রেকারিং ডিফল্ট ফিল্ড যুক্ত করা হয়েছে:
    - `default_water_bill`, `default_service_charge` (ডিফল্ট ৩৫০০), `default_gas_type`, `default_electricity_type`।

### খ. কথায় টাকা রূপান্তরকারী হেল্পার (Number to Words Helper)
- তৈরি করা হয়েছে: [`app/Helpers/NumberToWordsHelper.php`](file:///C:/xampp/htdocs/Practice/House-Rental-Management-System/app/Helpers/NumberToWordsHelper.php)
  - এটি যেকোনো টাকার অংককে বাংলাদেশি সংখ্যা গণনা রীতিতে (কোটি, লাখ, হাজার, শত) নির্ভুল কথায় রূপান্তর করে (যেমন: `Twenty Thousand Six Hundred Taka Only`)।
  - এর ফলে এক্সেলের `#NAME?` ত্রুটিটি স্থায়ীভাবে সমাধান হয়েছে।

### গ. মডেল ও রিকোয়েস্ট ভ্যালিডেশন (Models & Form Requests)
- [RentInvoice.php](file:///C:/xampp/htdocs/Practice/House-Rental-Management-System/app/Models/RentInvoice.php): নতুন কলামগুলোর Fillable, Casts এবং `total_in_words` এক্সসের যুক্ত করা হয়েছে।
- [Lease.php](file:///C:/xampp/htdocs/Practice/House-Rental-Management-System/app/Models/Lease.php): ডিফল্ট ইউটিলিটি চার্জের Fillable ও Casts যুক্ত।
- [StoreRentInvoiceRequest.php](file:///C:/xampp/htdocs/Practice/House-Rental-Management-System/app/Http/Requests/Admin/StoreRentInvoiceRequest.php) ও [BatchGenerateInvoiceRequest.php](file:///C:/xampp/htdocs/Practice/House-Rental-Management-System/app/Http/Requests/Admin/BatchGenerateInvoiceRequest.php): নতুন ফিল্ডগুলোর ইনপুট ভ্যালিডেশন রুলস যুক্ত।

### ঘ. কন্ট্রোলার ও বিজনেস লজিক (Controller)
- [RentInvoiceController.php](file:///C:/xampp/htdocs/Practice/House-Rental-Management-System/app/Http/Controllers/Admin/RentInvoiceController.php):
  - বিলিংয়ের সময় ডিফল্ট ডিউ ডেট স্বয়ংক্রিয়ভাবে মাসের **৭ তারিখ** হিসেবে সেট করা।
  - প্রতিটি ফ্ল্যাটের পানি বিল, সার্ভিস চার্জ, গ্যাস/বিদ্যুৎ টাইপ এবং অগ্রিম সমন্বয় হিসাব করে স্বয়ংক্রিয়ভাবে `total_payable` নির্ধারণ করা।
  - ব্যাচ জেনারেশনের সময় প্রতিটি ফ্ল্যাটের নিজস্ব ডিফল্ট রেকারিং চার্জ স্বয়ংক্রিয় প্রয়োগের সুবিধা।

### ঙ. ফ্রন্টএন্ড UI ও ডাবল-কপি প্রিন্ট স্লিপ (Frontend & Print Slip)
- [create.tsx](file:///C:/xampp/htdocs/Practice/House-Rental-Management-System/resources/js/pages/admin/invoices/create.tsx): ক্লায়েন্টের ৬টি আইটেম অনুযায়ী ইনপুট ফর্ম, প্রিপেইড চেকবক্স এবং লাইভ টোটাল ক্যালকুলেটর যুক্ত।
- [show.tsx](file:///C:/xampp/htdocs/Practice/House-Rental-Management-System/resources/js/pages/admin/invoices/show.tsx):
  - **View Mode Switcher:**
    1. **Client Dual-Copy Slip (Excel Format):** হুবহু ক্লায়েন্টের এক্সেল শিটের ডিজাইন—এক পাতায় পাশাপাশি **Tenant Copy** ও **Office Copy** (মাঝে `✂ CUT HERE` ড্যাশড লাইন সহ)। উত্তরা প্লট ৫৪ ঠিকানা, সিরিয়াল, ফ্ল্যাট নং, ভাড়াটিয়ার নাম, ওঠার তারিখ, আইটেমভিত্তিক বিল, মোট টাকা, কথায় টাকা, ৭ তারিখের পরিশোধ নোটিশ ও স্বাক্ষরের স্থান সহ।
    2. **Formal Full Invoice:** প্রতিষ্ঠানের স্ট্যান্ডার্ড অফিশিয়াল ফুল-পেজ ইনভয়েস।
  - যেকোনো একটি ভিউ নির্বাচন করে **Print Bill Slip / PDF** চাপলে ব্রাউজারে নিখুঁতভাবে A4 ফরম্যাটে প্রিন্ট হবে।

### চ. ক্লায়েন্টের ৯টি ইউনিটের আসল ডেটা সিডার (Client Data Seeder)
- তৈরি করা হয়েছে: [`database/seeders/ClientUttaraPropertySeeder.php`](file:///C:/xampp/htdocs/Practice/House-Rental-Management-System/database/seeders/ClientUttaraPropertySeeder.php)
  - ক্লায়েন্টের এক্সেল ফাইলের সব কয়টি (৯টি) ফ্ল্যাট, ভাড়াটিয়া ও সেপ্টেম্বর ২০২৬-এর ইনভয়েস সফলভাবে সিড করা হয়েছে:
    1. **54/1** — LUTHFOR RAHMAN: ভাড়া ১৬,০০০ + পানি ১,১০০ + সার্ভিস ৩,৫০০ = **২০,৬০০/-**
    2. **54/2** — MR. MONJURUL HAQUE: ভাড়া ১৬,০০০ + পানি ১,০০০ + সার্ভিস ৩,৫০০ = **২০,৫০০/-**
    3. **54/6** — MR. REZAUL KARIM: ভাড়া ১৫,৫০০ + পানি ১,০০০ + সার্ভিস ৩,৫০০ = **২০,০০০/-**
    4. **54/7** — MR. HAMIDUR RAHMAN: ভাড়া ১৫,৫০০ + পানি ১,৫০০ + সার্ভিস ৩,৫০০ = **২০,৫০০/-**
    5. **54/8** — MR. NAFIN AHMED ABIR: ভাড়া ১৬,০০০ + পানি ১,১০০ + সার্ভিস ৩,৫০০ = **২০,৬০০/-**
    6. **54/9** — MD. JAHIDUL ISLAM: ভাড়া ১৬,০০০ + পানি ১,৬০০ + সার্ভিস ৩,৫০০ = **২১,১০০/-**
    7. **54/10** — MR. LEYAKAT HOSSAIN: ভাড়া ১৬,০০০ + পানি ১,৬০০ + সার্ভিস ৩,৫০০ = **২১,১০০/-**
    8. **54/B** — MS MISKAT JERIN EMA: ভাড়া ১৩,০০০ + পানি ১,৩০০ + সার্ভিস ৩,৫০০ = **১৭,৮০০/-**
    9. **54/A** — MD DELOWER HOSSAIN: ভাড়া ২,০০০ + দোকান ভাড়া ৫,০০০ = **৭,০০০/-**

---

## ৪. যাচাই ও ফলাফল (Verification & Results)

1. **ডেটাবেজ রেকর্ড যাচাই:**
   - ডেটাবেজের সেপ্টেম্বর ২০২৬-এর ৯টি বিলের প্রতিটি অ্যামাউন্ট এবং কথায় টাকার টেক্সট ক্লায়েন্টের এক্সেল শিটের সাথে ১০০% মিলেছে।
2. **ফ্রন্টএন্ড বিল্ড:**
   - `npm.cmd run build` কমান্ড চালিয়ে সমস্ত প্রোডাকশন বান্ডেল সফলভাবে কম্পাইল করা হয়েছে (০ এরর)।
3. **ইউজার এক্সপেরিয়েন্স:**
   - ইনভয়েস ভিউ পেজে গিয়ে সরাসরি এক্সেল স্টাইলের ডাবল স্লিপ দেখা এবং ১-ক্লিকে প্রিন্ট নেওয়া যাচ্ছে।
