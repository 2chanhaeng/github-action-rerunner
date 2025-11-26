import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { nanoid } from "nanoid";

// 사용자의 등록된 레포지토리 목록 조회
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const repositories = await prisma.repository.findMany({
    where: { ownerId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(repositories);
}

// 새 레포지토리 등록
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, fullName, githubId } = body;

  if (!name || !fullName || !githubId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  // 이미 등록된 레포지토리인지 확인
  const existing = await prisma.repository.findFirst({
    where: {
      githubId: githubId,
      ownerId: session.user.id,
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Repository already registered", repository: existing },
      { status: 409 },
    );
  }

  const repository = await prisma.repository.create({
    data: {
      slug: nanoid(10),
      name,
      fullName,
      githubId,
      ownerId: session.user.id,
    },
  });

  return NextResponse.json(repository);
}
