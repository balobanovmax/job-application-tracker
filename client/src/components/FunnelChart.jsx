import { useMemo } from 'react';
import styles from './FunnelChart.module.css';

function FunnelChart({ data }) {
  const segments = useMemo(() => {
    if (!data || data.length === 0) return [];

    const total = data.reduce((sum, item) => sum + item.value, 0);
    const maxValue = Math.max(...data.map((item) => item.value), 1);

    return data.map((item) => {
      const percentage = total > 0 ? (item.value / total) * 100 : 0;
      const widthPercentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;

      return {
        ...item,
        displayPercentage: percentage.toFixed(1),
        width: Math.max(widthPercentage, item.value > 0 ? 32 : 20),
      };
    });
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No data available for proportional blocks</p>
      </div>
    );
  }

  return (
    <div className={styles.funnelContainer}>
      <div className={styles.funnel}>
        {segments.map((segment) => (
          <div
            key={segment.label}
            className={styles.funnelSegment}
            style={{
              backgroundColor: segment.color,
              width: `${segment.width}%`,
            }}
          >
            <div className={styles.segmentContent}>
              <span className={styles.segmentValue}>{segment.value}</span>
              <span className={styles.segmentLabel}>{segment.label}</span>
              <span className={styles.segmentPercentage}>
                {segment.displayPercentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FunnelChart;
