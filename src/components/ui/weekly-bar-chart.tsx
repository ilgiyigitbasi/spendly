import { colors } from "@/constants/theme";
import { BarChart } from "react-native-gifted-charts";

interface DayValue {
  label: string;
  value: number;
}

interface WeeklyBarChartProps {
  data: DayValue[];
  activeIndex?: number;
}

export function WeeklyBarChart({ data, activeIndex }: WeeklyBarChartProps) {
  const chartData = data.map((d, i) => ({
    value: d.value,
    label: d.label,
    frontColor: i === activeIndex ? colors.terracotta : colors.peach,
    labelTextStyle: {
      color: i === activeIndex ? colors.terracotta : colors.textMuted,
      fontFamily:
        i === activeIndex
          ? "PlusJakartaSans_700Bold"
          : "PlusJakartaSans_500Medium",
      fontSize: 12,
    },
  }));

  return (
    <BarChart
      data={chartData}
      barWidth={28}
      spacing={18}
      roundedTop
      barBorderRadius={8}
      hideRules
      hideYAxisText
      yAxisThickness={0}
      xAxisThickness={0}
      height={140}
      disablePress
      initialSpacing={8}
    />
  );
}
