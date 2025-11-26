"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface GitHubRepo {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  private: boolean;
  isRegistered: boolean;
}

export function RegisterContent() {
  const router = useRouter();
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registering, setRegistering] = useState<number | null>(null);

  useEffect(() => {
    async function fetchRepos() {
      try {
        const res = await fetch("/api/github/repos");
        if (!res.ok) throw new Error("Failed to fetch repositories");
        const data = await res.json();
        setRepos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "오류가 발생했습니다");
      } finally {
        setLoading(false);
      }
    }

    fetchRepos();
  }, []);

  async function registerRepo(repo: GitHubRepo) {
    setRegistering(repo.id);
    try {
      const res = await fetch("/api/repositories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: repo.name,
          fullName: repo.fullName,
          githubId: repo.id,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        if (res.status === 409) {
          router.push(`/r/${data.repository.slug}`);
          return;
        }
        throw new Error(data.error || "Failed to register repository");
      }

      const data = await res.json();
      router.push(`/r/${data.slug}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "등록에 실패했습니다");
    } finally {
      setRegistering(null);
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <p className="text-gray-500">GitHub 레포지토리 목록을 불러오는 중...</p>
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

  if (repos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <p className="text-gray-500">등록 가능한 레포지토리가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm divide-y">
      {repos.map((repo) => (
        <div
          key={repo.id}
          className="p-4 flex justify-between items-center hover:bg-gray-50"
        >
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{repo.fullName}</h3>
              {repo.private && (
                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                  Private
                </span>
              )}
            </div>
            {repo.description && (
              <p className="text-sm text-gray-500 mt-1">{repo.description}</p>
            )}
          </div>
          <button
            onClick={() => registerRepo(repo)}
            disabled={repo.isRegistered || registering === repo.id}
            className={`px-4 py-2 rounded-lg transition-colors ${
              repo.isRegistered
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : registering === repo.id
                ? "bg-blue-400 text-white cursor-wait"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {repo.isRegistered
              ? "등록됨"
              : registering === repo.id
              ? "등록중..."
              : "등록"}
          </button>
        </div>
      ))}
    </div>
  );
}
