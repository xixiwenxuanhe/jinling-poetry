import React, { useState, useEffect } from 'react'
import { DataManager } from './utils/DataManager.js'
import { DataOverview } from './components/DataOverview/DataOverview.jsx'
import { DynastyChart } from './components/DynastyChart/DynastyChart.jsx'
import { SearchFilter } from './components/SearchFilter/SearchFilter.jsx'
import { PoemList } from './components/PoemList/PoemList.jsx'
import { Pagination } from './components/Pagination/Pagination.jsx'

// 主应用组件
export const App = () => {
  const [dataManager] = useState(() => new DataManager())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({})
  const [dynastyStats, setDynastyStats] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [paginatedData, setPaginatedData] = useState({
    poems: [],
    totalItems: 0,
    currentPage: 1,
    totalPages: 1
  })
  const itemsPerPage = 10

  // 初始化数据
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true)
        await dataManager.loadData('./data/金陵历朝诗歌.csv')
        
        // 更新统计数据
        setStats(dataManager.getStats())
        setDynastyStats(dataManager.getDynastyStats())
        
        // 初始化分页数据
        const initialPaginatedData = dataManager.getPaginatedPoems(1, itemsPerPage)
        setPaginatedData(initialPaginatedData)
        
        setLoading(false)
      } catch (err) {
        console.error('应用初始化失败:', err)
        setError('数据加载失败，请刷新页面重试')
        setLoading(false)
      }
    }

    initializeApp()
  }, [dataManager])

  // 处理筛选变化
  const handleFilterChange = (filters) => {
    dataManager.applyFilters(filters)
    setCurrentPage(1)
    const newPaginatedData = dataManager.getPaginatedPoems(1, itemsPerPage)
    setPaginatedData(newPaginatedData)
  }

  // 处理分页变化
  const handlePageChange = (page) => {
    setCurrentPage(page)
    const newPaginatedData = dataManager.getPaginatedPoems(page, itemsPerPage)
    setPaginatedData(newPaginatedData)
    
    // 滚动到顶部
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <div className="loading-text">正在加载诗歌数据...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-overlay">
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <div className="error-message">{error}</div>
          <button className="error-retry" onClick={() => window.location.reload()}>
            重新加载
          </button>
        </div>
      </div>
    )
  }

  return (
    <div id="app">
      {/* 页面头部 */}
      <header className="header">
        <div className="container">
          <h1 className="main-title">数观千年</h1>
          <p className="subtitle">金陵历朝诗韵数据可视化</p>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="main-content">
        <div className="container">
          {/* 数据概览 */}
          <section className="overview">
            <h2>数据概览</h2>
            <DataOverview stats={stats} />
          </section>

          {/* 朝代分布 */}
          <section className="dynasty-section">
            <h2>朝代分布</h2>
            <DynastyChart dynastyStats={dynastyStats} />
          </section>

          {/* 诗歌列表 */}
          <section className="poem-section">
            <h2>诗歌浏览</h2>
            <SearchFilter 
              dynastyStats={dynastyStats} 
              onFilterChange={handleFilterChange} 
            />
            <PoemList 
              poems={paginatedData.poems}
              loading={false}
              error={null}
            />
            <Pagination 
              currentPage={paginatedData.currentPage}
              totalItems={paginatedData.totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          </section>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2023 ChinaVis数据可视化挑战赛 - 数观千年项目</p>
        </div>
      </footer>
    </div>
  )
} 