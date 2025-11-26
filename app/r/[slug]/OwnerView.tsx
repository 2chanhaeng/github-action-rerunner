"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLinkIcon } from "@/components/ExternalLinkIcon";

interface OwnerViewProps {
  repository: {
    id: string;
    slug: string;
    name: string;
    fullName: string;
    hasToken: boolean;
  };
}

export function OwnerView({ repository }: OwnerViewProps) {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [hasToken, setHasToken] = useState(repository.hasToken);
  const [currentSlug, setCurrentSlug] = useState(repository.slug);

  async function saveToken() {
    if (!token.trim()) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/repositories/${currentSlug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) throw new Error("Failed to save token");

      setHasToken(true);
      setToken("");
      alert("토큰이 저장되었습니다");
    } catch {
      alert("토큰 저장에 실패했습니다");
    } finally {
      setSaving(false);
    }
  }

  async function regenerateSlug() {
    if (
      !confirm(
        "정말 링크를 변경하시겠습니까? 기존 링크는 더 이상 작동하지 않습니다."
      )
    ) {
      return;
    }

    setRegenerating(true);
    try {
      const res = await fetch(`/api/repositories/${currentSlug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regenerateSlug: true }),
      });

      if (!res.ok) throw new Error("Failed to regenerate slug");

      const data = await res.json();
      setCurrentSlug(data.slug);
      router.replace(`/r/${data.slug}`);
      alert("링크가 변경되었습니다");
    } catch {
      alert("링크 변경에 실패했습니다");
    } finally {
      setRegenerating(false);
    }
  }

  async function deleteRepository() {
    if (
      !confirm(
        "정말 이 레포지토리를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/repositories/${currentSlug}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete repository");

      router.push("/dashboard");
    } catch {
      alert("삭제에 실패했습니다");
    } finally {
      setDeleting(false);
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(`${window.location.origin}/r/${currentSlug}`);
    alert("링크가 복사되었습니다!");
  }

  return (
    <div className="space-y-6">
      {/* 링크 공유 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">링크 공유</h2>
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={`${
              typeof window !== "undefined" ? window.location.origin : ""
            }/r/${currentSlug}`}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
          />
          <button
            onClick={copyLink}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            복사
          </button>
          <button
            onClick={regenerateSlug}
            disabled={regenerating}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {regenerating ? "변경중..." : "링크 변경"}
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          이 링크를 팀원들에게 공유하세요. 링크 변경 시 기존 링크는
          무효화됩니다.
        </p>
      </div>

      {/* 토큰 등록 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          GitHub 토큰{" "}
          {hasToken && <span className="text-green-500 text-sm">(등록됨)</span>}
        </h2>

        <details className="bg-blue-50 border border-blue-200 rounded-lg mb-4">
          <summary className="px-4 py-3 cursor-pointer text-sm font-semibold text-blue-800 hover:bg-blue-100 rounded-lg">
            📋 토큰 생성 방법
          </summary>
          <ol className="px-4 pb-4 text-sm text-blue-700 space-y-1 list-decimal list-inside">
            <li>
              <a
                href="https://github.com/settings/personal-access-tokens/new"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-blue-900"
              >
                GitHub Personal Access Token 생성 페이지
                <ExternalLinkIcon
                  href="https://github.com/settings/personal-access-tokens/new"
                  className="inline-block ml-1 align-text-bottom"
                />
              </a>
              로 이동하세요.
            </li>
            <li>
              <strong>Repository access</strong>에서{" "}
              <code className="bg-blue-100 px-1 rounded">
                Only select repositories
              </code>
              를 선택하고{" "}
              <code className="bg-blue-100 px-1 rounded">
                {repository.fullName}
              </code>
              을 선택하세요.
            </li>
            <li>
              <strong>Permissions</strong>에서 <strong>Add permissions</strong>{" "}
              를 선택해{" "}
              <code className="bg-blue-100 px-1 rounded">Actions</code>
              권한을 추가하세요.
            </li>
            <li>토큰을 생성하고 아래에 붙여넣으세요.</li>
          </ol>
        </details>

        <div className="flex gap-2">
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder={
              hasToken
                ? "새 토큰으로 변경하려면 입력하세요"
                : "github_pat_xxxxxxxxxxxx"
            }
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={saveToken}
            disabled={!token.trim() || saving}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {saving ? "저장중..." : hasToken ? "토큰 변경" : "토큰 저장"}
          </button>
        </div>
        {!hasToken && (
          <p className="text-sm text-orange-500 mt-2">
            ⚠️ 토큰이 등록되지 않으면 담당자들이 PR 목록을 조회하거나 Action을
            재실행할 수 없습니다.
          </p>
        )}
      </div>

      {/* 위험 구역 */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-red-200">
        <h2 className="text-xl font-semibold text-red-600 mb-4">위험 구역</h2>
        <button
          onClick={deleteRepository}
          disabled={deleting}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {deleting ? "삭제중..." : "레포지토리 삭제"}
        </button>
        <p className="text-sm text-gray-500 mt-2">
          이 레포지토리를 앱에서 삭제합니다. GitHub의 실제 레포지토리는 영향받지
          않습니다.
        </p>
      </div>
    </div>
  );
}
