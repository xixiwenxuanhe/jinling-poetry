# 金陵诗韵数据可视化大屏

一个展示金陵（南京）历朝诗歌文化遗产的数据可视化大屏项目，包含诗歌统计、朝代分布、词云分析和历史事件时间轴等功能。

![项目截图](view.png)

## 技术栈

- **前端框架**: React 18 + Vite
- **样式方案**: CSS Modules

## 项目结构

```
jinling-poetry/
├── public/
│   └── data/                    # CSV 数据文件
│       ├── 金陵历朝诗歌.csv      # 诗歌数据
│       └── 事件表.csv           # 历史事件数据
├── src/
│   ├── components/              # React 组件
│   │   ├── DataOverview/        # 数据概览 - 显示统计信息
│   │   ├── DynastyChart/        # 朝代分布图表
│   │   ├── WordCloud/           # 词云可视化
│   │   ├── LocationEvent/       # 历史事件时间轴
│   │   ├── SearchFilter/        # 搜索筛选功能
│   │   ├── PoemList/            # 诗歌列表展示
│   │   └── Pagination/          # 分页控件
│   ├── utils/
│   │   └── DataManager.js       # 数据处理工具类
│   ├── App.jsx                  # 主应用组件
│   ├── style.css               # 全局样式
│   └── main.jsx                # 应用入口文件
├── package.json                 # 项目依赖配置
├── vite.config.js              # Vite 构建配置
└── README.md                   # 项目说明文档
```

### 核心组件说明

- **DataOverview**: 展示诗歌总数、朝代数量等统计数据
- **DynastyChart**: 柱状图显示各朝代诗歌分布
- **WordCloud**: 基于诗歌内容生成的词云图
- **LocationEvent**: 金陵历史事件的时间轴展示
- **SearchFilter**: 支持按朝代筛选诗歌
- **PoemList**: 诗歌内容的分页列表展示

### 数据文件说明

- **金陵历朝诗歌.csv**: 包含诗歌标题、内容、作者、朝代等信息
- **事件表.csv**: 包含历史事件名称、时期、朝代、事件描述等信息

## 快速开始

```bash
# 克隆项目
git clone https://github.com/xixiwenxuanhe/jinling-poetry.git

# 进入项目目录
cd jinling-poetry

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

应用将在 http://localhost:5173 运行 