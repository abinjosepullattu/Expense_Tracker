# 🪙 Personal Finance & Expense Tracker

A modern, responsive, and feature-rich full-stack application designed to help users track transactions, manage budgets proactively, and generate financial summaries.

🚀 **Deploy Status:** Fully live in production!

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=FFD62B)
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

💡 **Live Website Link:** [https://expense-trackiee.vercel.app/](https://expense-trackiee.vercel.app/)

---

## ✨ Features

- **📊 Interactive Financial Dashboard:** Dynamic charts showing income vs. expense ratios, category-wise breakdowns, and history logs.
- **🛍️ Custom Category Creator:** Add, edit, or delete personal ledger categories dynamically right from the category dropdown list.
- **💱 Global Multi-Currency Support:** Handles INR (₹), USD ($), EUR (€), GBP (£), CAD ($), AUD ($), and JPY (¥) dynamically throughout setting screens and metrics.
- **📋 Synchronous Financial Exports:** Convert logs to highly formatted **PDF ledgers**, **Excel worksheets** via `openpyxl`, or **CSV files**.

---

## 📁 Repository Structure

```text
Expense_Tracker/
├── frontend/             # React (Vite) Single Page Application
│   ├── src/
│   │   ├── api/          # Axios AxiosInstance settings pointing to VITE_API_URL
│   │   ├── pages/        # Dashboard, Profile, and Transaction forms
│   │   └── utils/        # Global Localized Currency Formatters
│   └── package.json
│
├── backend/              # Django REST Framework API
│   ├── core/             # Application wsgi settings & routes (dev vs production configurations)
│   ├── accounts/         # Authentication endpoints & auto-category generation via signals
│   ├── transactions/     # Transaction schemas & uploads
│   ├── budgets/          # Budget trackers
│   ├── reports/          # PDF, Excel, and CSV synchronous generator pipelines
│   └── requirements.txt
```

---

## 🛠️ Local Development Setup

### 1. Prerequisites
- Python 3.11.x
- React.js 18+

### 2. Backend Setup
```bash
# Go to Django venv
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations & seed db
python manage.py migrate

# Run development server
python manage.py runserver
```

### 3. Frontend Setup
```bash
# Go to client folder
cd frontend

# Install package modules
npm install

# Run the dev hot reloader
npm run dev
```

---

## 🔐 Environment Configurations

### Backend (`.env` in `backend/`):
```ini
DEBUG=True
DATABASE_URL=your_postgres_database_url
SECRET_KEY=your_secure_random_production_key
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend (`.env` in `frontend/`):
```ini
VITE_API_URL=http://localhost:8000/api
```
