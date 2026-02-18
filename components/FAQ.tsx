type FAQItem = {
  question: string;
  answer: string;
};

export function FAQ({ items }: { items: FAQItem[] }) {
  return (
    <dl className="space-y-8">
      {items.map((item, i) => (
        <div key={i}>
          <dt className="text-lg font-semibold text-slate-900 mb-2">
            {item.question}
          </dt>
          <dd className="text-slate-600 leading-relaxed">
            {item.answer}
          </dd>
        </div>
      ))}
    </dl>
  );
}
