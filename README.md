# Next.js Dashboard & Home Project

A modern **Next.js 15+** frontend application built with the App Router, featuring a protected dashboard with JWT authentication, invoice management, and a public home page.

## 🚀 Features

-  **Next.js 15** with App Router
-  **TypeScript** for type safety
-  **Tailwind CSS v4** for styling
-  **JWT Authentication** (Access & Refresh tokens)
-  **Protected Dashboard Routes**
-  **Invoice Management**
-  **Reusable UI Components** (Radix UI primitives)
-  **API Middleware/Proxy**
-  **Responsive Design**

---

## 📁 Project Structure

```
├── .next/                    # Next.js build output
├── node_modules/             # Dependencies
├── public/                   # Static assets
│   └── favicon.ico
├── src/
│   ├── actions/              # Server actions
│   │   ├── auth.ts          # Authentication (login, logout, getCurrentUser)
│   │   └── invoice-actions.ts # Invoice CRUD operations
│   ├── app/                  # App Router pages
│   │   ├── (home)/          # Public home page route group
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   ├── dashboard/       # Protected dashboard routes
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   ├── layout.tsx       # Root layout
│   │   ├── not-found.tsx    # 404 page
│   │   └── globals.css      # Global styles
│   ├── components/          # React components
│   │   ├── dashboard/       # Dashboard-specific components
│   │   │   ├── DashboardHeader.tsx
│   │   │   └── ...
│   │   ├── home/           # Home page components
│   │   └── ui/             # Reusable UI components
│   │       ├── button.tsx
│   │       ├── avatar.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── dialog.tsx
│   │       └── ...
│   └── lib/                # Utilities
│       └── proxy.ts        # API middleware/proxy
├── .env                    # Environment variables
├── .gitignore             # Git ignore rules
├── components.json        # shadcn/ui config
├── eslint.config.mjs      # ESLint configuration
├── next.config.ts         # Next.js configuration
├── next-env.d.ts          # Next.js TypeScript declarations
├── package.json           # Dependencies and scripts
├── package-lock.json      # Lock file
├── postcss.config.mjs     # PostCSS configuration
├── README.md              # Project documentation
└── tsconfig.json          # TypeScript configuration
```

---

## 🛠️ Installation

### Prerequisites

- **Node.js** 18+ and **npm**
- **Git**

### Steps

1. **Clone the repository**

```bash
git clone https://github.com/SumanPoU/frontend.git
cd frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
API_BASE_URL=http://localhost:3000

# Add other environment variables as needed
```

4. **Run the development server**

```bash
npm run dev
```

The application will be available at **http://localhost:3001**

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3001 |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🔐 Authentication

This project uses **JWT-based authentication** with:

- **Access tokens** for API requests
- **Refresh tokens** for session management
- Protected routes using Next.js middleware

### Authentication Flow

1. User logs in via `/login` (or similar)
2. Backend returns access & refresh tokens
3. Tokens are stored securely
4. Protected routes check authentication status
5. Expired tokens are automatically refreshed

---

## 🎨 UI Components

Built with **Radix UI** primitives and styled with **Tailwind CSS**:

- `Button` - Customizable button component
- `Avatar` - User avatar with fallback
- `DropdownMenu` - Accessible dropdown menus
- `Dialog` - Modal dialogs
- `Label` - Form labels
- `ScrollArea` - Scrollable containers
- `Separator` - Visual dividers

---

## 📦 Key Dependencies

```json
{
  "next": "16.0.10",
  "react": "19.2.1",
  "react-dom": "19.2.1",
  "typescript": "^5",
  "tailwindcss": "^4",
  "@radix-ui/react-*": "Latest versions",
  "jwt-decode": "^4.0.0",
  "react-hot-toast": "^2.6.0"
}
```

---

## 🚧 Development

### Adding New Components

```bash
# If using shadcn/ui components
npx shadcn-ui@latest add [component-name]
```

### Project Conventions

- **Server Components** by default (App Router)
- **Client Components** marked with `'use client'`
- **Server Actions** in `/src/actions/`
- **API calls** proxied through `/src/lib/proxy.ts`

---

## 🌐 Deployment

### Build for Production

```bash
npm run build
npm run start
```





---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is private and not licensed for public use.

---

## 👤 Author

**Suman Acharya**

- GitHub: [@SumanPoU](https://github.com/SumanPoU)

---

## 🐛 Issues

Found a bug? Please open an issue on [GitHub Issues](https://github.com/SumanPoU/frontend/issues).

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/)

---

**Happy Coding! 🚀**