"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setDescription("");
    setError("");
    setMimeType(file.type);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setPreviewUrl(result);
      setImageBase64(result.split(",")[1]);
    };
    reader.readAsDataURL(file);
  }

  async function handleAnalyze() {
    if (!imageBase64) return;
    setLoading(true);
    setDescription("");
    setError("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64, mimeType }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "エラーが発生しました");
      } else {
        setDescription(data.description);
      }
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-16 px-4">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">VLM 画像解析アプリ</h1>
      <p className="text-gray-500 mb-10">画像をアップロードすると、AIが日本語で説明します</p>

      <div className="w-full max-w-xl bg-white rounded-2xl shadow p-8 flex flex-col gap-6">
        {/* ファイル選択エリア */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center cursor-pointer hover:border-blue-400 transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="プレビュー"
              width={400}
              height={300}
              className="max-h-64 object-contain rounded-lg"
            />
          ) : (
            <>
              <svg
                className="w-12 h-12 text-gray-300 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4-4 4 4 4-6 4 6M4 8h16"
                />
              </svg>
              <p className="text-gray-400">クリックして画像を選択</p>
            </>
          )}
        </div>

        {/* 解析ボタン */}
        <button
          onClick={handleAnalyze}
          disabled={!imageBase64 || loading}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "解析中..." : "画像を解析する"}
        </button>

        {/* エラー表示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
            {error}
          </div>
        )}

        {/* 結果表示 */}
        {description && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h2 className="font-semibold text-blue-800 mb-2">解析結果</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{description}</p>
          </div>
        )}
      </div>
    </main>
  );
}
