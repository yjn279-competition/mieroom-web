import L from 'leaflet';
import type { PathOptions } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, GeoJSON } from 'react-leaflet';
import { useEffect } from 'react';
import { useLoaderData } from "@remix-run/react";
import { Card, CardContent } from "@/components/ui/card";
import { loader } from "./route";

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


export function TokyoMap() {
  const geoJsonData = useLoaderData<typeof loader>();

  // 背景色のカスタマイズ
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = mapContainerStyle;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);


  // 区市町村をホバーした時のイベント
  const onEachFeature = (feature: any, layer: L.Layer) => {
    if (feature.properties && feature.properties.N03_004) {
      layer.bindPopup(feature.properties.N03_004);
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
