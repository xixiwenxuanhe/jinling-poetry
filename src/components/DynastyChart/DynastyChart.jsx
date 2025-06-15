import React from 'react'
import styles from './DynastyChart.module.css'

// 朝代分布图表组件
export const DynastyChart = ({ dynastyStats }) => {
  const dynastyOrder = {
    '六朝': 1,
    '唐': 2,
    '宋': 3,
    '元': 4,
    '明': 5,
    '清': 6,
    '南唐': 7,
    '当代': 8
  }

  // 按朝代顺序排序
  const sortedDynasties = Object.entries(dynastyStats)
    .sort(([a], [b]) => (dynastyOrder[a] || 999) - (dynastyOrder[b] || 999))
  
  const maxCount = Math.max(...sortedDynasties.map(([, count]) => count))

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartBars}>
        {sortedDynasties.map(([dynasty, count]) => {
          const percentage = (count / maxCount) * 100
          return (
            <div key={dynasty} className={styles.chartBarContainer}>
              <div className={styles.chartBarLabel}>{dynasty}</div>
              <div className={styles.chartBarWrapper}>
                <div 
                  className={styles.chartBar} 
                  style={{ width: `${percentage}%` }}
                ></div>
                <div className={styles.chartBarValue}>{count}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 