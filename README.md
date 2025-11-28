# AI Resume - Mohamed Adel

An interactive AI-powered resume chatbot that allows users to query my professional profile, experience, and skills using natural language.

## Features

- **AI Chat Interface**: Powered by LangChain and OpenAI to provide intelligent responses based on resume data.
- **Resume Ingestion**: Automated script (`scripts/ingest.ts`) to parse PDF resumes and summary text into a structured format for the AI.
- **Real-time Streaming**: Chat responses are streamed in real-time for a smooth user experience.
- **Modern UI**: Built with Next.js 15 (App Router), TypeScript, and Tailwind CSS for a responsive and polished design.
- **PDF Parsing**: Uses `pdf-parse` to extract text from PDF documents.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI/LLM**: [LangChain](https://js.langchain.com/docs/get_started/introduction), [OpenAI API](https://openai.com/)
- **Markdown Rendering**: `react-markdown`, `rehype-raw`, `remark-gfm`

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, pnpm, or bun
- An OpenAI API Key

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ai-resume
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

### Data Ingestion

To update the resume data used by the AI:

1. Place your resume PDF in `public/me/linkedin.pdf`.
2. Place a summary text file in `public/me/summary.txt`.
3. Run the ingestion script:
   ```bash
   npm run prebuild
   ```
   This will generate `lib/resume.ts` containing the extracted text.

### Running the Application

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
