import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center text-center">
        <div className="flex flex-col gap-4">
          <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-200">404</h1>
          <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-400">Page Not Found</h2>
        </div>
        
        <div className="flex flex-col gap-4 max-w-md">
          <p className="text-gray-500 dark:text-gray-500">
            The page you are looking for does not exist or has been moved.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-600">
            If you believe this is an error, please check the URL or navigate back to the homepage.
          </p>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row mt-4">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/"
          >
            ← Back to Home
          </Link>
          <Link
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/notes"
          >
            Browse Notes
          </Link>
        </div>
      </main>
    </div>
  );
}