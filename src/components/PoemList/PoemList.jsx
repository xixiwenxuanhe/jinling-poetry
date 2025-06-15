import React from 'react'
import styles from './PoemList.module.css'

// 诗歌列表组件
export const PoemList = ({ poems, loading, error }) => {
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <div className={styles.loadingText}>加载中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorMessage}>{error}</div>
      </div>
    )
  }

  if (poems.length === 0) {
    return <div className={styles.noResults}>未找到匹配的诗歌</div>
  }

  return (
    <div>
      {poems.map((poem, index) => (
        <div key={poem.id || index} className={styles.poemCard}>
          <div className={styles.poemHeader}>
            <h3 className={styles.poemTitle}>{poem.title}</h3>
            <div className={styles.poemMeta}>
              <span className={styles.poemAuthor}>{poem.author}</span>
              <span className={styles.poemDynasty}>{poem.dynasty}</span>
            </div>
          </div>
          <div className={styles.poemContent}>{poem.content}</div>
        </div>
      ))}
    </div>
  )
} 