# React & Tailwind CSS Starter Pack

This is a starter pack for creating React projects with Tailwind CSS configured. It uses React version **18.2** and Tailwind CSS version **3.2**.

## Usage

This starter pack includes a basic setup for using **Tailwind CSS with React**. To start building your own components and styles, follow these steps:

1. Clone the repository to your local machine.

   ```sh
   git clone https://github.com/thepranaygupta/react-tailwind-css-starter-pack.git
   ```

1. Install the required packages.

   ```sh
   cd react-tailwind-css-starter-pack
   npm install
   ```

1. Start the development server.
   ```sh
   npm start
   ```
1. Open the project in your browser at [`http://localhost:3000`](http://localhost:3000) to view your project.
1. Create your React components and add your styles using Tailwind classes. You can also create new CSS files and import them into your components.

The project is set up to use `postcss-cli` to process your CSS files. You can add your own `tailwind.config.js` file to customize your Tailwind setup.

## Contributing

Contributions are welcome! If you have any suggestions or find any issues, please feel free to open an issue or a pull request.

my-react-app/
├── public/
│ ├── index.html
│ └── favicon.ico
│
├── src/
│ ├── assets/
│ │ ├── react.svg
│ │ └── trello.svg
│ │
│ ├── components/ # Common reusable components
│ │ ├── AppBar/
│ │ │ ├── AppBar.jsx
│ │ │ └── index.js
│ │ │
│ │ ├── Button/
│ │ │ ├── Button.jsx
│ │ │ └── index.js
│ │ │
│ │ ├── Card/
│ │ │ ├── Card.jsx
│ │ │ └── index.js
│ │ │
│ │ └── ModeSelect/
│ │ ├── ModeSelect.jsx
│ │ └── index.js
│ │
│ ├── pages/ # Feature modules (page-level)
│ │ ├── Auth/
│ │ │ ├── Login.jsx
│ │ │ ├── Register.jsx
│ │ │ └── index.js
│ │ │
│ │ ├── Users/
│ │ │ ├── UserList/
│ │ │ │ ├── UserList.jsx
│ │ │ │ └── index.js
│ │ │ │
│ │ │ ├── UserDetail/
│ │ │ │ ├── UserDetail.jsx
│ │ │ │ └── index.js
│ │ │ │
│ │ │ └── index.js
│ │ │
│ │ └── Boards/
│ │ ├── BoardBar/
│ │ │ ├── BoardBar.jsx
│ │ │ └── index.js
│ │ │
│ │ ├── BoardContent/
│ │ │ ├── BoardContent.jsx
│ │ │ ├── index.js
│ │ │ └── \_id.jsx # (Next.js) hoặc chỉ dùng BoardContent.jsx với React Router
│ │ │
│ │ └── index.js
│ │
│ ├── redux/ # (Nếu dùng Redux)
│ │ ├── store.js
│ │ └── slices/
│ │ ├── authSlice.js
│ │ ├── boardSlice.js
│ │ └── userSlice.js
│ │
│ ├── contexts/ # (Nếu dùng React Context)
│ │ ├── AuthContext.jsx
│ │ └── BoardContext.jsx
│ │
│ ├── hooks/ # Custom hooks
│ │ ├── useAuth.js
│ │ └── useBoard.js
│ │
│ ├── services/ # API layer
│ │ ├── apiClient.js
│ │ ├── authService.js
│ │ └── boardService.js
│ │
│ ├── utils/
│ │ ├── formatDate.js
│ │ └── helpers.js
│ │
│ ├── App.jsx
│ ├── index.jsx
│ ├── index.css
│ └── reportWebVitals.js
│
├── .env
├── .gitignore
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── README.md
