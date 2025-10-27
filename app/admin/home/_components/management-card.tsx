import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ManagementCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  href: string;
  buttonText: string;
}

export default function ManagementCard({
  title,
  description,
  icon: Icon,
  iconColor,
  href,
  buttonText,
}: ManagementCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className={`h-6 w-6 ${iconColor}`} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <p className="text-gray-600 flex-1">{description}</p>
        <Link href={href} className="block mt-4">
          <Button className="w-full" size="lg">
            {buttonText}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
