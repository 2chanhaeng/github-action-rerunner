import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LoginButton } from "@/components/LoginButton";
import Link from "next/link";
import { DashboardContent } from "./DashboardContent";

export default async function DashboardPage() {
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
            <Link
              href="/dashboard/register"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              레포지토리 등록
            </Link>
          </div>

          <DashboardContent />
        </div>
      </div>
    </main>
  );
}
