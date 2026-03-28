import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { cn } from '@/lib/utils';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

interface CustomerKPIChartProps {
  title: string;
  data: any;
  type?: 'line' | 'bar';
  className?: string;
}

export function CustomerKPIChart({ title, data, type = 'line', className }: CustomerKPIChartProps) {
  return (
    <Card className={cn('transition-shadow hover:shadow-lg', className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {type === 'line' ? <Line data={data} /> : <Bar data={data} />}
      </CardContent>
    </Card>
  );
}
