import L from 'leaflet';
import type { PathOptions } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, GeoJSON } from 'react-leaflet';
import { useEffect } from 'react';
import { Link } from "@remix-run/react";
import { Card, CardContent } from "@/components/ui/card";

// Map of city name in Japanese to URL parameter
const cityNameMap: Record<string, string> = {
  'chiyoda': '千代田区',
  'chuo': '中央区',
  'minato': '港区',
  'shinjuku': '新宿区',
  'bunkyo': '文京区',
  'taito': '台東区',
  'sumida': '墨田区',
  'koto': '江東区',
  'shinagawa': '品川区',
  'meguro': '目黒区',
  'ota': '大田区',
  'setagaya': '世田谷区',
  'shibuya': '渋谷区',
  'nakano': '中野区',
  'suginami': '杉並区',
  'toshima': '豊島区',
  'kita': '北区',
  'arakawa': '荒川区',
  'itabashi': '板橋区',
  'nerima': '練馬区',
  'adachi': '足立区',
  'katsushika': '葛飾区',
  'edogawa': '江戸川区',
};

// パラメータ
const zoom = 10;
const center: [number, number] = [35.7, 139.45];

const defaultStyle: PathOptions = {
  fillColor: '#FDBA74',
  fillOpacity: 1,
  color: '#fff',
  opacity: 1,
  weight: 2,
};

const focusedStyle: PathOptions = {
  fillColor: '#F97316',
  fillOpacity: 1,
};


const mapContainerStyle = `
  .leaflet-container {
    background: transparent;
  }
`;


interface TokyoMapProps {
  geoJsonData: any;
}

export function TokyoMap({ geoJsonData }: TokyoMapProps) {

  // 背景色のカスタマイズ
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = mapContainerStyle;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Event handlers for GeoJSON features
  const onEachFeature = (feature: any, layer: L.Layer) => {
    if (feature.properties && feature.properties.N03_004) {
      // Get city name and parameter
      const cityName = feature.properties.N03_004;
      const cityParam = Object.entries(cityNameMap).find(([_, value]) => value === cityName)?.[0] || '';
      
      // ポップアップにリンクを追加
      const popupContent = `
        <div>
          <h3 class="font-bold">${cityName}</h3>
          <div class="mt-3">
            <a href="/tokyo/${cityParam}">
              ダッシュボードを表示
            </a>
          </div>
        </div>
      `;
      
      // Bind popup to layer
      layer.bindPopup(popupContent);
    }
    
    if (layer instanceof L.Path) {
      layer.on({
        mouseover: (e) => {
          const layer = e.target;
          layer.setStyle(focusedStyle);
        },
        mouseout: (e) => {
          const layer = e.target;
          layer.setStyle(defaultStyle);
        },
        click: (e) => {
          const layer = e.target;
          layer.openPopup();
        }
      });
    }
  };

  return (
    <Card className="h-full">
      <CardContent className="h-full p-0">
        <MapContainer
          center={center}
          zoom={zoom}
          zoomControl={false}
          boxZoom={false}
          doubleClickZoom={false}
          dragging={false}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          {geoJsonData && (
            <GeoJSON
              data={geoJsonData}
              pathOptions={defaultStyle}
              onEachFeature={onEachFeature}
            />
          )}
        </MapContainer>
      </CardContent>
    </Card>
  );
}
