import { Octokit } from "octokit";

export function createOctokit(token: string) {
  return new Octokit({ auth: token });
}

// 사용자의 레포지토리 목록 조회 (개인 + 조직)
export async function getUserRepositories(token: string) {
  const octokit = createOctokit(token);
  const { data } = await octokit.rest.repos.listForAuthenticatedUser({
    sort: "updated",
    per_page: 100,
    affiliation: "owner,organization_member",
  });
  return data;
}

// 담당자의 Open PR 목록 조회
export async function getAssignedPullRequests(
  token: string,
  owner: string,
  repo: string,
  assignee: string,
) {
  const octokit = createOctokit(token);
  const { data } = await octokit.rest.pulls.list({
    owner,
    repo,
    state: "open",
  });

  // 담당자로 할당된 PR만 필터링
  return data.filter((pr) => pr.user?.login === assignee);
}

// 모든 Open PR 목록 조회
export async function getAllOpenPullRequests(
  token: string,
  owner: string,
  repo: string,
) {
  const octokit = createOctokit(token);
  const { data } = await octokit.rest.pulls.list({
    owner,
    repo,
    state: "open",
  });

  return data;
}

// PR의 Check Runs (GitHub Actions) 조회
export async function getPullRequestCheckRuns(
  token: string,
  owner: string,
  repo: string,
  ref: string,
) {
  const octokit = createOctokit(token);
  const { data } = await octokit.rest.checks.listForRef({
    owner,
    repo,
    ref,
  });
  return data.check_runs;
}

// 실패한 workflow run 재실행
export async function rerunFailedJobs(
  token: string,
  owner: string,
  repo: string,
  runId: number,
) {
  const octokit = createOctokit(token);
  await octokit.rest.actions.reRunWorkflowFailedJobs({
    owner,
    repo,
    run_id: runId,
  });
}

// PR의 workflow runs 조회
export async function getPullRequestWorkflowRuns(
  token: string,
  owner: string,
  repo: string,
  headSha: string,
) {
  const octokit = createOctokit(token);
  const { data } = await octokit.rest.actions.listWorkflowRunsForRepo({
    owner,
    repo,
    head_sha: headSha,
  });
  return data.workflow_runs;
}
