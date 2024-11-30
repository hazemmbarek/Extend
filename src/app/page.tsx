import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation Bar */}
      <nav className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/book-open.svg" // You'll need to add this icon
              alt="EduNext Logo"
              width={32}
              height={32}
              className="text-blue-600"
            />
            <span className="font-bold text-xl text-slate-800 dark:text-white">EduNext</span>
          </div>
          <div className="flex gap-4">
            <a href="#" className="text-slate-600 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400">Courses</a>
            <a href="#" className="text-slate-600 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400">Resources</a>
            <a href="#" className="text-slate-600 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400">Community</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl md:text-6xl">
            Learn Without Limits
          </h1>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300 sm:mt-5 sm:text-lg">
            Discover a new way of learning with our innovative educational platform.
            Join thousands of students worldwide.
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <a
              href="#"
              className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 transition-colors"
            >
              Start Learning
            </a>
            <a
              href="#"
              className="rounded-lg border border-slate-300 dark:border-slate-600 px-6 py-3 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Browse Courses
            </a>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Interactive Courses",
              description: "Engage with dynamic content and real-world projects",
              icon: "🎓",
            },
            {
              title: "Expert Instructors",
              description: "Learn from industry professionals and academics",
              icon: "👩‍🏫",
            },
            {
              title: "Community Learning",
              description: "Connect with peers and collaborate on projects",
              icon: "👥",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="rounded-xl bg-white dark:bg-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-600 dark:text-slate-300">
          <p>© 2024 EduNext. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
