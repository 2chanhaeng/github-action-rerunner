import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { nanoid } from "nanoid";
import { encrypt } from "@/lib/encryption";

// 레포지토리 상세 조회
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await auth();
  const { slug } = await params;

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const repository = await prisma.repository.findUnique({
    where: { slug },
    include: { owner: { select: { id: true, name: true, githubLogin: true } } },
  });

  if (!repository) {
    return NextResponse.json({ error: "Repository not found" }, {
      status: 404,
    });
  }

  const isOwner = repository.ownerId === session.user.id;

  return NextResponse.json({
    ...repository,
    token: undefined, // 토큰은 절대 노출하지 않음
    hasToken: !!repository.token,
    isOwner,
  });
}

// 레포지토리 수정 (slug 변경, 토큰 등록)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await auth();
  const { slug } = await params;

  if (!session?.user?.id) {
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

  if (repository.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { regenerateSlug, token } = body;

  const updateData: { slug?: string; token?: string } = {};

  if (regenerateSlug) {
    updateData.slug = nanoid(10);
  }

  if (token) {
    updateData.token = encrypt(token);
  }

  const updated = await prisma.repository.update({
    where: { slug },
    data: updateData,
  });

  return NextResponse.json({
    ...updated,
    token: undefined,
    hasToken: !!updated.token,
    isOwner: true,
  });
}

// 레포지토리 삭제
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await auth();
  const { slug } = await params;

  if (!session?.user?.id) {
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

  if (repository.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.repository.delete({ where: { slug } });

  return NextResponse.json({ success: true });
}
