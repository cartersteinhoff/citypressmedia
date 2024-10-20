import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';

import { fNumber, fPercent } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';
import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title: string;
  total: number;
  percent?: number; // Make percent optional
  addedToday?: number; // New prop for added today
  addedYesterday?: number; // New prop for added yesterday
  addedLast7Days?: number; // New prop for added in last 7 days
  addedLast30Days?: number; // New prop for added in last 30 days
  chart?: {
    // Make chart optional
    colors?: string[];
    categories: string[];
    series: number[];
    options?: ChartOptions;
  };
};

export function AppWidgetSummaryEnhanced({
  title,
  percent,
  total,
  addedToday, // Added
  addedYesterday, // Added
  addedLast7Days, // Added
  addedLast30Days, // Added
  chart,
  sx,
  ...other
}: Props) {
  const theme = useTheme();

  const chartColors = chart?.colors ?? [theme.palette.primary.main];

  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    colors: chartColors,
    stroke: { width: 0 },
    xaxis: { categories: chart?.categories ?? [] },
    tooltip: {
      y: { formatter: (value: number) => fNumber(value), title: { formatter: () => '' } },
    },
    plotOptions: { bar: { borderRadius: 1.5, columnWidth: '64%' } },
    ...chart?.options,
  });

  return (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 3,
        ...sx,
      }}
      {...other}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ fontSize: '26px', fontWeight: 'light' }}>{title}</Box>
        <Box sx={{ mt: 0.25, mb: 1, typography: 'h3' }}>Total: {fNumber(total)}</Box>

        {/* Conditionally render additional stats */}
        {addedToday !== undefined && (
          <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
            Today: {fNumber(addedToday)}
          </Box>
        )}

        {addedYesterday !== undefined && (
          <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
            Yesterday: {fNumber(addedYesterday)}
          </Box>
        )}

        {addedLast7Days !== undefined && (
          <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
            Last 7 Days: {fNumber(addedLast7Days)}
          </Box>
        )}

        {addedLast30Days !== undefined && (
          <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
            Last 30 Days: {fNumber(addedLast30Days)}
          </Box>
        )}

        {percent !== undefined && (
          <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
            <Iconify
              width={24}
              icon={
                percent < 0
                  ? 'solar:double-alt-arrow-down-bold-duotone'
                  : 'solar:double-alt-arrow-up-bold-duotone'
              }
              sx={{
                flexShrink: 0,
                color: 'success.main',
                ...(percent < 0 && { color: 'error.main' }),
              }}
            />
            <Box component="span" sx={{ typography: 'subtitle2' }}>
              {percent > 0 && '+'}
              {fPercent(percent)}
            </Box>
            <Box component="span" sx={{ typography: 'body2', color: 'text.secondary' }}>
              last 7 days
            </Box>
          </Box>
        )}
      </Box>

      {chart && (
        <Chart
          type="bar"
          series={[{ data: chart.series }]}
          options={chartOptions}
          width={60}
          height={40}
        />
      )}
    </Card>
  );
}
