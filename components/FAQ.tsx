type FAQItem = {
  question: string;
  answer: string;
};

export function FAQ({ items }: { items: FAQItem[] }) {
  return (
    <dl className="divide-y divide-slate-100">
      {items.map((item, i) => (
        <div key={i} className="py-6 first:pt-0 last:pb-0">
          <dt className="text-base font-semibold text-navy-800 mb-2">
            {item.question}
          </dt>
          <dd className="text-slate-600 text-sm leading-relaxed">
            {item.answer}
          </dd>
        </div>
      ))}
    </dl>
  );
}
