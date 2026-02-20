import Link from "next/link";

type FAQItem = {
  question: string;
  answer: React.ReactNode;
};

type FAQSection = {
  title: string;
  items: FAQItem[];
};

export function FAQ({ sections }: { sections: FAQSection[] }) {
  return (
    <div className="space-y-10">
      {sections.map((section) => (
        <div key={section.title}>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-4">
            {section.title}
          </h2>
          <dl className="divide-y divide-slate-100">
            {section.items.map((item, i) => (
              <div key={i} className="py-5 first:pt-0 last:pb-0">
                <dt className="text-sm font-semibold text-navy-800 mb-1.5">
                  {item.question}
                </dt>
                <dd className="text-slate-600 text-sm leading-relaxed">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}
