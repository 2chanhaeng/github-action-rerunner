"use client";

import { useEffect, useState } from "react";

interface WorkflowRun {
  id: number;
  name: string | null;
  status: string | null;
  conclusion: string | null;
  url: string;
}

interface PullRequest {
  id: number;
  number: number;
  title: string;
  url: string;
  headSha: string;
  workflowRuns: WorkflowRun[];
  failedRuns: { id: number; name: string | null; url: string }[];
  hasFailedRuns: boolean;
}

interface AssigneeViewProps {
  slug: string;
  repoFullName: string;
  hasToken: boolean;
}

export function AssigneeView({
  slug,
  repoFullName,
  hasToken,
}: AssigneeViewProps) {
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rerunning, setRerunning] = useState<number | null>(null);

  useEffect(() => {
    if (!hasToken) {
      setLoading(false);
      return;
    }

    async function fetchPRs() {
      try {
        const res = await fetch(`/api/repositories/${slug}/pulls`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to fetch pull requests");
        }
        const data = await res.json();
        setPullRequests(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "오류가 발생했습니다");
      } finally {
        setLoading(false);
      }
    }

    fetchPRs();
  }, [slug, hasToken]);

  async function rerunWorkflow(runId: number) {
    setRerunning(runId);
    try {
      const res = await fetch(`/api/repositories/${slug}/rerun/${runId}`, {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to rerun workflow");
      }

      alert("워크플로우 재실행이 시작되었습니다!");
      // 페이지 새로고침하여 상태 업데이트
      window.location.reload();
    } catch (err) {
      alert(err instanceof Error ? err.message : "재실행에 실패했습니다");
    } finally {
      setRerunning(null);
    }
  }

  if (!hasToken) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <p className="text-gray-500">
          이 레포지토리는 아직 설정이 완료되지 않았습니다.
        </p>
        <p className="text-gray-500">소유자에게 토큰 등록을 요청하세요.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <p className="text-gray-500">PR 목록을 불러오는 중...</p>
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

  if (pullRequests.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <p className="text-gray-500">
          현재 {repoFullName}에서 나에게 할당된 열린 PR이 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-gray-600">
        {repoFullName}에서 나에게 할당된 열린 PR 목록입니다.
      </p>

      {pullRequests.map((pr) => (
        <div key={pr.id} className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <a
                href={pr.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-blue-600 hover:underline"
              >
                #{pr.number} {pr.title}
              </a>
              <p className="text-sm text-gray-500 mt-1">
                SHA: {pr.headSha.substring(0, 7)}
              </p>
            </div>
            {pr.hasFailedRuns && (
              <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm">
                실패한 워크플로우 있음
              </span>
            )}
          </div>

          {pr.workflowRuns.length === 0 ? (
            <p className="text-gray-500 text-sm">
              워크플로우 실행 기록이 없습니다.
            </p>
          ) : (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">워크플로우:</h4>
              {pr.workflowRuns.map((run) => (
                <div
                  key={run.id}
                  className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    {run.conclusion === "success" && (
                      <span className="w-3 h-3 bg-green-500 rounded-full" />
                    )}
                    {run.conclusion === "failure" && (
                      <span className="w-3 h-3 bg-red-500 rounded-full" />
                    )}
                    {run.status === "in_progress" && (
                      <span className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
                    )}
                    {!run.conclusion && run.status !== "in_progress" && (
                      <span className="w-3 h-3 bg-gray-400 rounded-full" />
                    )}
                    <a
                      href={run.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:text-blue-600"
                    >
                      {run.name || "Workflow"}
                    </a>
                  </div>
                  {run.conclusion === "failure" && (
                    <button
                      onClick={() => rerunWorkflow(run.id)}
                      disabled={rerunning === run.id}
                      className="px-3 py-1 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 transition-colors disabled:opacity-50"
                    >
                      {rerunning === run.id ? "재실행중..." : "Rerun"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
