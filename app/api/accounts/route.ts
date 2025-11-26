import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/prisma";

// 현재 사용자에 연결된 모든 계정 조회
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accounts = await prisma.account.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      provider: true,
      providerAccountId: true,
    },
  });

  // 각 계정에 대한 GitHub 사용자 정보 조회 (User 테이블에서)
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      image: true,
      githubLogin: true,
    },
  });

  return NextResponse.json({
    currentUser: user,
    accounts: accounts.map((acc) => ({
      id: acc.id,
      provider: acc.provider,
      providerAccountId: acc.providerAccountId,
    })),
  });
}
