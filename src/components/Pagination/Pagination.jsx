import React from 'react'
import styles from './Pagination.module.css'

// 分页组件
export const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  if (totalPages <= 1) {
    return null
  }

  const generatePageNumbers = () => {
    const pages = []
    const maxVisiblePages = 7
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      const halfVisible = Math.floor(maxVisiblePages / 2)
      let startPage = Math.max(1, currentPage - halfVisible)
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
      
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1)
      }
      
      if (startPage > 1) {
        pages.push(1)
        if (startPage > 2) {
          pages.push('...')
        }
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('...')
        }
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  const pages = generatePageNumbers()

  return (
    <div className={styles.paginationContainer}>
      <div className={styles.paginationInfo}>
        显示第 {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalItems)} 条，共 {totalItems} 条
      </div>
      <div className={styles.paginationControls}>
        <button 
          className={`${styles.paginationBtn} ${currentPage === 1 ? styles.disabled : ''}`}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          上一页
        </button>
        
        {pages.map((page, index) => {
          if (page === '...') {
            return <span key={index} className={styles.paginationEllipsis}>...</span>
          } else {
            return (
              <button 
                key={page}
                className={`${styles.paginationBtn} ${page === currentPage ? styles.active : ''}`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            )
          }
        })}
        
        <button 
          className={`${styles.paginationBtn} ${currentPage === totalPages ? styles.disabled : ''}`}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          下一页
        </button>
      </div>
    </div>
  )
} 