import { auth } from "@/auth";
import { LoginButton } from "@/components/LoginButton";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-16">
          <h1 className="text-2xl font-bold text-gray-900">
            GitHub Action Rerunner
          </h1>
          <LoginButton />
        </header>

        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            실패한 GitHub Actions를
            <br />
            쉽게 재실행하세요
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            레포지토리를 등록하고, 팀원들이 실패한 CI/CD를 직접 재실행할 수
            있도록 권한을 부여하세요.
          </p>

          {session ? (
            <Link
              href="/dashboard"
              className="inline-block px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              대시보드로 이동
            </Link>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-500">
                시작하려면 GitHub으로 로그인하세요
              </p>
              <LoginButton />
            </div>
          )}
        </div>

        <div className="mt-24 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              레포지토리 등록
            </h3>
            <p className="text-gray-600">
              소유한 레포지토리를 등록하고 고유한 링크를 생성하세요.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              링크 공유
            </h3>
            <p className="text-gray-600">
              팀원들에게 링크를 공유하면 자신에게 할당된 PR을 확인할 수
              있습니다.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              원클릭 재실행
            </h3>
            <p className="text-gray-600">
              실패한 GitHub Action을 버튼 하나로 재실행할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
