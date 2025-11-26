import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { getUserRepositories } from "@/lib/github";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 사용자의 GitHub OAuth 토큰 조회
  const account = await prisma.account.findFirst({
    where: {
      userId: session.user.id,
      provider: "github",
    },
  });

  if (!account?.access_token) {
    return NextResponse.json(
      { error: "GitHub access token not found" },
      { status: 400 },
    );
  }

  try {
    const repos = await getUserRepositories(account.access_token);

    // 이미 등록된 레포지토리 확인
    const registered = await prisma.repository.findMany({
      where: { ownerId: session.user.id },
      select: { githubId: true },
    });
    const registeredIds = new Set(
      registered.map((r: { githubId: number }) => r.githubId),
    );

    return NextResponse.json(
      repos.map((repo) => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        private: repo.private,
        isRegistered: registeredIds.has(repo.id),
      })),
    );
  } catch (error) {
    console.error("Error fetching GitHub repos:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub repositories" },
      { status: 500 },
    );
  }
}
