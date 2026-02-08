import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from "@/components/ui/empty";

export function PaymentMethodsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment methods</CardTitle>
        <CardDescription>
          Add or remove cards and other payment options for checkout
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" x2="22" y1="10" y2="10" />
              </svg>
            </EmptyMedia>
            <EmptyTitle>No payment methods</EmptyTitle>
            <EmptyDescription>
              Add a card or other payment method to speed up checkout.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button>Add payment method</Button>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  );
}
