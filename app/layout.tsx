import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeContext";

export const metadata: Metadata = {
  title: "YT-AI-RESUME",
  description:
    "Analiza cualquier video educativo y genera resúmenes inteligentes, flashcards y prompts de análisis profundo con IA.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <div className="min-h-screen bg-white dark:bg-black overflow-hidden transition-colors duration-200">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
