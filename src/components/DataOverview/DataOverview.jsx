import React from 'react'
import styles from './DataOverview.module.css'

// 数据概览组件
export const DataOverview = ({ stats }) => {
  const { poemCount, authorCount, dynastyCount, timeSpan } = stats

  return (
    <div className={styles.overviewGrid}>
      <div className={styles.statCard}>
        <div className={styles.statNumber}>{poemCount.toLocaleString()}</div>
        <div className={styles.statLabel}>诗歌总数</div>
      </div>
      <div className={styles.statCard}>
        <div className={styles.statNumber}>{authorCount.toLocaleString()}</div>
        <div className={styles.statLabel}>诗人总数</div>
      </div>
      <div className={styles.statCard}>
        <div className={styles.statNumber}>{dynastyCount}</div>
        <div className={styles.statLabel}>朝代数量</div>
      </div>
      <div className={styles.statCard}>
        <div className={styles.statNumber}>{timeSpan}</div>
        <div className={styles.statLabel}>时间跨度</div>
      </div>
    </div>
  )
} 