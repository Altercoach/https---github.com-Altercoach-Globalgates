import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface KPIWidgetProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: string;
  className?: string;
}

export function KPIWidget({ title, value, description, icon, trend, trendValue, color, className }: KPIWidgetProps) {
  return (
    <Card className={cn('transition-shadow hover:shadow-lg', className)} style={color ? { borderColor: color } : {}}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        {trend && (
          <span className={cn('text-xs font-semibold', trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-muted-foreground')}>
            {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '•'} {trendValue}
          </span>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}
