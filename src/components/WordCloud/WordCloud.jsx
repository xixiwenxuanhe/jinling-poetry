import React, { useEffect, useRef, useState } from 'react'
import WordCloud from 'wordcloud'
import styles from './WordCloud.module.css'

// 词云组件
export const WordCloudComponent = ({ poems, selectedDynasty }) => {
  const canvasRef = useRef(null)
  const [wordData, setWordData] = useState([])

  // 中文分词简化版（基于常见词汇）
  const segmentText = (text) => {
    // 移除标点符号
    const cleanText = text.replace(/[，。！？；：""''（）【】《》、]/g, ' ')
    
    // 常见的中文词汇模式（2-4字词汇）
    const words = []
    const commonWords = [
      // 自然景物
      '春风', '秋月', '夏日', '冬雪', '山水', '江河', '湖海', '花草', '树木', '鸟兽',
      '青山', '绿水', '白云', '明月', '夕阳', '朝霞', '星辰', '雨露', '霜雪', '烟雾',
      '桃花', '梅花', '荷花', '菊花', '兰花', '竹子', '松树', '柳树', '梧桐', '芭蕉',
      
      // 情感词汇
      '思君', '怀古', '离别', '相思', '愁绪', '欢乐', '悲伤', '孤独', '寂寞', '惆怅',
      '眷恋', '怀念', '感慨', '忧愁', '喜悦', '激动', '平静', '安详', '温馨', '浪漫',
      
      // 时间地点
      '春日', '夏夜', '秋晨', '冬夕', '黄昏', '清晨', '午后', '深夜', '故乡', '他乡',
      '江南', '塞北', '京城', '山村', '水乡', '边塞', '宫廷', '田园', '市井', '寺庙',
      
      // 人物关系
      '君王', '臣子', '朋友', '知己', '佳人', '美人', '才子', '佳人', '夫妻', '兄弟',
      '师友', '同窗', '故人', '新知', '红颜', '知音', '伴侣', '亲人', '游子', '归人',
      
      // 文化概念
      '诗词', '文章', '书画', '音乐', '舞蹈', '琴棋', '书法', '绘画', '雕刻', '建筑',
      '礼仪', '道德', '仁义', '忠孝', '廉耻', '智慧', '学问', '修养', '品格', '风度'
    ]
    
    // 提取常见词汇
    commonWords.forEach(word => {
      const regex = new RegExp(word, 'g')
      const matches = cleanText.match(regex)
      if (matches) {
        words.push(...matches)
      }
    })
    
    // 提取单字（作为补充）
    const singleChars = cleanText.match(/[\u4e00-\u9fa5]/g) || []
    const charFreq = {}
    singleChars.forEach(char => {
      if (char.length === 1 && !/[的了在是有和与及或者]/g.test(char)) {
        charFreq[char] = (charFreq[char] || 0) + 1
      }
    })
    
    // 只添加高频单字
    Object.entries(charFreq).forEach(([char, freq]) => {
      if (freq >= 3) {
        for (let i = 0; i < Math.min(freq, 5); i++) {
          words.push(char)
        }
      }
    })
    
    return words
  }

  // 处理诗歌数据生成词频
  const processPoems = (poems) => {
    const wordFreq = {}
    
    poems.forEach(poem => {
      const words = segmentText(poem.content || '')
      words.forEach(word => {
        if (word.length >= 1) {
          wordFreq[word] = (wordFreq[word] || 0) + 1
        }
      })
    })
    
    // 转换为词云数据格式，并过滤低频词
    const wordList = Object.entries(wordFreq)
      .filter(([word, freq]) => freq >= 2) // 至少出现2次
      .sort((a, b) => b[1] - a[1])
      .slice(0, 50) // 取前50个高频词
      .map(([word, freq]) => [word, freq * 3]) // 放大权重以便显示
    
    return wordList
  }

  // 更新词云数据
  useEffect(() => {
    if (poems && poems.length > 0) {
      const data = processPoems(poems)
      setWordData(data)
    }
  }, [poems])

  // 渲染词云
  useEffect(() => {
    if (wordData.length > 0 && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      
      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // 词云配置
      const options = {
        list: wordData,
        gridSize: 6,
        weightFactor: function (size) {
          return Math.pow(size, 0.7) * 1.5
        },
        fontFamily: 'Noto Serif SC, serif',
        color: function () {
          // 中国传统色彩
          const colors = [
            '#8B4513', // 赭石
            '#DC143C', // 朱砂
            '#DAA520', // 金黄
            '#2F4F4F', // 墨绿
            '#8B0000', // 深红
            '#B8860B', // 暗金
            '#556B2F', // 橄榄
            '#8B4513', // 棕色
            '#CD853F', // 秘鲁
            '#A0522D'  // 赭色
          ]
          return colors[Math.floor(Math.random() * colors.length)]
        },
        rotateRatio: 0.2,
        rotationSteps: 2,
        backgroundColor: 'transparent',
        minSize: 10,
        drawOutOfBound: false,
        shrinkToFit: true,
        origin: [120, 90]
      }
      
      try {
        WordCloud(canvas, options)
      } catch (error) {
        console.warn('词云渲染失败:', error)
      }
    }
  }, [wordData])

  return (
    <div className={styles.wordCloudContainer}>
      <div className={styles.wordCloudCanvas}>
        <canvas
          ref={canvasRef}
          width={240}
          height={180}
          className={styles.canvas}
        />
      </div>
    </div>
  )
} 