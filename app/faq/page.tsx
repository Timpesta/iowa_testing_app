import Link from "next/link";
import { FAQ } from "@/components/FAQ";

const PLACEHOLDER_FAQS = [
  {
    question: "How do I register my school?",
    answer:
      'From the home page, click "School Login" and then "Register your school." Submit your school name, contact name, and contact email. Your request will be reviewed; you\'ll receive an email when your account is approved.',
  },
  {
    question: "When is the testing window?",
    answer:
      "Testing cycles (Fall and Spring) are set by the portal administrator. After you're approved, log in and check your dashboard for the current cycle and any deadlines.",
  },
  {
    question: "How do I add students?",
    answer:
      'After logging in, go to Roster and click "Add student." Enter the student\'s first name, last name, date of birth (MM/DD/YYYY), gender, and grade. A unique Student ID is generated automatically.',
  },
  {
    question: "Who do I contact for help?",
    answer:
      "For technical or process questions, contact the Eagles Edge Testing administrator. Contact details will be updated here once finalized.",
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-navy-800 px-6 py-4">
        <Link href="/" className="text-white font-bold text-lg tracking-tight hover:opacity-90">
          Eagles Edge Testing
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
            Answers to common questions about the testing portal.
          </p>
          <div className="bg-white rounded-xl border border-slate-200 p-8">
            <FAQ items={PLACEHOLDER_FAQS} />
          </div>
        </div>
      </main>
    </div>
  );
}
