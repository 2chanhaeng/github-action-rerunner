import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { redirect, notFound } from "next/navigation";
import { LoginButton } from "@/components/LoginButton";
import { ExternalLinkIcon } from "@/components/ExternalLinkIcon";
import Link from "next/link";
import { AllPRsView } from "./AllPRsView";
import { AssigneeView } from "./AssigneeView";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function RepositoryPage({ params }: PageProps) {
  const session = await auth();
  const { slug } = await params;

  if (!session) {
    redirect(`/api/auth/signin?callbackUrl=/r/${slug}`);
  }

  const repository = await prisma.repository.findUnique({
    where: { slug },
    include: { owner: { select: { id: true, name: true, githubLogin: true } } },
  });

  if (!repository) {
    notFound();
  }

  const isOwner = repository.ownerId === session.user.id;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            GitHub Action Rerunner
          </Link>
          <LoginButton />
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {isOwner && (
                <Link
                  href="/dashboard"
                  className="text-gray-500 hover:text-gray-700"
                >
                  ← 대시보드
                </Link>
              )}
              <h1 className="text-3xl font-bold text-gray-900">
                {repository.fullName}
              </h1>
              <ExternalLinkIcon
                href={`https://github.com/${repository.fullName}`}
                className="text-gray-500"
              />
            </div>
            {isOwner && (
              <Link
                href={`/r/${slug}/config`}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                ⚙️ 설정
              </Link>
            )}
          </div>

          {isOwner ? (
            <AllPRsView
              slug={repository.slug}
              repoFullName={repository.fullName}
              hasToken={!!repository.token}
            />
          ) : (
            <AssigneeView
              slug={repository.slug}
              repoFullName={repository.fullName}
              hasToken={!!repository.token}
            />
          )}
        </div>
      </div>
    </main>
  );
}
