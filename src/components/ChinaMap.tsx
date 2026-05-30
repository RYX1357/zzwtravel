import { useEffect, useRef, useState, useCallback } from 'react'
import * as echarts from 'echarts'
import type { CityTravel } from '../types'
import { ALL_CITY_COORDINATES } from '../data/cityCoordinates'
import './ChinaMap.css'

// ============================================
// 中国地图 GeoJSON 数据源
// ============================================
// DataV.GeoAtlas: 阿里云 DataV 地理数据 API
// 数据格式: GeoJSON (简化版中国省份边界)
// 许可: 公开使用
const GEOJSON_URL =
  'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json'

// 注册地图到 ECharts 的缓存 key
const MAP_NAME = 'china'

interface ChinaMapProps {
  visitedCities: CityTravel[]
  onCityClick: (city: CityTravel) => void
}

export default function ChinaMap({ visitedCities, onCityClick }: ChinaMapProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // 构建城市名称到旅行数据的映射
  const cityDataMap = new Map(visitedCities.map((c) => [c.cityName, c]))

  // 构建已访问城市名称集合
  const visitedNames = new Set(visitedCities.map((c) => c.cityName))

  const initChart = useCallback(
    (geoJson: unknown) => {
      if (!chartRef.current) return

      // 注册地图
      echarts.registerMap(MAP_NAME, geoJson as Parameters<typeof echarts.registerMap>[1])

      const chart = echarts.init(chartRef.current)
      chartInstance.current = chart

      // 构建散点数据
      const visitedScatterData = ALL_CITY_COORDINATES
        .filter((c) => visitedNames.has(c.name))
        .map((c) => ({
          name: c.name,
          value: [...c.coordinates, 0],
        }))

      const unvisitedScatterData = ALL_CITY_COORDINATES
        .filter((c) => !visitedNames.has(c.name))
        .map((c) => ({
          name: c.name,
          value: [...c.coordinates, 0],
        }))

      chart.setOption({
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          backgroundColor: '#fff',
          borderColor: '#E8E2D9',
          borderWidth: 1,
          padding: [10, 14],
          textStyle: {
            color: '#2C2416',
            fontSize: 13,
            fontFamily: 'var(--font-sans)',
          },
          formatter: (params: { name: string; marker: string }) => {
            const isVisited = visitedNames.has(params.name)
            const icon = isVisited ? '&#x2708;' : '&#x25CB;'
            const status = isVisited ? '已访问' : '未访问'
            return `<strong>${params.name}</strong><br/>
              <span style="font-size:12px;color:#7B6E5E">${icon} ${status}</span>`
          },
        },
        geo: {
          map: MAP_NAME,
          roam: true,
          zoom: 1.1,
          center: [105, 36],
          aspectScale: 0.85,
          label: { show: false },
          itemStyle: {
            areaColor: '#F2EDE6',
            borderColor: '#DDD6CB',
            borderWidth: 0.8,
            shadowColor: 'rgba(0,0,0,0.04)',
            shadowBlur: 8,
          },
          emphasis: {
            disabled: true,
          },
        },
        series: [
          // 未访问城市 - 小灰点
          {
            type: 'scatter',
            coordinateSystem: 'geo',
            data: unvisitedScatterData,
            symbolSize: 5,
            symbol: 'circle',
            itemStyle: {
              color: '#D8D0C4',
              borderColor: 'rgba(255,255,255,0.6)',
              borderWidth: 1,
            },
            label: { show: false },
            emphasis: {
              scale: 1.4,
              itemStyle: { color: '#B8A898' },
            },
            zlevel: 1,
          },
          // 已访问城市 - 大亮点 + 光晕
          {
            type: 'scatter',
            coordinateSystem: 'geo',
            data: visitedScatterData,
            symbolSize: 14,
            symbol: 'circle',
            itemStyle: {
              color: '#C56E3A',
              borderColor: '#FFFFFF',
              borderWidth: 2.5,
              shadowColor: 'rgba(197, 110, 58, 0.5)',
              shadowBlur: 16,
              shadowOffsetY: 2,
            },
            label: {
              show: true,
              position: 'right',
              distance: 8,
              color: '#2C2416',
              fontSize: 12,
              fontWeight: 500,
              fontFamily: 'var(--font-sans)',
            },
            emphasis: {
              scale: 1.6,
              itemStyle: {
                color: '#E0783A',
                shadowBlur: 24,
              },
              label: {
                fontSize: 14,
                fontWeight: 600,
              },
            },
            zlevel: 2,
          },
        ],
      })

      // 点击事件
      chart.on('click', (params) => {
        if (params.componentType === 'series' && params.name) {
          const cityData = cityDataMap.get(params.name)
          if (cityData) {
            onCityClick(cityData)
          }
        }
      })

      // 自适应
      const handleResize = () => chart.resize()
      window.addEventListener('resize', handleResize)
      ;(chart as { _resizeHandler?: () => void })._resizeHandler = handleResize
    },
    [visitedNames, cityDataMap, onCityClick],
  )

  useEffect(() => {
    let cancelled = false

    fetch(GEOJSON_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch map data')
        return res.json()
      })
      .then((geoJson) => {
        if (!cancelled) {
          initChart(geoJson)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true)
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
      if (chartInstance.current) {
        const handler = (chartInstance.current as { _resizeHandler?: () => void })._resizeHandler
        if (handler) window.removeEventListener('resize', handler)
        chartInstance.current.dispose()
        chartInstance.current = null
      }
    }
  }, [initChart])

  if (error) {
    return (
      <div className="map-container map-placeholder">
        <div className="map-error">
          <span className="error-icon">&#x26A0;</span>
          <p>地图数据加载失败</p>
          <p className="error-hint">请检查网络连接后刷新页面</p>
          <button className="retry-btn" onClick={() => window.location.reload()}>
            重新加载
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="map-container">
      {loading && (
        <div className="map-loading">
          <div className="loading-spinner" />
          <p>加载地图数据中...</p>
        </div>
      )}
      <div
        ref={chartRef}
        className="map-chart"
        style={{ opacity: loading ? 0 : 1 }}
      />
    </div>
  )
}
