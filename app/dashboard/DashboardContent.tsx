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

  return (
    <div className="space-y-4">
      {repositories.map((repo) => (
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
      ))}
    </div>
  );
}
