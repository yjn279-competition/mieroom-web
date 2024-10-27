import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
// @ts-ignore
import L from 'leaflet'

// Leafletのデフォルトアイコンの問題を解決するためのコード
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
});

const shelterData = [
  { name: '中央区体育館', capacity: 500, currentOccupancy: 375, availableSpace: 125, lat: 35.6894, lng: 139.6917 },
  { name: '港区市民センター', capacity: 300, currentOccupancy: 180, availableSpace: 120, lat: 35.6586, lng: 139.7454 },
  { name: '新宿区立学校', capacity: 400, currentOccupancy: 340, availableSpace: 60, lat: 35.6938, lng: 139.7034 },
]

export function CityMap() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>市区町村マップ</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-4rem)]">
        <MapContainer center={[35.6894, 139.6917]} zoom={11} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {shelterData.map((shelter, index) => (
            <Marker key={index} position={[shelter.lat, shelter.lng]}>
              <Popup>
                <b>{shelter.name}</b><br />
                収容可能: {shelter.capacity}<br />
                現在の避難者: {shelter.currentOccupancy}<br />
                空き: {shelter.availableSpace}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </CardContent>
    </Card>
  )
}
