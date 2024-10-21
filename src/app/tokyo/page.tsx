'use client';

import React, { useState } from 'react';
import Grid from '@mui/material/Grid2';

import {
  Box,
  Container,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Fade,
  Grow,
} from '@mui/material';
import {
  PeopleAlt as PeopleAltIcon,
  Home as HomeIcon,
  Warning as WarningIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

// 仮のデータ
const evacueeData = [
  { name: '避難済み', value: 3000, color: '#4caf50' },
  { name: '避難中', value: 1500, color: '#ff9800' },
  { name: '未避難', value: 5500, color: '#f44336' },
];

const municipalityData = [
  { name: '中央区', shelters: 10, availablePercentage: 80, evacuees: 1200, capacityPercentage: 60 },
  { name: '港区', shelters: 8, availablePercentage: 75, evacuees: 900, capacityPercentage: 55 },
  { name: '新宿区', shelters: 12, availablePercentage: 90, evacuees: 1500, capacityPercentage: 70 },
  { name: '渋谷区', shelters: 7, availablePercentage: 85, evacuees: 800, capacityPercentage: 50 },
];

const resourceData = [
  { name: '食料', current: 8000, required: 10000 },
  { name: '水', current: 15000, required: 20000 },
  { name: '毛布', current: 3000, required: 5000 },
];

export default function Prefecture() {
  const [selectedMunicipality, setSelectedMunicipality] = useState(null);

  return (
    <Container fixed className="p-0">
      <Grid container spacing={3}>
        <Grid size={8}>
          <Card>
            <CardHeader title="災害対策マップ" />
            <CardContent>
              <Box sx={{ height: 'calc(100vh - 200px)', bgcolor: 'grey.200', borderRadius: 1 }}>
                {/* マップコンポーネントをここに実装 */}
                <Typography variant="body2" sx={{ p: 2 }}>
                  ここに実際のマップが表示されます。
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid size={12}>
        <Fade in={true} timeout={500}>
          <Card>
            <CardHeader title="避難者状況" />
            <CardContent>
              <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Grid size={6} sx={{ display: 'flex', alignItems: 'center' }}>
                  <PeopleAltIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="body1">避難済み: 3,000人</Typography>
                </Grid>
                <Grid size={6} sx={{ display: 'flex', alignItems: 'center' }}>
                  <PeopleAltIcon color="error" sx={{ mr: 1 }} />
                  <Typography variant="body1">未避難: 5,500人</Typography>
                </Grid>
              </Grid>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={evacueeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {evacueeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Fade>
      </Grid>
      <Grid size={12}>
        <Fade in={true} timeout={500} style={{ transitionDelay: '200ms' }}>
          <Card>
            <CardHeader title="物資状況" />
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={resourceData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="current" fill="#2196f3" name="現在の在庫" />
                  <Bar dataKey="required" fill="#f44336" name="必要量" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Fade>
      </Grid>
      <Grid size={12}>
        <Fade in={true} timeout={500} style={{ transitionDelay: '400ms' }}>
          <Card>
            <CardHeader title="市区町村別避難所情報" />
            <CardContent>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>市区町村</TableCell>
                      <TableCell align="right">避難所数</TableCell>
                      <TableCell align="right">使用可能率</TableCell>
                      <TableCell align="right">避難者数</TableCell>
                      <TableCell align="right">収容率</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {municipalityData.map((row) => (
                      <TableRow
                        key={row.name}
                        hover
                        onClick={() => setSelectedMunicipality(row)}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
                      >
                        <TableCell component="th" scope="row">
                          {row.name}
                        </TableCell>
                        <TableCell align="right">{row.shelters}</TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ width: '100%', mr: 1 }}>
                              <LinearProgress variant="determinate" value={row.availablePercentage} />
                            </Box>
                            <Box sx={{ minWidth: 35 }}>
                              <Typography variant="body2" color="text.secondary">{`${Math.round(
                                row.availablePercentage,
                              )}%`}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="right">{row.evacuees}</TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ width: '100%', mr: 1 }}>
                              <LinearProgress variant="determinate" value={row.capacityPercentage} />
                            </Box>
                            <Box sx={{ minWidth: 35 }}>
                              <Typography variant="body2" color="text.secondary">{`${Math.round(
                                row.capacityPercentage,
                              )}%`}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Fade>
      </Grid>
      {selectedMunicipality && (
        <Grow in={true} timeout={300}>
          <Card sx={{ position: 'fixed', bottom: 16, right: 16, width: 300 }}>
            <CardHeader title={`${selectedMunicipality.name} の詳細情報`} />
            <CardContent>
              <Grid container spacing={2}>
                <Grid size={6} sx={{ display: 'flex', alignItems: 'center' }}>
                  <HomeIcon sx={{ mr: 1 }} />
                  <Typography variant="body2">避難所数: {selectedMunicipality.shelters}</Typography>
                </Grid>
                <Grid size={6} sx={{ display: 'flex', alignItems: 'center' }}>
                  <PeopleAltIcon sx={{ mr: 1 }} />
                  <Typography variant="body2">避難者数: {selectedMunicipality.evacuees}</Typography>
                </Grid>
                <Grid size={6} sx={{ display: 'flex', alignItems: 'center' }}>
                  <WarningIcon sx={{ mr: 1 }} />
                  <Typography variant="body2">使用可能率: {selectedMunicipality.availablePercentage}%</Typography>
                </Grid>
                <Grid size={6} sx={{ display: 'flex', alignItems: 'center' }}>
                  <InventoryIcon sx={{ mr: 1 }} />
                  <Typography variant="body2">収容率: {selectedMunicipality.capacityPercentage}%</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grow>
      )}
    </Container>
  );
}
