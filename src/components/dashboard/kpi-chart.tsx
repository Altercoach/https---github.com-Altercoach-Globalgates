import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import type { ChartData } from 'chart.js';
import { cn } from '@/lib/utils';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

interface KPIChartProps {
  title: string;
  data: ChartData<'line'> | ChartData<'bar'>;
  type?: 'line' | 'bar';
  className?: string;
}

export function KPIChart({ title, data, type = 'line', className }: KPIChartProps) {
  return (
    <Card className={cn('transition-shadow hover:shadow-lg', className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {type === 'line' ? <Line data={data as ChartData<'line'>} /> : <Bar data={data as ChartData<'bar'>} />}
      </CardContent>
    </Card>
  );
}
