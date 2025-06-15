// 数据管理工具类
export class DataManager {
  constructor() {
    this.allPoems = []
    this.filteredPoems = []
    this.dynastyStats = {}
    this.authorStats = {}
    this.currentPage = 1
    this.poemsPerPage = 10
    this.filters = {
      searchTerm: '',
      dynasty: '',
      searchType: 'all' // 'all', 'title', 'author', 'content'
    }
  }

  // 加载CSV数据
  async loadData(csvPath) {
    try {
      const response = await fetch(csvPath)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const csvText = await response.text()
      this.allPoems = this.parseCSV(csvText)
      this.calculateStats()
      this.filteredPoems = [...this.allPoems]
      return this.allPoems
    } catch (error) {
      console.error('加载数据失败:', error)
      throw error
    }
  }

  // 解析CSV数据
  parseCSV(csvText) {
    const lines = csvText.trim().split('\n')
    const headers = this.parseCSVLine(lines[0])
    const poems = []

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = this.parseCSVLine(lines[i])
        if (values.length !== headers.length) continue

        const poem = {}
        headers.forEach((header, index) => {
          poem[header] = values[index] || ''
        })

        // 数据清理
        poem.id = poem.id?.toString().replace(/"/g, '').trim() || ''
        poem.title = poem.title?.replace(/"/g, '').trim() || ''
        poem.author = poem.author?.replace(/"/g, '').trim() || ''
        poem.content = poem.content?.replace(/"/g, '').trim() || ''
        poem.dynasty = poem.dynasty?.replace(/"/g, '').trim() || ''

        // 验证必要字段
        if (poem.title && poem.author && poem.content && poem.dynasty) {
          poems.push(poem)
        }
      } catch (error) {
        console.warn(`解析第${i}行数据时出错:`, error)
      }
    }

    return poems
  }

  // 解析CSV行（处理混合格式）
  parseCSVLine(line) {
    const result = []
    let current = ''
    let inQuotes = false
    let i = 0

    while (i < line.length) {
      const char = line[i]
      const nextChar = line[i + 1]

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"'
          i += 2
          continue
        }
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim())
        current = ''
        i++
        continue
      } else {
        current += char
      }
      i++
    }

    result.push(current.trim())
    return result
  }

  // 计算统计数据
  calculateStats() {
    this.dynastyStats = {}
    this.authorStats = {}

    this.allPoems.forEach(poem => {
      // 朝代统计
      this.dynastyStats[poem.dynasty] = (this.dynastyStats[poem.dynasty] || 0) + 1
      // 作者统计
      this.authorStats[poem.author] = (this.authorStats[poem.author] || 0) + 1
    })
  }

  // 获取统计数据
  getStats() {
    return {
      poemCount: this.allPoems.length,
      authorCount: Object.keys(this.authorStats).length,
      dynastyCount: Object.keys(this.dynastyStats).length,
      timeSpan: this.getTimeSpan()
    }
  }

  // 获取时间跨度
  getTimeSpan() {
    const dynasties = Object.keys(this.dynastyStats)
    if (dynasties.includes('六朝') && dynasties.includes('当代')) {
      return '1500+ 年'
    } else if (dynasties.includes('六朝')) {
      return '1000+ 年'
    } else {
      return '数百年'
    }
  }

  // 应用筛选
  applyFilters(filters) {
    this.filters = { ...this.filters, ...filters }
    this.currentPage = 1 // 重置到第一页

    this.filteredPoems = this.allPoems.filter(poem => {
      // 搜索词筛选
      if (this.filters.searchTerm) {
        const searchTerm = this.filters.searchTerm.toLowerCase()
        let matchesSearch = false
        
        // 确保字段存在且为字符串
        const title = (poem.title || '').toString().toLowerCase()
        const author = (poem.author || '').toString().toLowerCase()
        const content = (poem.content || '').toString().toLowerCase()
        
        switch (this.filters.searchType) {
          case 'title':
            matchesSearch = title.includes(searchTerm)
            break
          case 'author':
            matchesSearch = author.includes(searchTerm)
            break
          case 'content':
            matchesSearch = content.includes(searchTerm)
            break
          case 'all':
          default:
            matchesSearch = 
              title.includes(searchTerm) ||
              author.includes(searchTerm) ||
              content.includes(searchTerm)
            break
        }
        
        if (!matchesSearch) return false
      }

      // 朝代筛选
      if (this.filters.dynasty && poem.dynasty !== this.filters.dynasty) {
        return false
      }

      return true
    })

    return this.filteredPoems
  }

  // 获取分页数据
  getPaginatedPoems(page = 1, itemsPerPage = 10) {
    this.currentPage = page
    this.poemsPerPage = itemsPerPage
    
    const startIndex = (page - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    
    return {
      poems: this.filteredPoems.slice(startIndex, endIndex),
      totalItems: this.filteredPoems.length,
      currentPage: page,
      totalPages: Math.ceil(this.filteredPoems.length / itemsPerPage),
      hasMore: endIndex < this.filteredPoems.length
    }
  }

  // 重置筛选
  resetFilters() {
    this.filters = {
      searchTerm: '',
      dynasty: '',
      searchType: 'all'
    }
    this.filteredPoems = [...this.allPoems]
    this.currentPage = 1
    return this.filteredPoems
  }

  // 获取朝代统计
  getDynastyStats() {
    return this.dynastyStats
  }

  // 获取作者统计
  getAuthorStats() {
    return this.authorStats
  }

  // 获取当前筛选状态
  getCurrentFilters() {
    return { ...this.filters }
  }

  // 获取所有诗歌数据
  getAllPoems() {
    return this.allPoems
  }

  // 获取筛选后的诗歌数据
  getFilteredPoems() {
    return this.filteredPoems
  }
} 