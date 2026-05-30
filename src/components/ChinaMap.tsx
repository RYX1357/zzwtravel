import { useEffect, useRef, useCallback } from 'react'
import * as echarts from 'echarts'
import type { CityTravel } from '../types'
import { ALL_CITY_COORDINATES } from '../data/cityCoordinates'
import chinaGeoJSON from '../assets/china.json'
import './ChinaMap.css'

// ============================================
// 中国地图 GeoJSON 数据源
// ============================================
// DataV.GeoAtlas: 阿里云 DataV 地理数据 API
// 数据格式: GeoJSON (简化版中国省份边界)
// 已打包到 src/assets/china.json，无需网络请求
// ============================================

const MAP_NAME = 'china'

interface ChinaMapProps {
  visitedCities: CityTravel[]
  onCityClick: (city: CityTravel) => void
}

export default function ChinaMap({ visitedCities, onCityClick }: ChinaMapProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)

  const cityDataMap = new Map(visitedCities.map((c) => [c.cityName, c]))
  const visitedNames = new Set(visitedCities.map((c) => c.cityName))

  const initChart = useCallback(() => {
    if (!chartRef.current) return

    // 注册中国地图
    echarts.registerMap(MAP_NAME, chinaGeoJSON as Parameters<typeof echarts.registerMap>[1])

    const chart = echarts.init(chartRef.current)
    chartInstance.current = chart

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
        },
        formatter: (params: { name: string }) => {
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

    chart.on('click', (params) => {
      if (params.componentType === 'series' && params.name) {
        const cityData = cityDataMap.get(params.name)
        if (cityData) {
          onCityClick(cityData)
        }
      }
    })

    const handleResize = () => chart.resize()
    window.addEventListener('resize', handleResize)
    ;(chart as { _resizeHandler?: () => void })._resizeHandler = handleResize
  }, [visitedNames, cityDataMap, onCityClick])

  useEffect(() => {
    initChart()

    return () => {
      if (chartInstance.current) {
        const handler = (chartInstance.current as { _resizeHandler?: () => void })._resizeHandler
        if (handler) window.removeEventListener('resize', handler)
        chartInstance.current.dispose()
        chartInstance.current = null
      }
    }
  }, [initChart])

  return (
    <div className="map-container">
      <div ref={chartRef} className="map-chart" />
    </div>
  )
}
