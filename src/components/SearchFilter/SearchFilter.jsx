import React, { useState, useCallback } from 'react'
import styles from './SearchFilter.module.css'

// 搜索和筛选组件
export const SearchFilter = ({ dynastyStats, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [dynasty, setDynasty] = useState('')
  const [searchType, setSearchType] = useState('all') // 'all', 'title', 'author', 'content'

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

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    onFilterChange({ searchTerm: value, dynasty, searchType })
  }

  const handleDynastyChange = (e) => {
    const value = e.target.value
    setDynasty(value)
    onFilterChange({ searchTerm, dynasty: value, searchType })
  }

  const handleSearchTypeChange = (e) => {
    const value = e.target.value
    setSearchType(value)
    onFilterChange({ searchTerm, dynasty, searchType: value })
  }

  const sortedDynasties = Object.keys(dynastyStats)
    .sort((a, b) => (dynastyOrder[a] || 999) - (dynastyOrder[b] || 999))

  const getPlaceholder = () => {
    switch(searchType) {
      case 'title': return '搜索诗歌标题...'
      case 'author': return '搜索作者姓名...'
      case 'content': return '搜索诗歌内容...'
      default: return '搜索诗歌标题、作者或内容...'
    }
  }

  return (
    <div className={styles.searchFilterContainer}>
      <div className={styles.searchBox}>
        <div className={styles.searchTypeSelector}>
          <select 
            value={searchType}
            onChange={handleSearchTypeChange}
            className={styles.searchTypeSelect}
          >
            <option value="all">全部</option>
            <option value="title">标题</option>
            <option value="author">作者</option>
            <option value="content">内容</option>
          </select>
        </div>
        <input 
          type="text" 
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder={getPlaceholder()}
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