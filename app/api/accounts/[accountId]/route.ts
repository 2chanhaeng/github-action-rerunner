import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/prisma";

// 특정 계정 삭제 (연결 해제)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ accountId: string }> },
) {
  const session = await auth();
  const { accountId } = await params;

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 해당 계정이 현재 사용자의 것인지 확인
  const account = await prisma.account.findFirst({
    where: {
      id: accountId,
      userId: session.user.id,
    },
  });

  if (!account) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  // 계정 수 확인
  const accountCount = await prisma.account.count({
    where: { userId: session.user.id },
  });

  // 계정 삭제
  await prisma.account.delete({
    where: { id: accountId },
  });

  // 마지막 계정이었다면 세션도 삭제하여 로그아웃 처리
  const isLastAccount = accountCount <= 1;
  if (isLastAccount) {
    await prisma.session.deleteMany({
      where: { userId: session.user.id },
    });
  }

  return NextResponse.json({ success: true, shouldLogout: isLastAccount });
}
