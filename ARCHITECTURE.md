# Meridian Sales Intelligence — Architecture Overview

## Executive Summary

Meridian Sales Intelligence is a commercial analytics web application that transforms raw sales order CSV data into actionable business insights and executive-ready financial narratives. Designed for sales directors, revenue operations leaders, and corporate analysts, the platform automatically calculates key performance metrics—including total revenue, units sold, average discount percentages, and regional quarter-over-quarter performance comparisons between Q2 and Q3. In addition to interactive visual dashboards and granular transaction tables, the application integrates a server-side Gemini AI engine that evaluates computed regional variance metrics to generate concise, three-sentence executive summaries identifying which geographic region experienced the largest performance shift and explaining the financial factors behind the change.

---

## File Directory & Component Descriptions

| File Path | Description |
| :--- | :--- |
| `ARCHITECTURE.md` | Explains the business purpose of the application and provides a functional summary of every file in the codebase. |
| `.env.example` | Provides the environment variable template required to configure the server port and Gemini API credentials. |
| `.gitignore` | Specifies untracked files and build artifacts that Git version control should ignore. |
| `index.html` | Serves as the primary HTML webpage entry point, hosting application metadata and mounting the React user interface. |
| `metadata.json` | Registers the applet identity, display properties, and server-side Gemini AI capabilities for AI Studio. |
| `package.json` | Declares all third-party software libraries, execution scripts, and runtime dependencies for the frontend and backend. |
| `server.ts` | Implements the Express backend server that routes API requests, interfaces securely with the Gemini AI model, and serves the web application. |
| `src/App.tsx` | Serves as the root React component, managing application state, calculating quarterly metrics, and coordinating view switching. |
| `src/components/AiSummaryPanel.tsx` | Presents Q2-to-Q3 regional revenue variance metrics and enables users to generate executive three-sentence summaries via the AI service. |
| `src/components/DashboardView.tsx` | Renders the primary analytics dashboard featuring KPI cards, quarterly revenue bar charts, and regional market distribution breakdowns. |
| `src/components/DataTableModal.tsx` | Displays a searchable, filterable, and paginated transaction grid allowing users to inspect every individual sales order record. |
| `src/components/Navbar.tsx` | Provides top-level navigation, tab selection, record count indicators, and triggers for loading sample data or importing new CSVs. |
| `src/components/UploadModal.tsx` | Offers a drag-and-drop dialog for uploading, validating, and parsing custom sales order CSV files into the application. |
| `src/index.css` | Imports and configures the Tailwind CSS design system rules and global layout stylings. |
| `src/main.tsx` | Initializes the client-side React runtime and mounts the root application component into the webpage DOM. |
| `src/types.ts` | Defines TypeScript data structures and interfaces for sales orders, geographic regions, quarters, and variance metrics. |
| `src/utils/sampleData.ts` | Provides a default transactional sales CSV dataset and parsing utility to allow immediate exploration without manual file uploads. |
| `tsconfig.json` | Configures TypeScript compiler settings, path aliases, and code quality verification rules. |
| `vite.config.ts` | Configures the Vite development server, bundler settings, and React/Tailwind compiler plugins. |
