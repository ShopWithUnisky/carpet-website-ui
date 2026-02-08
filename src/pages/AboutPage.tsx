import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function AboutPage() {
  useDocumentTitle("About | Carpet Company");
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">About us</h1>
      <p className="mt-2 text-muted-foreground">
        Learn more about Carpet Company and our commitment to quality.
      </p>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Our story</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            We source and curate premium carpets for homes and spaces. Every piece is chosen for quality, comfort, and timeless design.
          </p>
          <p>
            Contact us for custom orders, trade enquiries, or any questions—we’re here to help.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
