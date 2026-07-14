import { Icon } from "@iconify/react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatisticsCardProps = {
  categories: {
    title: string;
    cardIcon: string;
    score: number;
    models: number;
  }[];
};

const StatisticsCard = ({ categories }: StatisticsCardProps) => {
  return (
    <div className="max-w-7xl mx-auto w-full">
      <Card className="p-0">
        <CardContent className="flex w-full flex-wrap items-stretch gap-y-2 px-0">
          {categories.map((item, index) => {
            return (
              <div
                className="flex min-w-55 flex-1 border-e border-b border-border last:border-e-0"
                key={index}
              >
                <div className="p-6 w-full">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-start">
                      <h5 className="text-base font-medium">{item.title}</h5>
                      <div
                        className={cn(
                          "p-3 rounded-full outline outline-border text-primary border ",
                          Number(item.score) > 50
                            ? "border-primary/20"
                            : "border-destructive/20",
                        )}
                      >
                        <Icon
                          icon={item.cardIcon}
                          className={cn(
                            "size-4",
                            Number(item.score) > 50
                              ? "text-green-500"
                              : "text-red-500",
                          )}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h5
                        className={cn(
                          "text-2xl font-semibold",
                          Number(item.score) > 50
                            ? "text-green-500"
                            : "text-red-500",
                        )}
                      >
                        {item.score}
                      </h5>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground">
                          Total {item.models} Models
                        </p>
                        {/* <Badge
                          className={`${item.badgeColor} text-muted-foreground`}
                        >
                          <div className="flex items-center gap-1">
                            {item.statusValue}
                            <Icon
                              icon={item.statusIcon}
                              width={14}
                              height={14}
                            />
                          </div>
                        </Badge> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};
export default StatisticsCard;
