import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface CustomerKPIWidgetProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  color?: string;
  className?: string;
}

export function CustomerKPIWidget({ title, value, description, icon, color, className }: CustomerKPIWidgetProps) {
  return (
    <Card className={cn('transition-shadow hover:shadow-lg', className)} style={color ? { borderColor: color } : {}}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}
