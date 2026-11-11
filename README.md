# Church Workflow Admin System

> Church On Cloud is a modern Next.js application designed to bring all Church workflow processes into an administrative system. 

---

## Table of Contents

- [Church On Cloud](#church-on-cloud)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Configuration](#configuration)
  - [Available Scripts](#available-scripts)
  - [Folder Structure](#folder-structure)

---

## Project Overview

This repository bootstraps a Next.js project with TypeScript, Shadcn UI with Tailwind CSS, and a fully customizable color system driven by CSS variables. It also integrates Husky and lint-staged to enforce commit-quality checks.

## Features

- ✅ **Next.js** with App Router (`/src/app`) and Pages Router (`/src/pages`) support
- ✅ **TypeScript** for type safety
- ✅ **Shadcn UI and Tailwind CSS** with:
  - Customizable color scales
  - Customizable components
  - Utility layers for base styles

## Tech Stack

- [Next.js](https://nextjs.org/) (v15.x)
- [React](https://reactjs.org/) (v18.x)
- [TypeScript](https://www.typescriptlang.org/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Husky](https://typicode.github.io/husky/)

## Getting Started

### Prerequisites

- Node.js ^16.8.0
- npm (v8+) or Yarn

### Installation

1. **Clone the repo**

   ```bash
   git clone https://github.com/Sleeky-Programmers/church-workflow-web.git
   cd church-workflow-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

### Configuration

1. **Environment Variables**
   - Create a `.env` file at project root
   ```bash
   cp .env.sample .env
   ```

## Available Scripts

| Script          | Description                      |
| --------------- | -------------------------------- |
| `npm run dev`   | Runs the app in development mode |
| `npm run build` | Bundles the app for production   |
| `npm run start` | Starts the production server     |

## Folder Structure

```
├── src/
│   ├── public/             # Assets
│   ├── app/                # App Router entries
│   ├── components/         # Shared UI components
│   ├── lib/                # Shadcn Library utilities
│   └── ...                 # other folders
├── .husky/                 # Git hooks
├── .env.sample             # Environment variable sample
├── .gitignore              # Gitignore
├── components.json         # Shadcn Configuration
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript config
└── package.json            # npm scripts & dependencies
```
