import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { redirect, notFound } from "next/navigation";
import { LoginButton } from "@/components/LoginButton";
import Link from "next/link";
import { OwnerView } from "./OwnerView";
import { AssigneeView } from "./AssigneeView";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function RepositoryPage({ params }: PageProps) {
  const session = await auth();
  const { slug } = await params;

  if (!session) {
    redirect("/");
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
          <div className="flex items-center gap-4 mb-6">
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
          </div>

          {isOwner ? (
            <OwnerView
              repository={{
                id: repository.id,
                slug: repository.slug,
                name: repository.name,
                fullName: repository.fullName,
                hasToken: !!repository.token,
              }}
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
