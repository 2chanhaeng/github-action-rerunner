import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { decrypt } from "@/lib/encryption";
import {
  getAllOpenPullRequests,
  getAssignedPullRequests,
  getPullRequestWorkflowRuns,
} from "@/lib/github";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await auth();
  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const fetchAll = searchParams.get("all") === "true";

  if (!session?.user?.id || !session.user.githubLogin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const repository = await prisma.repository.findUnique({
    where: { slug },
  });

  if (!repository) {
    return NextResponse.json({ error: "Repository not found" }, {
      status: 404,
    });
  }

  if (!repository.token) {
    return NextResponse.json(
      { error: "Repository token not configured" },
      { status: 400 },
    );
  }

  // all=true는 소유자만 사용 가능
  const isOwner = repository.ownerId === session.user.id;
  if (fetchAll && !isOwner) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const token = decrypt(repository.token);
  const [owner, repo] = repository.fullName.split("/");

  try {
    // 소유자가 all=true로 요청하면 모든 PR, 아니면 담당자의 PR만
    const pullRequests = fetchAll
      ? await getAllOpenPullRequests(token, owner, repo)
      : await getAssignedPullRequests(
        token,
        owner,
        repo,
        session.user.githubLogin,
      );

    // 각 PR에 대한 workflow runs 조회
    const prsWithWorkflows = await Promise.all(
      pullRequests.map(async (pr) => {
        const workflowRuns = await getPullRequestWorkflowRuns(
          token,
          owner,
          repo,
          pr.head.sha,
        );

        const failedRuns = workflowRuns.filter(
          (run) => run.conclusion === "failure",
        );

        return {
          id: pr.id,
          number: pr.number,
          title: pr.title,
          url: pr.html_url,
          headSha: pr.head.sha,
          assignees: pr.assignees?.map((a) => ({
            login: a.login,
            avatarUrl: a.avatar_url,
          })) || [],
          workflowRuns: workflowRuns.map((run) => ({
            id: run.id,
            name: run.name,
            status: run.status,
            conclusion: run.conclusion,
            url: run.html_url,
          })),
          failedRuns: failedRuns.map((run) => ({
            id: run.id,
            name: run.name,
            url: run.html_url,
          })),
          hasFailedRuns: failedRuns.length > 0,
        };
      }),
    );

    // 소유자가 all=true로 요청하면 실패한 workflow가 있는 PR만 필터링
    const filteredPRs = fetchAll
      ? prsWithWorkflows.filter((pr) => pr.hasFailedRuns)
      : prsWithWorkflows;

    return NextResponse.json(filteredPRs);
  } catch (error) {
    console.error("Error fetching PRs:", error);
    return NextResponse.json(
      { error: "Failed to fetch pull requests" },
      { status: 500 },
    );
  }
}
