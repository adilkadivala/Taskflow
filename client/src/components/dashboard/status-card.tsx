import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import type { LucideIcon } from "lucide-react";

interface statusCard {
  title?: string;
  count: string;
  precentage: string;
  taststast?: string;
  tastrasio?: string;
  icon?: LucideIcon | undefined;
}

const StatusCards = (cardItems: statusCard) => {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{cardItems.title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {cardItems.count}
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            {cardItems.icon && <cardItems.icon />}
            {cardItems.precentage}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {cardItems.taststast}
          {cardItems.icon && <cardItems.icon />}
        </div>
        <div className="text-muted-foreground">{cardItems.tastrasio}</div>
      </CardFooter>
    </Card>
  );
};

export default StatusCards;
