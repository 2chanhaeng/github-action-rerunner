import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { decrypt } from "@/lib/encryption";
import { rerunFailedJobs } from "@/lib/github";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string; runId: string }> },
) {
  const session = await auth();
  const { slug, runId } = await params;

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

  if (!repository.token) {
    return NextResponse.json(
      { error: "Repository token not configured" },
      { status: 400 },
    );
  }

  const token = decrypt(repository.token);
  const [owner, repo] = repository.fullName.split("/");

  try {
    await rerunFailedJobs(token, owner, repo, parseInt(runId, 10));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error rerunning workflow:", error);
    return NextResponse.json(
      { error: "Failed to rerun workflow" },
      { status: 500 },
    );
  }
}
