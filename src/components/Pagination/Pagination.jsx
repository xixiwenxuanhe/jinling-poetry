import React, { useState } from 'react'
import styles from './Pagination.module.css'

// 分页组件
export const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const [jumpPage, setJumpPage] = useState('')

  if (totalPages <= 1) {
    return null
  }

  const generatePageNumbers = () => {
    const pages = []
    const totalSlots = 7 // 固定7个位置：首页 + 省略号/页码 + 省略号/页码 + 省略号/页码 + 省略号/页码 + 省略号/页码 + 末页
    
    if (totalPages <= 7) {
      // 总页数少于等于7页，显示所有页码，其余位置用null填充
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
      // 用null填充剩余位置
      while (pages.length < totalSlots) {
        pages.push(null)
      }
    } else {
      // 总页数大于7页，使用固定7个位置的策略
      
      if (currentPage <= 4) {
        // 当前页靠近开头: 1 2 3 4 5 ... 末页
        pages.push(1, 2, 3, 4, 5, '...', totalPages)
      } else if (currentPage >= totalPages - 3) {
        // 当前页靠近结尾: 1 ... 末页-4 末页-3 末页-2 末页-1 末页
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        // 当前页在中间: 1 ... 当前页-1 当前页 当前页+1 ... 末页
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
      }
    }
    
    return pages
  }

  const pages = generatePageNumbers()

  const handleJumpPageChange = (e) => {
    const value = e.target.value
    // 只允许输入数字
    if (value === '' || /^\d+$/.test(value)) {
      setJumpPage(value)
    }
  }

  const handleJumpPageSubmit = (e) => {
    e.preventDefault()
    const pageNum = parseInt(jumpPage)
    if (pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum)
      setJumpPage('')
    }
  }

  const handleJumpPageKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleJumpPageSubmit(e)
    }
  }

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
        
        <div className={styles.paginationPages}>
          {pages.map((page, index) => {
            if (page === '...') {
              // 省略号不可点击
              return (
                <span key={`ellipsis-${index}`} className={styles.ellipsis}>
                  ...
                </span>
              )
            } else if (page === null) {
              // 空位置，保持布局但不显示内容
              return <div key={index} className={styles.paginationPlaceholder}></div>
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
        </div>
        
        <button 
          className={`${styles.paginationBtn} ${currentPage === totalPages ? styles.disabled : ''}`}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          下一页
        </button>
        
        <div className={styles.jumpToPage}>
          <span className={styles.jumpLabel}>跳转到</span>
          <input
            type="text"
            value={jumpPage}
            onChange={handleJumpPageChange}
            onKeyPress={handleJumpPageKeyPress}
            placeholder="页码"
            className={styles.jumpInput}
            maxLength="4"
          />
          <button 
            className={styles.jumpBtn}
            onClick={handleJumpPageSubmit}
            disabled={!jumpPage || parseInt(jumpPage) < 1 || parseInt(jumpPage) > totalPages}
          >
            跳转
          </button>
        </div>
      </div>
    </div>
  )
} 