import { useMemo } from 'react';
import styles from './LineChart.module.css';

function LineChart({ data, unit = 'days' }) {
  // Calculate chart dimensions and scaling
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;

    const maxValue = Math.max(...data.map(item => item.value), 1); // At least 1 for scaling

    return {
      bars: data.map((item) => ({
        ...item,
        heightPercent: maxValue > 0 ? (item.value / maxValue) * 100 : 0,
      })),
      maxValue,
    };
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No data available. Add some applications to see the trend.</p>
      </div>
    );
  }

  return (
    <div className={styles.chartContainer}>
      {/* Y-axis with label */}
      <div className={styles.yAxisContainer}>
        <div className={styles.yAxisTitle}># of Applications</div>
      </div>

      {/* Bar chart */}
      <div className={styles.chartArea}>
        <div className={styles.barsContainer}>
          {chartData.bars.map((bar, index) => (
            <div key={index} className={styles.barWrapper}>
              {bar.value > 0 ? (
                <div 
                  className={styles.bar}
                  style={{ height: `${bar.heightPercent}%` }}
                  title={`${bar.label}: ${bar.value} application${bar.value !== 1 ? 's' : ''}`}
                >
                  <span className={styles.barValue}>{bar.value}</span>
                </div>
              ) : (
                <div className={styles.emptyBarPlaceholder}>
                  <span className={styles.noneText}>None</span>
                </div>
              )}
              <span className={styles.xLabel}>{bar.label}</span>
            </div>
          ))}
        </div>
        {/* X-axis label */}
        <div className={styles.xAxisTitle}>Timeline ({unit})</div>
      </div>
    </div>
  );
}

export default LineChart;
