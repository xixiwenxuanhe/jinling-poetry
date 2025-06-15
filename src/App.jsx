import React, { useState, useEffect } from 'react'
import { DataManager } from './utils/DataManager.js'
import { DataOverview } from './components/DataOverview/DataOverview.jsx'
import { DynastyChart } from './components/DynastyChart/DynastyChart.jsx'
import { SearchFilter } from './components/SearchFilter/SearchFilter.jsx'
import { PoemList } from './components/PoemList/PoemList.jsx'
import { Pagination } from './components/Pagination/Pagination.jsx'
import { WordCloudComponent } from './components/WordCloud/WordCloud.jsx'

// 主应用组件
export const App = () => {
  const [dataManager] = useState(() => new DataManager())
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({})
  const [dynastyStats, setDynastyStats] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [paginatedData, setPaginatedData] = useState({
    poems: [],
    totalItems: 0,
    currentPage: 1,
    totalPages: 1
  })
  const [selectedDynasty, setSelectedDynasty] = useState('')
  const [wordCloudPoems, setWordCloudPoems] = useState([])
  const itemsPerPage = 10

  // 初始化数据
  useEffect(() => {
    const initializeApp = async () => {
      setLoading(true)
      await dataManager.loadData('./data/金陵历朝诗歌.csv')
      
      // 更新统计数据
      setStats(dataManager.getStats())
      setDynastyStats(dataManager.getDynastyStats())
      
      // 初始化分页数据
      const initialPaginatedData = dataManager.getPaginatedPoems(1, itemsPerPage)
      setPaginatedData(initialPaginatedData)
      
      // 初始化词云数据（显示所有诗歌）
      setWordCloudPoems(dataManager.getAllPoems())
      
      setLoading(false)
    }

    initializeApp()
  }, [dataManager])

  // 处理筛选变化
  const handleFilterChange = (filters) => {
    dataManager.applyFilters(filters)
    setCurrentPage(1)
    const newPaginatedData = dataManager.getPaginatedPoems(1, itemsPerPage)
    setPaginatedData(newPaginatedData)
    
    // 更新选中的朝代和词云数据
    const dynasty = filters.dynasty || ''
    setSelectedDynasty(dynasty)
    setWordCloudPoems(dataManager.getPoemsByDynasty(dynasty))
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



  return (
    <div className="dashboard">
      {/* 顶部标题栏 */}
      <header className="dashboard-header">
        <h1 className="dashboard-title">数观千年</h1>
        <p className="dashboard-subtitle">金陵历朝诗韵数据可视化大屏</p>
      </header>

      {/* 主要内容区域 - 大屏布局 */}
      <main className="dashboard-main">
        {/* 顶部数据概览 */}
        <section className="dashboard-overview">
          <DataOverview stats={stats} />
        </section>

        {/* 中间区域 - 左右分栏 */}
        <section className="dashboard-content">
          {/* 左侧 - 朝代分布图表和词云 */}
          <div className="dashboard-left">
            <div className="panel">
              <h3 className="panel-title">朝代分布</h3>
              <DynastyChart dynastyStats={dynastyStats} />
            </div>
            <div className="word-cloud-panel">
              <div className="word-cloud-left">
                <WordCloudComponent 
                  poems={wordCloudPoems}
                  selectedDynasty={selectedDynasty}
                />
              </div>
              <div className="word-cloud-right">
                {/* 右侧区域暂时留空 */}
              </div>
            </div>
          </div>

          {/* 右侧 - 诗歌浏览 */}
          <div className="dashboard-right">
            <div className="panel">
              <h3 className="panel-title">诗歌浏览</h3>
              <SearchFilter 
                dynastyStats={dynastyStats} 
                onFilterChange={handleFilterChange} 
              />
              <div className="poem-display">
                <PoemList 
                  poems={paginatedData.poems}
                />
                <Pagination 
                  currentPage={paginatedData.currentPage}
                  totalItems={paginatedData.totalItems}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          </div>
        </section>
      </main>


    </div>
  )
} 