import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useLoaderData, Link, useParams } from "@remix-run/react";
import { loader } from "./route";
import type { Shelter } from "./route";

// Default center for Tokyo
const defaultCenter: [number, number] = [35.6895, 139.6917];
const defaultZoom = 13;

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export function CityMap() {
  const { shelters } = useLoaderData<typeof loader>();
  const params = useParams();
  
  // Calculate center based on shelters if available
  const center = shelters && shelters.length > 0
    ? [
        shelters.reduce((sum: number, shelter: Shelter) => sum + shelter.緯度, 0) / shelters.length,
        shelters.reduce((sum: number, shelter: Shelter) => sum + shelter.経度, 0) / shelters.length
      ] as [number, number]
    : defaultCenter;

  return (
    <MapContainer
      center={center}
      zoom={defaultZoom}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {shelters && shelters.map((shelter: Shelter, index: number) => (
        <Marker 
          key={`${shelter.避難所_施設名称}-${index}`}
          position={[shelter.緯度, shelter.経度]}
          icon={customIcon}
        >
          <Popup>
            <div>
              <h3 className="font-bold">{shelter.避難所_施設名称}</h3>
              <p>{shelter.所在地住所}</p>
              <div className="mt-2">
                <p className="text-sm">バリアフリー設備:</p>
                <ul className="text-sm list-disc pl-5">
                  {shelter["エレベーター有/避難スペースが１階"] === "○" && <li>エレベーター有/避難スペースが１階</li>}
                  {shelter.スロープ等 === "○" && <li>スロープ等</li>}
                  {shelter.点字ブロック === "○" && <li>点字ブロック</li>}
                  {shelter.車椅子使用者対応トイレ === "○" && <li>車椅子使用者対応トイレ</li>}
                  {shelter.その他 && <li>{shelter.その他}</li>}
                </ul>
              </div>
              <div className="mt-3">
                <Link 
                  to={`/tokyo/${params.city}/${index}`} 
                  className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm inline-block"
                >
                  ダッシュボードを表示
                </Link>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
