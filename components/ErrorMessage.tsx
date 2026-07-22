"use client";

import React from "react";

export const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
    {message}
  </div>
);
