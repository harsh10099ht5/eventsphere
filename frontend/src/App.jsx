import { BrowserRouter, Routes, Route } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <nav className="border-b border-white/10 bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          {/* Logo */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Event<span className="text-blue-500">Sphere</span>
            </h1>
          </div>

          {/* Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#home"
              className="text-sm text-white transition hover:text-blue-400"
            >
              Home
            </a>

            <a
              href="#events"
              className="text-sm text-slate-300 transition hover:text-blue-400"
            >
              Events
            </a>

            <a
              href="#about"
              className="text-sm text-slate-300 transition hover:text-blue-400"
            >
              About
            </a>

            <a
              href="#contact"
              className="text-sm text-slate-300 transition hover:text-blue-400"
            >
              Contact
            </a>
          </div>

          {/* Login */}
          <button className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-blue-700">
            Login
          </button>

        </div>
      </nav>

      {/* Hero Section */}
      <main id="home">

        <section className="relative overflow-hidden">

          {/* Background Glow */}
          <div className="absolute left-1/2 top-0 -z-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:py-32">

            <div className="max-w-4xl">

              {/* Label */}
              <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
                AI-Powered College Event Platform
              </p>

              {/* Heading */}
              <h2 className="text-5xl font-bold leading-tight tracking-tight md:text-7xl">
                Discover Events.
                <br />
                <span className="text-blue-500">
                  Build Your Future.
                </span>
              </h2>

              {/* Description */}
              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400">
                Discover college events, workshops, hackathons and
                competitions. Register instantly, track your participation,
                earn certificates and receive personalized recommendations
                powered by Artificial Intelligence.
              </p>

              {/* Buttons */}
              <div className="mt-10 flex flex-wrap gap-4">

                <button className="rounded-lg bg-blue-600 px-7 py-3.5 font-semibold transition hover:bg-blue-700">
                  Explore Events
                </button>

                <button className="rounded-lg border border-white/15 bg-white/5 px-7 py-3.5 font-semibold transition hover:bg-white/10">
                  Host an Event
                </button>

              </div>

            </div>

          </div>
        </section>

        {/* Features */}
        <section
          id="events"
          className="border-t border-white/10 bg-slate-900/50"
        >
          <div className="mx-auto max-w-7xl px-6 py-20">

            <div className="mb-12">
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
                Platform Features
              </p>

              <h3 className="mt-3 text-3xl font-bold md:text-4xl">
                Everything for your campus events
              </h3>

              <p className="mt-4 max-w-2xl text-slate-400">
                EventSphere brings students, organizers and colleges together
                on one centralized platform.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {/* Feature 1 */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-7 transition hover:border-blue-500/40">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
                  📅
                </div>

                <h4 className="text-xl font-semibold">
                  Discover Events
                </h4>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Find hackathons, workshops, seminars, competitions and
                  cultural events from one platform.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-7 transition hover:border-blue-500/40">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
                  🤖
                </div>

                <h4 className="text-xl font-semibold">
                  AI Recommendations
                </h4>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Receive personalized event recommendations based on your
                  interests, skills and participation history.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-7 transition hover:border-blue-500/40">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
                  🎓
                </div>

                <h4 className="text-xl font-semibold">
                  Digital Certificates
                </h4>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Automatically receive and manage verified digital
                  certificates after participating in events.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-7 transition hover:border-blue-500/40">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
                  QR
                </div>

                <h4 className="text-xl font-semibold">
                  QR Attendance
                </h4>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Simplify event attendance using secure QR-based
                  verification.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-7 transition hover:border-blue-500/40">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
                  📊
                </div>

                <h4 className="text-xl font-semibold">
                  Event Analytics
                </h4>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Organizers can monitor registrations, attendance and
                  participant feedback.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-7 transition hover:border-blue-500/40">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
                  👥
                </div>

                <h4 className="text-xl font-semibold">
                  Student Engagement
                </h4>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Build a participation history and discover opportunities
                  that match your academic and career interests.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* About */}
        <section id="about" className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-20">

            <div className="max-w-3xl">

              <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
                About EventSphere
              </p>

              <h3 className="mt-3 text-3xl font-bold md:text-4xl">
                One platform for the complete event experience.
              </h3>

              <p className="mt-5 leading-8 text-slate-400">
                EventSphere is designed to centralize college events and
                student participation. The platform connects students,
                organizers and administrators while using AI to improve event
                discovery and engagement.
              </p>

            </div>

          </div>
        </section>

        {/* CTA */}
        <section
          id="contact"
          className="border-t border-white/10 bg-blue-600"
        >
          <div className="mx-auto max-w-7xl px-6 py-20">

            <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">

              <div>
                <h3 className="text-3xl font-bold">
                  Ready to explore your next opportunity?
                </h3>

                <p className="mt-3 text-blue-100">
                  Discover events and start building your experience.
                </p>
              </div>

              <button className="rounded-lg bg-white px-7 py-3.5 font-semibold text-blue-700 transition hover:bg-slate-100">
                Explore Events
              </button>

            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">

          <p>
            © 2026 EventSphere. All rights reserved.
          </p>

          <p>
            AI-Powered College Event Platform
          </p>

        </div>
      </footer>

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;