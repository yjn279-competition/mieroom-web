'use client';

import React, { useState, useEffect } from 'react';
import Charts from './components/Charts';
import UserList from './components/UserList';

interface Evacuee {
  full_name: string;
  birth_date: string;
  address: string;
  is_safety: boolean;
  shelter_name: string;
  shelter_address: string;
}

interface Material {
  shelter_name: string;
  shelter_address: string;
  material_name: string;
  genre: string;
  allergy_code: string | null;
  quantity: number;
  expiration_date: string;
}

export default function Page() {
  const [evacuees, setEvacuees] = useState<Evacuee[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [filteredEvacuees, setFilteredEvacuees] = useState<Evacuee[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
  const [shelterOptions, setShelterOptions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    shelter_name: '',
    is_safety: '',
  });

  // 避難者データと物資データをフェッチ
  useEffect(() => {
    const fetchEvacuees = async () => {
      try {
        const response = await fetch('http://localhost:8000/evacuees/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Evacuee[] = await response.json();
        setEvacuees(data);

        // 避難所の名前を抽出してユニークにする
        const shelters = Array.from(new Set(data.map(evacuee => evacuee.shelter_name)));
        setShelterOptions(shelters);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    const fetchMaterials = async () => {
      try {
        const response = await fetch('http://localhost:8000/materials/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Material[] = await response.json();
        setMaterials(data);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchEvacuees();
    fetchMaterials();
  }, []);

  // フィルタリング
  useEffect(() => {
    const filteredEvacuees = evacuees.filter(evacuee =>
      (evacuee.full_name.includes(searchTerm) || evacuee.address.includes(searchTerm)) &&
      (filters.shelter_name === '' || evacuee.shelter_name === filters.shelter_name) &&
      (filters.is_safety === '' || String(evacuee.is_safety) === filters.is_safety)
    );

    const filteredMaterials = materials.filter(material =>
      filters.shelter_name === '' || material.shelter_name === filters.shelter_name
    );

    setFilteredEvacuees(filteredEvacuees);
    setFilteredMaterials(filteredMaterials);
  }, [evacuees, materials, searchTerm, filters]);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="氏名または住所で検索"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded text-black"
        />
        <select
          value={filters.shelter_name}
          onChange={(e) => setFilters({ ...filters, shelter_name: e.target.value })}
          className="border p-2 rounded ml-2 text-black"
        >
          <option value="">全体</option>
          {shelterOptions.map(shelter => (
            <option key={shelter} value={shelter}>
              {shelter}
            </option>
          ))}
        </select>
        <select
          value={filters.is_safety}
          onChange={(e) => setFilters({ ...filters, is_safety: e.target.value })}
          className="border p-2 rounded ml-2 text-black"
        >
          <option value="">安否確認</option>
          <option value="true">安全</option>
          <option value="false">危険</option>
        </select>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <Charts evacuees={filteredEvacuees} materials={filteredMaterials} />
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <UserList evacuees={filteredEvacuees} />
      </div>
    </div>
  );
}
