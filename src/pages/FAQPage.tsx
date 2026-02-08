import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const faqs = [
  {
    q: "How do I place an order?",
    a: "Add items to your cart, then proceed to checkout. Enter your contact and shipping details and place your order. We’ll confirm by email.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept major credit and debit cards. Payment and invoicing options can be discussed for trade or large orders.",
  },
  {
    q: "Can I return or exchange a carpet?",
    a: "Please contact us within 14 days of delivery for returns or exchanges. Items must be unused and in original packaging. Custom orders may not be returnable.",
  },
  {
    q: "Do you offer samples?",
    a: "Yes. Contact us to request samples for specific products. A small fee may apply, which is often credited against a future order.",
  },
];

export function FAQPage() {
  useDocumentTitle("FAQ | Carpet Company");
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Frequently asked questions</h1>
      <p className="mt-2 text-muted-foreground">
        Quick answers to common questions.
      </p>
      <div className="mt-8 space-y-4">
        {faqs.map((faq, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="text-base">{faq.q}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-muted-foreground">
              {faq.a}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
