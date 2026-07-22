import React from "react";
import { FaGithub, FaEnvelope } from "react-icons/fa";

export const Footer: React.FC<{ message?: string }> = ({
  message = "Created by Javier Medina",
}) => {
  return (
    <footer className="bg-gray-50 dark:bg-black border-t border-gray-200 dark:border-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
YT/ESTUDIO
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
Transformá videos de YouTube en material de estudio claro y reutilizable
            </p>
          </div>

          <div className="text-center md:text-left">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">
              Enlaces
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#web-app"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
Analizar video
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/javiermedinaj/summarize-yt/blob/main/README.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Documentación
                </a>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-right">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">
              Conecta
            </h4>
            <div className="flex justify-center md:justify-end gap-4">
              <a
                href="https://github.com/javiermedinaj/summarize-yt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <FaGithub className="w-5 h-5" />
              </a>
              <a
                href="mailto:javier_j_medina@hotmail.com"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="Email"
              >
                <FaEnvelope className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            <span className="hidden sm:inline">{message}</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
