import Link from "next/link";
import { FAQ } from "@/components/FAQ";

const FAQ_SECTIONS = [
  {
    title: "Getting Started",
    items: [
      {
        question: "Where do I start?",
        answer: (
          <>
            Watch this overview video on proctoring:{" "}
            <a
              href="https://youtu.be/mKJT0W2ycRU"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-500 hover:text-amber-600 underline underline-offset-2"
            >
              youtu.be/mKJT0W2ycRU
            </a>
          </>
        ),
      },
      {
        question: "Where do I log in to proctor the testing?",
        answer: (
          <>
            Go to{" "}
            <a
              href="https://www.riversidedatamanager.com/BalancedManagement/user/signin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-500 hover:text-amber-600 underline underline-offset-2"
            >
              riversidedatamanager.com
            </a>{" "}
            and log in using the &ldquo;Access DataManager&rdquo; tab. If it&apos;s your first time
            logging in, an activation link was sent to the email you provided during
            registration. Can&apos;t find it? Contact{" "}
            <a
              href="mailto:jackson@eaglesedge.com"
              className="text-amber-500 hover:text-amber-600 underline underline-offset-2"
            >
              jackson@eaglesedge.com
            </a>{" "}
            to have it re-sent.
          </>
        ),
      },
    ],
  },
  {
    title: "Managing Students",
    items: [
      {
        question: "How do I add students to my roster?",
        answer:
          'Log in to the Eagles Edge Testing portal and go to your Roster page. Click "Add Student" and enter their name, date of birth, grade level, and gender. You can add students at any time before testing begins.',
      },
      {
        question: "Can I add students after my school has already submitted?",
        answer:
          "Yes! Log into the portal and add students anytime. If testing has already begun, your administrator will export the new additions separately and add them to the system.",
      },
      {
        question: "How can I view my roster / student information?",
        answer: (
          <>
            Your roster is available anytime in the Eagles Edge Testing portal. For
            information in Riverside DataManager, watch this video:{" "}
            <a
              href="https://youtu.be/ZI7_yMrvGLU"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-500 hover:text-amber-600 underline underline-offset-2"
            >
              youtu.be/ZI7_yMrvGLU
            </a>
          </>
        ),
      },
      {
        question: "Some of my learners are ahead/behind. What grade level should they test at?",
        answer:
          "We strongly recommend all learners test at their age-grade level equivalent. The Iowa test is adaptive, so learners won't be too bored or in over their heads. Testing at age level also makes your results much more accurate and comparable.",
      },
    ],
  },
  {
    title: "Testing",
    items: [
      {
        question: "Where do my learners log in to test?",
        answer: (
          <>
            Learners test at{" "}
            <a
              href="https://www.riversideonlinetest.com/studentlogin.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-500 hover:text-amber-600 underline underline-offset-2"
            >
              riversideonlinetest.com
            </a>
            . They&apos;ll need their Student ID (found on your roster in the portal) and
            the session code you create in DataManager.
          </>
        ),
      },
    ],
  },
  {
    title: "Reports",
    items: [
      {
        question: "How and when can I get my reports?",
        answer: (
          <>
            Reports are typically ready within a few days of completing testing, though
            occasionally they can take up to a month. I&apos;ve never had an instance of
            permanently lost test scores. For how to pull reports, watch this video:{" "}
            <a
              href="https://youtu.be/MYx9OdIuREw"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-500 hover:text-amber-600 underline underline-offset-2"
            >
              youtu.be/MYx9OdIuREw
            </a>
          </>
        ),
      },
    ],
  },
  {
    title: "Contact",
    items: [
      {
        question: "I have a question that's not answered here.",
        answer: (
          <>
            Email{" "}
            <a
              href="mailto:jackson@eaglesedge.com"
              className="text-amber-500 hover:text-amber-600 underline underline-offset-2"
            >
              jackson@eaglesedge.com
            </a>{" "}
            and I&apos;ll get back to you as soon as possible.
          </>
        ),
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-navy-800 px-6 py-4">
        <Link href="/" className="text-white font-bold text-lg tracking-tight hover:opacity-90">
          Eagles Edge
        </Link>
      </header>

      <main className="flex-1 px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/"
            className="text-sm text-slate-500 hover:text-navy-800 mb-8 inline-block transition-colors"
          >
            ← Back to home
          </Link>
          <h1 className="text-3xl font-bold text-navy-800 mb-2 tracking-tight">
            Frequently asked questions
          </h1>
          <p className="text-slate-500 mb-10">
            Answers to common questions about testing with Eagles Edge.
          </p>
          <div className="bg-white rounded-xl border border-slate-200 p-8">
            <FAQ sections={FAQ_SECTIONS} />
          </div>
        </div>
      </main>
    </div>
  );
}
