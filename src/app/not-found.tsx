import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-7xl font-black text-zinc-800 mb-4">404</div>
        <h1 className="text-2xl font-bold text-white mb-2">Page not found</h1>
        <p className="text-[15px] text-zinc-400 mb-6">The page you're looking for doesn't exist or has been moved.</p>
        <Link
          href="/"
          className="inline-flex items-center h-11 px-6 text-[14px] font-semibold rounded-xl text-white transition-all duration-200"
          style={{ background: 'linear-gradient(to right, #3b82f6, #8b5cf6)' }}
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
