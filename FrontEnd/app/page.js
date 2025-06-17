// import Image from "next/image";

import Link from "next/link";

// export default function Home() {
//   return (
    
//   );
// }


// // import { Link, Route, Routes } from 'react-router-dom';
// import SignUp from './signup';

function Home() {
  return (
    <div className='space-y-12 '>
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] opacity-20" />
        <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <figure className="mt-10 space-y-4">
            <blockquote className="text-center text-gray-900 sm:text-2xl">
              <p className="text-4xl font-bold">Your Translation Annotation Companion</p>
            </blockquote>
            <blockquote className="text-center text-gray-600">
              <p className="text-lg">
                Easily review, rate, and improve machine-translated content in your <br />
                language pair.
              </p>
            </blockquote>
            <Link href= "/signup" className="bg-blue-600 flex justify-center w-32 p-2 text-white rounded font-medium hover:bg-blue-500 mx-auto hover:rounded-full">
              Get Started
            </Link>
          </figure>
        </div>
      </section>

      {/* Features Section */}
      <section id="features">
        <div className="max-w-5xl mt-24 min-h-72 mx-auto flex flex-col md:flex-row gap-16">
          <div className="w-full h-36 md:w-1/3 text-center border p-4 rounded shadow border-gray-200 hover:shadow-md bg-blue-50 hover:bg-blue-100">
            <h4 className="text-xl font-semibold  mb-2">⭐ Intuitive Interface</h4>
            <p>Review translations with checkboxes, ratings, and in-line comments.</p>
          </div>
          <div className="w-full h-36 md:w-1/3 -mt-16 text-center  p-4 rounded shadow border border-gray-200 hover:shadow-md bg-blue-50 hover:bg-blue-100">
            <h4 className="text-xl font-semibold mb-2">🔍 Easy Navigation</h4>
            <p>Move quickly through assigned texts with Save, Next, and Draft options.</p>
          </div>
          <div className="w-full h-36 md:w-1/3  text-center border p-4 rounded shadow border-gray-200 hover:shadow-md bg-blue-50 hover:bg-blue-100">
            <h4 className="text-xl font-semibold mb-2">📦 Export Ready</h4>
            <p>Download all annotations for model feedback or academic analysis.</p>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="py-20 px-6 ">
        <div className="max-w-5xl border border-gray-200 p-6 rounded-lg shadow-md mx-auto flex flex-col items-center ">
          <h3 className="text-3xl font-bold mb-10">How It Works</h3>
          <ol className="space-y-4 text-left max-w-xl mx-auto">
            <li>1. Login href your dashboard</li>
            <li>2. View source and translated text pairs</li>
            <li>3. Check for issues: Omission , Addition, Mistranslation, Untranslation</li>
            <li>4. Rate the translation and leave comments</li>
            <li>5. Save or submit your annotations</li>
          </ol>
        </div>
      </section>
    </div>
  );
}

export default function LandPage() {
  return (
      <div>
        {/* Navbar */}
        <header className="max-w-5xl mx-auto h-16 flex items-center justify-between px-4">
          <Link href="/" className="text-3xl font-medium">Annotation Tool</Link>
          <div className="space-x-6">
            <a href="#features" className="hover:text-blue-600">Features</a>
            <a href="#how-it-works" className="hover:text-blue-600">How it Works</a>
            <Link href="/signup" className="hover:text-blue-600">Sign Up</Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="px-4">
            <Home />
        </main>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 py-6 border-t">
          © {new Date().getFullYear()} Annotation Tool. All rights reserved.
        </footer>
      </div>
  );
}
