import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import colors from "tailwindcss/colors"
import {PieChart, Pie, ResponsiveContainer, Cell} from "recharts"
import { BarChart } from "lucide-react";

const COLORS = [
  colors.sky[500],
  colors.amber[500],
  colors.violet[500],
  colors.emerald[500],
  colors.rose[500],
]

export function PopularProductChart() {
  return (
    <Card className="col-span-3">
      <CardHeader className="pb-8">
        <div className="flex items-center justify-center">
          <CardTitle className="text-base font-medium">
            Produtos populares
          </CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground"/>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart style={{fontSize: 12}}>
            <Pie data={} dataKey="amount" nameKey="product" cx="50%" cy="50%" outerRadius={86} innerRadius={64} strokeWidth={8}
            labelLine={false}
            
            >
              <Cell key="cell-" fill={COLORS[]} className="stroke-background hover:opacity-80"/>
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

/**
 * 
 * label={({
              cx,
              cy,
              midAngle,
              innerRadius,
              outerRadius,
              value,
              index,
            }) => {
              const RADIAN = Math.PI / 180
              const radius = 12 + innerRadius + (outerRadius - innerRadius)
              const x = cx + radius * Math.cos(-midAngle * RADIAN)
              const y = cy + radius * Math.sin(-midAngle * RADIAN)

              return (
                <text
                  x={x}
                  y={y}
                  className="fill-muted-foreground text-xs"
                  textAnchor={x > cx ? 'start' : 'end'}
                  dominantBaseline="central"
                >
                  {popularProducts[index].product.length > 12
                    ? popularProducts[index].product
                        .substring(0, 12)
                        .concat('...')
                    : popularProducts[index].product}{' '}
                  ({value})
                </text>
              )
            }}
 */