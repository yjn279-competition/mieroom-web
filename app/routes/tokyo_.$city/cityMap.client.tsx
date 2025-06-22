import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useLoaderData, Link, useParams } from 'react-router';

// Define the Shelter type based on the data structure
export interface Shelter {
  code: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  elevatorInfo?: string;
  slope?: string;
  brailleBlocks?: string;
  wheelchairToilet?: string;
  otherFacilities?: string;
}

// Define the LoaderData type based on the loader's return structure
interface LoaderData {
  shelters: Shelter[];
  cityName: string;
  evacuees: {
    total: number;
    byGender: Array<{
      name: string;
      value: number;
      fill: string;
    }>;
  };
  supplies: Array<{
    key: string;
    value: number;
    fill: string;
  }>;
}

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
  const data = useLoaderData<LoaderData>();
  const shelters = data.shelters;
  const params = useParams();
  
  // Calculate center based on shelters if available
  const center = shelters && shelters.length > 0
    ? [
        shelters.reduce((sum: number, shelter: Shelter) => sum + shelter.latitude, 0) / shelters.length,
        shelters.reduce((sum: number, shelter: Shelter) => sum + shelter.longitude, 0) / shelters.length
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
          key={`${shelter.name}-${index}`}
          position={[shelter.latitude, shelter.longitude]}
          icon={customIcon}
          eventHandlers={{
            mouseover: (e) => {
              e.target.openPopup();
            },
          }}
        >
          <Popup autoPan={false}>
            <div>
              <h3 className="font-bold">{shelter.name}</h3>
              <p>{shelter.address}</p>
              <div className="mt-2">
                <p className="text-sm">バリアフリー設備:</p>
                <ul className="text-sm list-disc pl-5">
                  {shelter.elevatorInfo === "○" && <li>エレベーター有/避難スペースが１階</li>}
                  {shelter.slope === "○" && <li>スロープ等</li>}
                  {shelter.brailleBlocks === "○" && <li>点字ブロック</li>}
                  {shelter.wheelchairToilet === "○" && <li>車椅子使用者対応トイレ</li>}
                  {shelter.otherFacilities && <li>{shelter.otherFacilities}</li>}
                </ul>
              </div>
              <div className="mt-3">
                <Link to={`/tokyo/${params.city}/${shelter.code}`}>
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
