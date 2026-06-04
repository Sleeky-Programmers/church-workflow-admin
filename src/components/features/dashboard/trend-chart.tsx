'use client';

import { useState } from 'react';
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Span, Text } from '@/components/ui/typography/Text';
import { cn } from '@/lib/utils';

type TrendType = 'attendance' | 'income';

interface TrendChartProps {
	attendanceData: any[];
	incomeData: any[];
}

export function TrendChart({ attendanceData, incomeData }: TrendChartProps) {
	const [trend, setTrend] = useState<TrendType>('attendance');

	const isAttendance = trend === 'attendance';
	const data = isAttendance ? attendanceData : incomeData;
	const hasData = data.length > 0;

	return (
		<Card className="rounded-3xl p-3">
			<CardContent>
				<div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm">
					<Button
						onClick={() => setTrend('attendance')}
						variant="link"
						className={cn('px-0 font-medium', isAttendance ? 'text-primary-600' : 'text-muted-foreground')}>
						Attendance Trend
					</Button>

					{/* Might be used later on */}
					{/* <Button
            onClick={() => setTrend("income")}
            variant="link"
            className={cn(
              "px-0 font-medium",
              !isAttendance ? "text-primary-600" : "text-muted-foreground",
            )}
          >
            Income Growth
          </Button> */}
				</div>

				<div className="mt-4">
					{hasData ? (
						<ChartContainer
							className="w-full aspect-auto h-[260px] sm:h-[300px] overflow-hidden p-2 sm:p-4"
							config={{
								thisMonth: { color: '#2563EB' },
								lastMonth: { color: '#93C5FD' },
							}}>
							<LineChart
								data={data}
								margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="#E6E6E6"
								/>
								<XAxis
									dataKey="month"
									tickLine={false}
									axisLine={false}
								/>
								<YAxis
									tickLine={false}
									axisLine={false}
									width={32}
								/>
								<Tooltip content={<ChartTooltipContent />} />

								<Line
									type="monotone"
									dataKey="thisMonth"
									stroke="var(--color-thisMonth)"
									strokeWidth={2.5}
									dot={false}
								/>

								<Line
									type="monotone"
									dataKey="lastMonth"
									stroke="var(--color-lastMonth)"
									strokeWidth={2}
									strokeDasharray="4 4"
									dot={false}
								/>
							</LineChart>
						</ChartContainer>
					) : (
						<div className="h-[260px] sm:h-[300px] flex items-center justify-center text-sm text-muted-foreground">No trend data available yet.</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
