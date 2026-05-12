import { Card, CardContent } from "@/components/ui/card";

export function AuthCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Card className="w-full max-w-md border-none shadow-2xl">
      <CardContent className="p-8">
        {children}
      </CardContent>
    </Card>
  );
}