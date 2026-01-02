import { useMemo } from 'react';
import styles from './FunnelChart.module.css';

function FunnelChart({ data }) {
  // Calculate segments with percentages and proportional widths
  const segments = useMemo(() => {
    if (!data || data.length === 0) return [];

    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    return data.map((item) => {
      const percentage = total > 0 ? (item.value / total) * 100 : 0;
      // Calculate width as percentage of total (minimum 20%, maximum 100%)
      const widthPercentage = total > 0 ? (item.value / total) * 100 : 0;
      const width = Math.max(20, Math.min(100, widthPercentage));
      
      return {
        ...item,
        percentage: percentage.toFixed(1),
        displayPercentage: percentage.toFixed(1),
        width: width
      };
    });
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No data available for funnel chart</p>
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

