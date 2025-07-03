🧾 TechSols

This project is a simple item catalog web application with two primary pages: **View Items** and **Add Items**. It allows users to add new fashion/sports items with images and view item listings in an interactive interface.

---

## 🚀 Features

### 📄 Add Items Page
- Add new item with:
  - **Item Name**
  - **Item Type** (e.g., Shirt, Pant, Shoes, Sports Gear)
  - **Description**
  - **Cover Image**
  - **Additional Images**
- Shows success message on submission:  
  ✅ *"Item successfully added"*

### 🗃 View Items Page
- Displays all added items with:
  - Cover Image
  - Item Name
- Clicking on an item opens a modal/lightbox/drawer with:
  - Full details of the item
  - Carousel of all images (cover + additional)
  - **"Enquire"** button

---

## 💎 Bonus Features (Implemented if applicable)
- [ ] Backend API integration to **fetch/upload** items (MongoDB/Express.js or Firebase)
- [ ] Send **email** to a static email-id upon clicking **"Enquire"** using services like EmailJS or Nodemailer

---

## 🛠️ Tech Stack

| Layer      | Technology          |
|------------|---------------------|
| Frontend   | React.js / Tailwind CSS |
| Backend (Optional) | Node.js + Express / Firebase |
| Image Upload (Optional) | Cloudinary / Firebase Storage |
| Email (Optional) | EmailJS / Nodemailer |
| State Management | React State / Context API |

---

## 📁 Folder Structure

item-catalog/
├── public/
├── src/
│ ├── components/
│ │ ├── ItemForm.jsx
│ │ ├── ItemList.jsx
│ │ ├── ItemModal.jsx
│ ├── pages/
│ │ ├── AddItem.jsx
│ │ ├── ViewItems.jsx
│ ├── App.jsx
│ ├── index.js
│ └── styles/
├── backend/ (optional)
│ ├── server.js
│ └── routes/
├── .env (for API keys if needed)
├── package.json

yaml
Copy
Edit

---

## ✅ How to Run the Project

### 1. Clone Repository
```bash
git clone https://github.com/your-username/item-catalog.git
cd item-catalog
2. Install Dependencies
bash
Copy
Edit
npm install
3. Start Frontend
bash
Copy
Edit
npm start
4. (Optional) Start Backend
bash
Copy
Edit
cd backend
npm install
node server.js
✉️ Enquiry Email Setup (Optional)
To enable the "Enquire" button to send an email:

Use EmailJS (client-side)

Or configure Nodemailer (server-side)

📸 UI Features
Form validation

Responsive design

Image preview before upload

Carousel for viewing multiple images

Modal or Drawer UI for detailed view

⏰ Deadline
Submission Deadline: Sunday EoD
Submitting earlier gives higher priority.

📞 Post Submission
After you submit, you may be asked to walk through your code.

📬 Contact
If you have questions about the assignment, please reach out via the method your recruiter provided.

📄 License
This project is for educational and recruitment purposes only.
