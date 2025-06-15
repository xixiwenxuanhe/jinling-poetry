import React, { useState, useEffect } from 'react'
import Papa from 'papaparse'
import styles from './LocationEvent.module.css'

// 历史事件时间轴组件
export const LocationEvent = () => {
  const [eventData, setEventData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 朝代顺序映射
  const dynastyOrder = {
    '汉': 1,
    '三国': 2,
    '晋': 3,
    '东晋': 4,
    '南朝': 5,
    '六朝': 6,
    '隋': 7,
    '唐': 8,
    '五代': 9,
    '宋': 10,
    '元': 11,
    '明': 12,
    '清': 13,
    '民国': 14,
    '现代': 15
  }

  // 朝代颜色映射
  const dynastyColors = {
    '汉': '#8B4513',
    '三国': '#DC143C',
    '晋': '#DAA520',
    '东晋': '#4682B4',
    '南朝': '#9370DB',
    '六朝': '#20B2AA',
    '隋': '#FF6347',
    '唐': '#FF8C00',
    '五代': '#32CD32',
    '宋': '#1E90FF',
    '元': '#FF69B4',
    '明': '#FF4500',
    '清': '#8A2BE2',
    '民国': '#228B22',
    '现代': '#696969'
  }

  // 从CSV文件加载数据
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        // 加载事件数据
        const eventResponse = await fetch('/data/事件表.csv')
        const eventText = await eventResponse.text()

        // 解析CSV数据
        const eventResult = Papa.parse(eventText, { 
          header: true, 
          skipEmptyLines: true,
          encoding: 'UTF-8'
        })

        console.log('Event columns:', eventResult.meta.fields)
        console.log('Event data sample:', eventResult.data.slice(0, 3))

        // 处理事件数据
        let processedEvents = []
        if (eventResult.data && eventResult.data.length > 0) {
          processedEvents = eventResult.data
            .slice(0, 20)
            .map((row, index) => {
              const possibleNames = [
                row['事件名称'],
                row['名称'],
                row['事件']
              ]
              const name = possibleNames.find(n => n && n.trim()) || `事件${index + 1}`
              
              const dynasty = row['朝代'] || '历史时期'
              
              return {
                id: index + 1,
                name: name.trim(),
                dynasty: dynasty,
                period: row['时期'] || row['年份'] || '时间不详',
                description: row['事件简介'] || row['事件内容'] || '重要历史事件',
                year: extractYear(row['时期'] || row['年份'] || ''),
                order: dynastyOrder[dynasty] || 999
              }
            })
            .sort((a, b) => {
              // 先按朝代顺序排序，再按年份排序
              if (a.order !== b.order) {
                return a.order - b.order
              }
              return (a.year || 0) - (b.year || 0)
            })
        } else {
          // 示例事件数据
          processedEvents = [
            { id: 1, name: '东晋建都建康', dynasty: '东晋', period: '317年', description: '司马睿在建康称帝，建立东晋政权', year: 317, order: 4 },
            { id: 2, name: '南朝宋建立', dynasty: '南朝', period: '420年', description: '刘裕建立宋朝，开启南朝时代', year: 420, order: 5 },
            { id: 3, name: '梁武帝萧衍即位', dynasty: '南朝', period: '502年', description: '萧衍建立梁朝，南朝文化繁荣', year: 502, order: 5 },
            { id: 4, name: '陈朝建立', dynasty: '南朝', period: '557年', description: '陈霸先建立陈朝，为南朝最后一个朝代', year: 557, order: 5 },
            { id: 5, name: '隋灭陈统一', dynasty: '隋', period: '589年', description: '隋军渡江灭陈，结束南北朝分裂', year: 589, order: 7 },
            { id: 6, name: '唐诗繁荣', dynasty: '唐', period: '618-907年', description: '唐代诗歌创作达到巅峰，金陵诗韵流传', year: 700, order: 8 },
            { id: 7, name: '宋词兴盛', dynasty: '宋', period: '960-1279年', description: '宋代词曲文化发达，金陵文脉延续', year: 1100, order: 10 },
            { id: 8, name: '明太祖定都南京', dynasty: '明', period: '1368年', description: '朱元璋建立明朝，定都南京', year: 1368, order: 12 },
            { id: 9, name: '明成祖迁都北京', dynasty: '明', period: '1421年', description: '永乐帝迁都北京，南京为留都', year: 1421, order: 12 },
            { id: 10, name: '太平天国建都', dynasty: '清', period: '1853年', description: '太平天国定都天京（南京）', year: 1853, order: 13 }
          ]
        }

        setEventData(processedEvents)
        setError(null)
      } catch (error) {
        console.error('数据加载失败:', error)
        setError(error.message)
        
        // 使用备用数据
        setEventData([
          { id: 1, name: '东晋建都建康', dynasty: '东晋', period: '317年', description: '司马睿在建康称帝，建立东晋政权', year: 317, order: 4 },
          { id: 2, name: '南朝宋建立', dynasty: '南朝', period: '420年', description: '刘裕建立宋朝，开启南朝时代', year: 420, order: 5 },
          { id: 3, name: '梁武帝萧衍即位', dynasty: '南朝', period: '502年', description: '萧衍建立梁朝，南朝文化繁荣', year: 502, order: 5 },
          { id: 4, name: '陈朝建立', dynasty: '南朝', period: '557年', description: '陈霸先建立陈朝，为南朝最后一个朝代', year: 557, order: 5 },
          { id: 5, name: '隋灭陈统一', dynasty: '隋', period: '589年', description: '隋军渡江灭陈，结束南北朝分裂', year: 589, order: 7 },
          { id: 6, name: '唐诗繁荣', dynasty: '唐', period: '618-907年', description: '唐代诗歌创作达到巅峰，金陵诗韵流传', year: 700, order: 8 },
          { id: 7, name: '宋词兴盛', dynasty: '宋', period: '960-1279年', description: '宋代词曲文化发达，金陵文脉延续', year: 1100, order: 10 },
          { id: 8, name: '明太祖定都南京', dynasty: '明', period: '1368年', description: '朱元璋建立明朝，定都南京', year: 1368, order: 12 }
        ])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // 提取年份的辅助函数
  function extractYear(periodStr) {
    if (!periodStr) return null
    const match = periodStr.match(/(\d{3,4})/)
    return match ? parseInt(match[1]) : null
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>正在加载历史事件...</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* 横向时间轴 */}
      <div className={styles.timelineContainer}>
        <div className={styles.timeline}>
          {eventData.map((event, index) => (
            <div key={event.id} className={styles.timelineItem}>
              <div 
                className={styles.timelineDot}
                style={{ 
                  backgroundColor: dynastyColors[event.dynasty] || '#666',
                  boxShadow: `0 0 0 3px ${dynastyColors[event.dynasty] || '#666'}33`
                }}
              ></div>
              <div className={styles.timelineCard}>
                <div className={styles.eventHeader}>
                  <div className={styles.eventTitle}>{event.name}</div>
                  <div 
                    className={styles.eventDynasty}
                    style={{ backgroundColor: dynastyColors[event.dynasty] || '#666' }}
                  >
                    {event.dynasty}
                  </div>
                </div>
                <div className={styles.eventPeriod}>{event.period}</div>
                <div className={styles.eventDescription}>{event.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {error && (
        <div className={styles.errorNote}>
          注意：使用示例数据显示，实际数据加载遇到问题
        </div>
      )}
    </div>
  )
} 