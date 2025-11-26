"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Repository {
  id: string;
  slug: string;
  name: string;
  fullName: string;
  hasToken: boolean;
  createdAt: string;
}

export function DashboardContent() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchRepositories() {
      try {
        const res = await fetch("/api/repositories");
        if (!res.ok) throw new Error("Failed to fetch repositories");
        const data = await res.json();
        setRepositories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "오류가 발생했습니다");
      } finally {
        setLoading(false);
      }
    }

    fetchRepositories();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <p className="text-gray-500">로딩중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (repositories.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <p className="text-gray-500 mb-4">등록된 레포지토리가 없습니다</p>
        <Link
          href="/dashboard/register"
          className="text-blue-600 hover:underline"
        >
          레포지토리 등록하기
        </Link>
      </div>
    );
  }

  const filteredRepositories = repositories.filter(
    (repo) =>
      repo.fullName.toLowerCase().includes(search.toLowerCase()) ||
      repo.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="레포지토리 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {filteredRepositories.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <p className="text-gray-500">검색 결과가 없습니다</p>
        </div>
      ) : (
        filteredRepositories.map((repo) => (
          <div
            key={repo.id}
            className="bg-white rounded-xl shadow-sm p-6 flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {repo.fullName}
              </h3>
              <p className="text-sm text-gray-500">
                슬러그: {repo.slug}
                {!repo.hasToken && (
                  <span className="ml-2 text-orange-500">(토큰 미등록)</span>
                )}
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/r/${repo.slug}`}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                관리
              </Link>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/r/${repo.slug}`
                  );
                  alert("링크가 복사되었습니다!");
                }}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                링크 복사
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
