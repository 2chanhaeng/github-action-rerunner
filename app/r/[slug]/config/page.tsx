import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { redirect, notFound } from "next/navigation";
import { LoginButton } from "@/components/LoginButton";
import { ExternalLinkIcon } from "@/components/ExternalLinkIcon";
import Link from "next/link";
import { ConfigView } from "./ConfigView";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function RepositoryConfigPage({ params }: PageProps) {
  const session = await auth();
  const { slug } = await params;

  if (!session) {
    redirect(`/api/auth/signin?callbackUrl=/r/${slug}/config`);
  }

  const repository = await prisma.repository.findUnique({
    where: { slug },
    include: { owner: { select: { id: true, name: true, githubLogin: true } } },
  });

  if (!repository) {
    notFound();
  }

  const isOwner = repository.ownerId === session.user.id;

  // 소유자가 아니면 메인 페이지로 리다이렉트
  if (!isOwner) {
    redirect(`/r/${slug}`);
  }

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
            <Link
              href={`/r/${slug}`}
              className="text-gray-500 hover:text-gray-700"
            >
              ← {repository.fullName}
            </Link>
            <ExternalLinkIcon
              href={`https://github.com/${repository.fullName}`}
              className="text-gray-500"
            />
            <h1 className="text-3xl font-bold text-gray-900">설정</h1>
          </div>

          <ConfigView
            repository={{
              id: repository.id,
              slug: repository.slug,
              name: repository.name,
              fullName: repository.fullName,
              hasToken: !!repository.token,
            }}
          />
        </div>
      </div>
    </main>
  );
}
