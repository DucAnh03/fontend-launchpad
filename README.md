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
│ ├── favicon.ico
│ └── index.html
│
├── src/
│ ├── assets/ # Static assets (images, icons, fonts, etc.)
│ │ ├── react.svg
│ │ └── trello.svg
│ │
│ ├── components/ # Reusable, “dumb” UI components
│ │ ├── AppBar/
│ │ │ ├── AppBar.jsx
│ │ │ └── index.js
│ │ │
│ │ ├── Button/
│ │ │ ├── Button.jsx
│ │ │ └── index.js
│ │ │
│ │ └── … # Other generic components (Card, Modal, etc.)
│ │
│ ├── features/ # High-level “feature” folders (page‐level UIs & logic)
│ │ ├── Auth/
│ │ │ ├── Login.jsx
│ │ │ ├── Register.jsx
│ │ │ └── index.js # Re‐export for cleaner imports
│ │ │
│ │ ├── Users/
│ │ │ ├── UserList.jsx
│ │ │ ├── UserDetail.jsx
│ │ │ └── index.js
│ │ │
│ │ └── Boards/
│ │ ├── BoardBar.jsx
│ │ ├── BoardContent.jsx
│ │ └── index.js
│ │
│ ├── store/ # Global state (Redux slices or Context providers)
│ │ ├── slices/ # If you’re using Redux Toolkit
│ │ │ ├── authSlice.js
│ │ │ ├── boardSlice.js
│ │ │ └── userSlice.js
│ │ │
│ │ ├── contexts/ # If you’re using React Context instead
│ │ │ ├── AuthContext.jsx
│ │ │ └── BoardContext.jsx
│ │ │
│ │ └── store.js # Combine reducers or wrap context providers
│ │
│ ├── hooks/ # Custom hooks (useAuth, useBoard, etc.)
│ │ ├── useAuth.js
│ │ └── useBoard.js
│ │
│ ├── services/ # API layer / network calls
│ │ ├── apiClient.js
│ │ ├── authService.js
│ │ └── boardService.js
│ │
│ ├── utils/ # Pure helper functions (formatDate, helpers, etc.)
│ │ ├── formatDate.js
│ │ └── helpers.js
│ │
│ ├── App.jsx # Main App component (routes, providers, etc.)
│ ├── index.jsx # ReactDOM.render(...) or createRoot
│ └── index.css # Tailwind’s @tailwind directives + global styles
│
├── .env # Environment variables
├── .gitignore
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── README.md
