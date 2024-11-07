import React from 'react';

interface Evacuee {
  full_name: string;
  birth_date: string;
  address: string;
  is_safety: boolean;
  shelter_name: string;
  shelter_address: string;
}

interface UserListProps {
  evacuees: Evacuee[];
}

const UserList: React.FC<UserListProps> = ({ evacuees }) => {
  return (
    <div className="container mx-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2 text-black">氏名</th>
            <th className="border p-2 text-black">生年月日</th>
            <th className="border p-2 text-black">住所</th>
            <th className="border p-2 text-black">安否確認</th>
            <th className="border p-2 text-black">避難所名</th>
            <th className="border p-2 text-black">避難所住所</th>
          </tr>
        </thead>
        <tbody>
          {evacuees.map(evacuee => (
            <tr key={evacuee.full_name} className="hover:bg-gray-100">
              <td className="border p-2 text-black">{evacuee.full_name}</td>
              <td className="border p-2 text-black">{new Date(evacuee.birth_date).toLocaleDateString()}</td>
              <td className="border p-2 text-black">{evacuee.address}</td>
              <td className="border p-2 text-center text-black">{evacuee.is_safety ? "安全" : "危険"}</td>
              <td className="border p-2 text-black">{evacuee.shelter_name}</td>
              <td className="border p-2 text-black">{evacuee.shelter_address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
