"use client";

import React, { useState } from "react";
import { FileUpload } from "./FileUpload";
import { VideoPlayer } from "./VideoPlayer";
import { ContentTabs, type TabType } from "./ContentTabs";
import { ContentDisplay } from "./ContentDisplay";
import { LoadingSpinner } from "./LoadingSpinner";

import { processVideo } from "./api";
import type { DeepDivePrompt, Flashcard } from "./types";

export const WebAppSection: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("summary");
  const [summary, setSummary] = useState("");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [deepDive, setDeepDive] = useState<DeepDivePrompt[]>([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState<string | undefined>();
  const [lengthSeconds, setLengthSeconds] = useState<number | undefined>();
  const [fromCache, setFromCache] = useState(false);

  const onSubmit = async (url: string) => {
    setError(null);
    setLoading(true);
    setSummary("");
    setFlashcards([]);
    setDeepDive([]);
    setTitle("");
    try {
      const data = await processVideo(url);
      setVideoUrl(url);
      setSummary(data.summary);
      setFlashcards(data.flashcards);
      setDeepDive(data.deepDivePrompts);
      setTitle(data.title);
      setAuthor(data.author);
      setLengthSeconds(data.lengthSeconds);
      setFromCache(data.fromCache);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos analizar el video. Probá nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const onClear = () => {
    setVideoUrl("");
    setSummary("");
    setFlashcards([]);
    setDeepDive([]);
    setTitle("");
    setAuthor(undefined);
    setLengthSeconds(undefined);
    setFromCache(false);
    setError(null);
    setActiveTab("summary");
  };

  return (
    <section id="analizar" className="bg-white py-16 dark:bg-zinc-950 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <FileUpload onUrlSubmit={onSubmit} loading={loading} error={error} />
        {(loading || videoUrl) && <div className="mt-8 space-y-6">
          {loading ? <LoadingSpinner message="Estamos preparando tu material de estudio…" /> : <>
            <VideoPlayer videoUrl={videoUrl} onClear={onClear} title={title} author={author} lengthSeconds={lengthSeconds} fromCache={fromCache} />
            <div className="space-y-6">
              <ContentTabs activeTab={activeTab} onTabChange={setActiveTab} />
              <ContentDisplay activeTab={activeTab} summary={summary} flashcards={flashcards} deepDivePrompts={deepDive} />
            </div>
          </>}
        </div>}
      </div>
    </section>
  );
};
