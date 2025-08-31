# React Data Table Editor

A lightweight spreadsheet-style table editor built with **React**, supporting:

- 🚀 Lazy loading / infinite scroll from a public JSON endpoint  
- 💾 Local caching of edited data  
- ✏️ Inline cell editing  
- ➕ Add new rows (toolbar or bottom placeholder)  
- ⚡ Smooth performance on large datasets with virtualization  
- ✅ Correctness & stability of core features  

---

## 🔗 Data Source
This project uses the public dataset provided by Microsoft Edge demos:

https://microsoftedge.github.io/Demos/json-dummy-data/5MB.json

## 📚 References
During development, the following resources were referenced:

- TanStack Table Virtualized Infinite Scrolling Example:  
  https://tanstack.com/table/latest/docs/framework/react/examples/virtualized-infinite-scrolling?path=examples%2Freact%2Fvirtualized-infinite-scrolling%2Fsrc%2FmakeData.ts
- Official documentation of TanStack Query, Table, and Virtual
- Material UI (MUI) component library docs

## 📦 Tech Stack

- **React 19 + TypeScript**
- **Vite** – Fast development build tool  
- **MUI (Material UI)** – UI components & styling  
- **TanStack React Query** – Server state management, caching, async fetching  
- **TanStack React Table** – Table rendering, sorting, column management  
- **TanStack React Virtual** – Virtualized list rendering for large datasets  
- **React Hook Form + Zod** – Form handling & schema validation  
- **Emotion** – CSS-in-JS styling solution  

---

## ⚙️ Features

1. **Lazy loading / infinite scroll**  
   - Initial slice rendered  
   - More rows appended as user scrolls  
   - Loading & error states displayed  

2. **Local caching of edits**  
   - Edited values persist while navigating/scrolling  

3. **Inline editing**  
   - Click to edit a cell  
   - Commit on `Enter` / `blur`  
   - Cancel with `Esc`  
   - Validation for required text & enum fields  

4. **Add new row**  
   - Add row via toolbar button  
   - Or add row via "New row" placeholder at bottom  
   - Temporary client ID assigned until persisted  

---

## 🚀 Getting Started

### 1. Clone repository
```bash
git clone https://github.com/your-username/react-data-table-editor.git
cd react-data-table-editor
npm install
npm run dev
