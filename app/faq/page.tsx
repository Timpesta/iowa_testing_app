import Link from "next/link";
import { FAQ } from "@/components/FAQ";

const PLACEHOLDER_FAQS = [
  {
    question: "How do I register my school?",
    answer:
      "From the home page, click “School Login” and then “Register your school.” Submit your school name, contact name, and contact email. Your request will be reviewed; you’ll receive an email when your account is approved.",
  },
  {
    question: "When is the testing window?",
    answer:
      "Testing cycles (Fall and Spring) are set by the portal administrator. After you’re approved, log in and check your dashboard for the current cycle and any deadlines.",
  },
  {
    question: "How do I add students?",
    answer:
      "After logging in, go to Roster and click “Add student.” Enter the student’s first name, last name, date of birth (MM/DD/YYYY), gender, and grade. A unique Student ID is generated automatically.",
  },
  {
    question: "Who do I contact for help?",
    answer:
      "For technical or process questions, contact the Iowa Testing Portal administrator. Contact details will be updated here once finalized.",
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="text-sm text-slate-500 hover:text-slate-700 mb-8 inline-block"
        >
          ← Back to home
        </Link>
        <h1 className="text-2xl font-semibold text-slate-900 mb-8">
          Frequently asked questions
        </h1>
        <FAQ items={PLACEHOLDER_FAQS} />
      </div>
    </main>
  );
}
