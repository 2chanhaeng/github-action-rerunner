import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LoginButton } from "@/components/LoginButton";
import Link from "next/link";
import { RegisterContent } from "./RegisterContent";

export default async function RegisterPage() {
  const session = await auth();

  if (!session) {
    redirect("/");
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
              href="/dashboard"
              className="text-gray-500 hover:text-gray-700"
            >
              ← 대시보드
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              레포지토리 등록
            </h1>
          </div>

          <RegisterContent />
        </div>
      </div>
    </main>
  );
}
