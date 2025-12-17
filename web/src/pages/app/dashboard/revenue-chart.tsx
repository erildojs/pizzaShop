import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import colors from "tailwindcss/colors"
import {LineChart, Line, ResponsiveContainer, XAxis, YAxis} from "recharts"
export function RevenueChart() {
  return (
    <Card className="col-span-6">
      <CardHeader className="flex-row items-center justify-between pb-8">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">
            Receita no período
          </CardTitle>
          <CardDescription>Receita diária no período</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={[]} style={{fontSize: 12}}></LineChart>
          <XAxis dataKey="date" tickLine={false} axisLine={false} dy={16} />
          <YAxis stroke="#888" width={80} tickLine={false} axisLine={false} dy={16}
            tickFormatter={(value: number) => value.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}
          />
          <Line type="linear" strokeWidth={2} dataKey={revenue} stroke={colors['violet']['500']}/>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}