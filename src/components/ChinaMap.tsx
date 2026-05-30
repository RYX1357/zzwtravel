import { useEffect, useRef, useCallback } from 'react'
import * as echarts from 'echarts'
import type { CityTravel } from '../types'
import { ALL_CITY_COORDINATES } from '../data/cityCoordinates'
import chinaGeoJSON from '../assets/china.json'
import './ChinaMap.css'

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

  // 从已访问城市中提取去过的省份
  const visitedProvinces = new Set(visitedCities.map((c) => c.province))

  const initChart = useCallback(() => {
    if (!chartRef.current) return

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

    // 为已访问省份构建 regions 配置
    const visitedRegions = Array.from(visitedProvinces).map((province) => ({
      name: province,
      itemStyle: {
        areaColor: '#1E3A5F',
        borderColor: '#3B82F6',
        borderWidth: 1.2,
        shadowColor: 'rgba(59, 130, 246, 0.25)',
        shadowBlur: 10,
      },
      label: {
        show: true,
        color: '#94A3B8',
        fontSize: 10,
      },
    }))

    chart.setOption({
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: '#1A2540',
        borderColor: '#243850',
        borderWidth: 1,
        padding: [10, 14],
        textStyle: {
          color: '#E2E8F0',
          fontSize: 13,
        },
        formatter: (params: { name: string }) => {
          if (params.name) {
            const isProvinceVisited = visitedProvinces.has(params.name)
            const isCityVisited = visitedNames.has(params.name)
            const status = isProvinceVisited || isCityVisited ? '已去过' : '未去过'
            const color = isProvinceVisited || isCityVisited ? '#60A5FA' : '#64748B'
            return `<strong>${params.name}</strong><br/>
              <span style="font-size:12px;color:${color}">${status}</span>`
          }
          return params.name
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
          areaColor: '#1A2540',
          borderColor: '#2A3A55',
          borderWidth: 0.8,
          shadowColor: 'rgba(0,0,0,0.3)',
          shadowBlur: 12,
        },
        regions: visitedRegions,
        emphasis: {
          disabled: true,
        },
      },
      series: [
        {
          type: 'scatter',
          coordinateSystem: 'geo',
          data: unvisitedScatterData,
          symbolSize: 4,
          symbol: 'circle',
          itemStyle: {
            color: '#334155',
            borderColor: 'rgba(30, 45, 68, 0.8)',
            borderWidth: 1,
          },
          label: { show: false },
          emphasis: {
            scale: 1.4,
            itemStyle: { color: '#64748B' },
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
            color: '#3B82F6',
            borderColor: '#0B1120',
            borderWidth: 2.5,
            shadowColor: 'rgba(59, 130, 246, 0.6)',
            shadowBlur: 22,
            shadowOffsetY: 2,
          },
          label: {
            show: true,
            position: 'right',
            distance: 8,
            color: '#E2E8F0',
            fontSize: 12,
            fontWeight: 600,
          },
          emphasis: {
            scale: 1.6,
            itemStyle: {
              color: '#60A5FA',
              shadowBlur: 32,
            },
            label: {
              fontSize: 14,
              fontWeight: 700,
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
