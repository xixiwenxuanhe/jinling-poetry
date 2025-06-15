import './style.css'

// 应用状态
const appState = {
  allPoems: [],
  filteredPoems: [],
  currentPage: 1,
  poemsPerPage: 10,
  dynastyStats: {},
  authorStats: {}
}

// 朝代顺序映射（用于排序）
const dynastyOrder = {
  '六朝': 1,
  '唐': 2,
  '宋': 3,
  '元': 4,
  '明': 5,
  '清': 6,
  '当代': 7
}

// 初始化应用
async function init() {
  console.log('正在初始化应用...')
  try {
    await loadPoemsData()
    calculateStats()
    renderOverview()
    renderDynastyChart()
    renderDynastyFilter()
    renderPoemList()
    bindEvents()
    console.log('应用初始化完成')
  } catch (error) {
    console.error('应用初始化失败:', error)
    showError('数据加载失败，请检查网络连接')
  }
}

// 加载诗歌数据
async function loadPoemsData() {
  console.log('正在加载诗歌数据...')
  try {
    const response = await fetch('/data/金陵历朝诗歌.csv')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const csvText = await response.text()
    appState.allPoems = parseCSV(csvText)
    appState.filteredPoems = [...appState.allPoems]
    console.log(`成功加载 ${appState.allPoems.length} 首诗歌`)
  } catch (error) {
    console.error('数据加载错误:', error)
    throw error
  }
}

// 解析CSV数据
function parseCSV(csvText) {
  const lines = csvText.trim().split('\n')
  const headers = parseCSVLine(lines[0])
  const poems = []

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      try {
        const values = parseCSVLine(lines[i])
        const poem = {}
        headers.forEach((header, index) => {
          poem[header] = values[index] || ''
        })
        
        // 数据清理 - 去除引号并清理空白字符
        poem.id = poem.id?.toString().replace(/"/g, '').trim() || ''
        poem.title = poem.title?.replace(/"/g, '').trim() || ''
        poem.author = poem.author?.replace(/"/g, '').trim() || ''
        poem.content = poem.content?.replace(/"/g, '').trim() || ''
        poem.dynasty = poem.dynasty?.replace(/"/g, '').trim() || ''
        
        // 只要标题、作者、内容、朝代都存在就添加
        if (poem.title && poem.author && poem.content && poem.dynasty) {
          poems.push(poem)
        }
      } catch (error) {
        console.warn(`跳过第 ${i + 1} 行数据，解析错误:`, error)
      }
    }
  }
  
  return poems
}

// 解析CSV行（处理引号和逗号）
function parseCSVLine(line) {
  const result = []
  let current = ''
  let inQuotes = false
  let i = 0
  
  while (i < line.length) {
    const char = line[i]
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // 处理双引号转义
        current += '"'
        i += 2
      } else {
        // 切换引号状态
        inQuotes = !inQuotes
        i++
      }
    } else if (char === ',' && !inQuotes) {
      // 遇到分隔符且不在引号内
      result.push(current.trim())
      current = ''
      i++
    } else {
      current += char
      i++
    }
  }
  
  // 添加最后一个字段
  result.push(current.trim())
  return result
}

// 计算统计数据
function calculateStats() {
  // 朝代统计
  appState.dynastyStats = {}
  appState.authorStats = {}
  
  appState.allPoems.forEach(poem => {
    // 朝代统计
    appState.dynastyStats[poem.dynasty] = (appState.dynastyStats[poem.dynasty] || 0) + 1
    
    // 作者统计
    appState.authorStats[poem.author] = (appState.authorStats[poem.author] || 0) + 1
  })
  

}

// 渲染数据概览
function renderOverview() {
  const totalPoems = appState.allPoems.length
  const totalAuthors = Object.keys(appState.authorStats).length
  const dynastyCount = Object.keys(appState.dynastyStats).length
  const timeSpan = getTimeSpan()
  
  document.getElementById('total-poems').textContent = totalPoems.toLocaleString()
  document.getElementById('total-authors').textContent = totalAuthors.toLocaleString()
  document.getElementById('dynasty-count').textContent = dynastyCount
  document.getElementById('time-span').textContent = timeSpan
}

// 获取时间跨度
function getTimeSpan() {
  const dynasties = Object.keys(appState.dynastyStats)
  if (dynasties.includes('六朝') && dynasties.includes('当代')) {
    return '1500+ 年'
  } else if (dynasties.includes('六朝')) {
    return '1000+ 年'
  } else {
    return '数百年'
  }
}

// 渲染朝代分布图表
function renderDynastyChart() {
  const chartContainer = document.getElementById('dynasty-chart')
  chartContainer.innerHTML = ''
  
  // 按朝代顺序排序
  const sortedDynasties = Object.entries(appState.dynastyStats)
    .sort(([a], [b]) => (dynastyOrder[a] || 999) - (dynastyOrder[b] || 999))
  
  const maxCount = Math.max(...sortedDynasties.map(([, count]) => count))
  
  // 创建柱状图
  const chartHTML = `
    <div class="chart-title">各朝代诗歌数量分布</div>
    <div class="chart-bars">
      ${sortedDynasties.map(([dynasty, count]) => {
        const percentage = (count / maxCount) * 100
        return `
          <div class="chart-bar-container">
            <div class="chart-bar-label">${dynasty}</div>
            <div class="chart-bar-wrapper">
              <div class="chart-bar" style="width: ${percentage}%"></div>
              <div class="chart-bar-value">${count}</div>
            </div>
          </div>
        `
      }).join('')}
    </div>
  `
  
  chartContainer.innerHTML = chartHTML
  
  // 添加图表样式
  const chartStyle = `
    <style>
      .chart-title {
        font-size: 1.2rem;
        font-weight: 600;
        text-align: center;
        margin-bottom: 1.5rem;
        color: var(--primary-color);
      }
      .chart-bars {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .chart-bar-container {
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      .chart-bar-label {
        min-width: 60px;
        font-weight: 500;
        color: var(--primary-color);
      }
      .chart-bar-wrapper {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .chart-bar {
        height: 30px;
        background: linear-gradient(90deg, var(--accent-color), var(--secondary-color));
        border-radius: 4px;
        min-width: 20px;
        transition: all 0.3s ease;
      }
      .chart-bar:hover {
        opacity: 0.8;
        transform: scaleY(1.1);
      }
      .chart-bar-value {
        font-weight: 600;
        color: var(--dark-color);
        min-width: 30px;
      }
    </style>
  `
  
  if (!document.getElementById('chart-styles')) {
    const styleElement = document.createElement('div')
    styleElement.id = 'chart-styles'
    styleElement.innerHTML = chartStyle
    document.head.appendChild(styleElement)
  }
}

// 渲染朝代筛选器
function renderDynastyFilter() {
  const filterSelect = document.getElementById('dynasty-filter')
  const sortedDynasties = Object.keys(appState.dynastyStats)
    .sort((a, b) => (dynastyOrder[a] || 999) - (dynastyOrder[b] || 999))
  
  filterSelect.innerHTML = '<option value="">全部朝代</option>'
  sortedDynasties.forEach(dynasty => {
    const option = document.createElement('option')
    option.value = dynasty
    option.textContent = `${dynasty} (${appState.dynastyStats[dynasty]})`
    filterSelect.appendChild(option)
  })
}

// 渲染诗歌列表
function renderPoemList() {
  const container = document.getElementById('poem-list')
  const startIndex = (appState.currentPage - 1) * appState.poemsPerPage
  const endIndex = startIndex + appState.poemsPerPage
  const poemsToShow = appState.filteredPoems.slice(startIndex, endIndex)
  
  if (poemsToShow.length === 0) {
    container.innerHTML = '<div class="no-results">未找到匹配的诗歌</div>'
    return
  }
  
  const poemsHTML = poemsToShow.map(poem => `
    <div class="poem-card">
      <div class="poem-header">
        <h3 class="poem-title">${escapeHtml(poem.title)}</h3>
        <div class="poem-meta">
          <span class="poem-author">${escapeHtml(poem.author)}</span>
          <span class="poem-dynasty">${escapeHtml(poem.dynasty)}</span>
        </div>
      </div>
      <div class="poem-content">${escapeHtml(poem.content)}</div>
    </div>
  `).join('')
  
  container.innerHTML = poemsHTML
  renderPagination()
}

// 渲染分页
function renderPagination() {
  const container = document.getElementById('pagination')
  const totalPages = Math.ceil(appState.filteredPoems.length / appState.poemsPerPage)
  
  if (totalPages <= 1) {
    container.innerHTML = ''
    return
  }
  
  const pages = []
  
  // 上一页
  pages.push(`
    <button ${appState.currentPage === 1 ? 'disabled' : ''} data-page="${appState.currentPage - 1}">
      上一页
    </button>
  `)
  
  // 页码
  const startPage = Math.max(1, appState.currentPage - 2)
  const endPage = Math.min(totalPages, appState.currentPage + 2)
  
  if (startPage > 1) {
    pages.push('<button data-page="1">1</button>')
    if (startPage > 2) {
      pages.push('<span>...</span>')
    }
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(`
      <button data-page="${i}" ${i === appState.currentPage ? 'class="active"' : ''}>
        ${i}
      </button>
    `)
  }
  
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pages.push('<span>...</span>')
    }
    pages.push(`<button data-page="${totalPages}">${totalPages}</button>`)
  }
  
  // 下一页
  pages.push(`
    <button ${appState.currentPage === totalPages ? 'disabled' : ''} data-page="${appState.currentPage + 1}">
      下一页
    </button>
  `)
  
  container.innerHTML = pages.join('')
}

// 绑定事件
function bindEvents() {
  // 朝代筛选
  document.getElementById('dynasty-filter').addEventListener('change', (e) => {
    filterPoems()
  })
  
  // 搜索
  document.getElementById('search-input').addEventListener('input', debounce(() => {
    filterPoems()
  }, 300))
  
  // 分页
  document.getElementById('pagination').addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON' && e.target.dataset.page) {
      appState.currentPage = parseInt(e.target.dataset.page)
      renderPoemList()
      scrollToTop()
    }
  })
}

// 筛选诗歌
function filterPoems() {
  const dynastyFilter = document.getElementById('dynasty-filter').value
  const searchText = document.getElementById('search-input').value.toLowerCase()
  
  appState.filteredPoems = appState.allPoems.filter(poem => {
    const matchesDynasty = !dynastyFilter || poem.dynasty === dynastyFilter
    const matchesSearch = !searchText || 
      poem.title.toLowerCase().includes(searchText) ||
      poem.author.toLowerCase().includes(searchText) ||
      poem.content.toLowerCase().includes(searchText)
    
    return matchesDynasty && matchesSearch
  })
  
  appState.currentPage = 1
  renderPoemList()
}

// 工具函数
function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function showError(message) {
  const errorDiv = document.createElement('div')
  errorDiv.className = 'error-message'
  errorDiv.textContent = message
  errorDiv.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #ff4757;
    color: white;
    padding: 1rem 2rem;
    border-radius: 8px;
    z-index: 1000;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  `
  document.body.appendChild(errorDiv)
  
  setTimeout(() => {
    errorDiv.remove()
  }, 5000)
}

// 启动应用
document.addEventListener('DOMContentLoaded', init)
