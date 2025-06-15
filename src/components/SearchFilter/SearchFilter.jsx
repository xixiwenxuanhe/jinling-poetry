import React, { useState, useCallback } from 'react'
import styles from './SearchFilter.module.css'

// 搜索和筛选组件
export const SearchFilter = ({ dynastyStats, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [dynasty, setDynasty] = useState('')

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

  // 防抖处理搜索
  const debounce = useCallback((func, wait) => {
    let timeout
    return (...args) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }, [])

  const debouncedFilterChange = useCallback(
    debounce((filters) => onFilterChange(filters), 300),
    [onFilterChange]
  )

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    debouncedFilterChange({ searchTerm: value, dynasty })
  }

  const handleDynastyChange = (e) => {
    const value = e.target.value
    setDynasty(value)
    onFilterChange({ searchTerm, dynasty: value })
  }

  const sortedDynasties = Object.keys(dynastyStats)
    .sort((a, b) => (dynastyOrder[a] || 999) - (dynastyOrder[b] || 999))

  return (
    <div className={styles.searchFilterContainer}>
      <div className={styles.searchBox}>
        <input 
          type="text" 
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="搜索诗歌标题、作者或内容..."
          className={styles.searchInput}
        />
      </div>
      <div className={styles.filterBox}>
        <select 
          value={dynasty}
          onChange={handleDynastyChange}
          className={styles.dynastyFilter}
        >
          <option value="">全部朝代</option>
          {sortedDynasties.map(dynasty => (
            <option key={dynasty} value={dynasty}>
              {dynasty} ({dynastyStats[dynasty]})
            </option>
          ))}
        </select>
      </div>
    </div>
  )
} 