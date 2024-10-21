import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Charts: React.FC<ChartsProps> = ({ evacuees, materials }) => {
  const pieRef = useRef<SVGSVGElement>(null);
  const barRef = useRef<SVGSVGElement>(null);
  const safetyRef = useRef<SVGSVGElement>(null);
  const materialBarRef = useRef<SVGSVGElement>(null);
  const materialNameBarRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!pieRef.current || !barRef.current || !safetyRef.current || !materialBarRef.current || !materialNameBarRef.current ||
        !Array.isArray(evacuees) || evacuees.length === 0 || 
        !Array.isArray(materials) || materials.length === 0) return;

    const pieSvg = d3.select(pieRef.current);
    const barSvg = d3.select(barRef.current);
    const safetySvg = d3.select(safetyRef.current);
    const materialBarSvg = d3.select(materialBarRef.current);
    const materialNameBarSvg = d3.select(materialNameBarRef.current);

    pieSvg.selectAll("*").remove();
    barSvg.selectAll("*").remove();
    safetySvg.selectAll("*").remove();
    materialBarSvg.selectAll("*").remove();
    materialNameBarSvg.selectAll("*").remove();

    const pieWidth = 300;
    const pieHeight = 300;
    const pieRadius = Math.min(pieWidth, pieHeight) / 2;
    pieSvg.attr('width', pieWidth).attr('height', pieHeight);

    const barWidth = 300;
    const barHeight = 300;
    barSvg.attr('width', barWidth).attr('height', barHeight);

    const safetyWidth = 300;
    const safetyHeight = 300;
    const safetyRadius = Math.min(safetyWidth, safetyHeight) / 2;
    safetySvg.attr('width', safetyWidth).attr('height', safetyHeight);

    const materialBarWidth = 300;
    const materialBarHeight = 300;
    materialBarSvg.attr('width', materialBarWidth).attr('height', materialBarHeight);

    const materialNameBarWidth = 300;
    const materialNameBarHeight = 300;
    materialNameBarSvg.attr('width', materialNameBarWidth).attr('height', materialNameBarHeight);

    const colors = ['#63b3ed', '#f6ad55', '#fc8181', '#48bb78', '#9f7aea']; // 明るい、ソフトな色

    // 1. 避難所ごとの人数を集計 (円グラフ)
    const shelterCounts = d3.rollups(
      evacuees,
      v => v.length,
      d => d.shelter_name
    );

    const pie = d3.pie<[string, number]>().value(d => d[1]);
    const arc = d3.arc<d3.PieArcDatum<[string, number]>>()
      .innerRadius(0)
      .outerRadius(pieRadius);

    const pieGroup = pieSvg.append('g')
      .attr('transform', `translate(${pieWidth / 2}, ${pieHeight / 2})`);

    pieGroup.selectAll('path')
      .data(pie(shelterCounts))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (_, i) => colors[i % colors.length])
      .transition()
      .duration(1000)
      .attrTween('d', function(d) {
        const i = d3.interpolate(d.startAngle, d.endAngle);
        return function(t) {
          d.endAngle = i(t);
          return arc(d);
        };
      });

    // 凡例の追加
    pieGroup.selectAll('text')
      .data(pie(shelterCounts))
      .enter()
      .append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#333')
      .text(d => `${d.data[0]} (${d.data[1]})`);

    // タイトルの追加
    pieSvg.append('text')
      .attr('x', pieWidth / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .attr('fill', '#333')
      .text('避難所ごとの人数');

    // 2. 年代ごとの避難者の実人数（棒グラフ）
    const ageDistribution = d3.rollups(
      evacuees,
      v => v.length,
      d => {
        const age = new Date().getFullYear() - new Date(d.birth_date).getFullYear();
        if (age < 20) return "0-19";
        if (age < 40) return "20-39";
        if (age < 60) return "40-59";
        return "60+";
      }
    );

    const barMargin = { top: 30, right: 20, bottom: 40, left: 60 };

    const barX = d3.scaleBand()
      .range([0, barWidth - barMargin.left - barMargin.right])
      .domain(ageDistribution.map(d => d[0]))
      .padding(0.3);

    const barY = d3.scaleLinear()
      .range([barHeight - barMargin.top - barMargin.bottom, 0])
      .domain([0, d3.max(ageDistribution, d => d[1]) || 0]);

    const ageGroup = barSvg.append('g')
      .attr('transform', `translate(${barMargin.left}, ${barMargin.top})`);

    ageGroup.selectAll('.bar')
      .data(ageDistribution)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => barX(d[0]) || 0)
      .attr('width', barX.bandwidth())
      .attr('y', barHeight - barMargin.top - barMargin.bottom)
      .attr('height', 0)
      .attr('fill', colors[0])
      .transition()
      .duration(1000)
      .attr('y', d => barY(d[1]))
      .attr('height', d => barHeight - barMargin.top - barMargin.bottom - barY(d[1]));

    ageGroup.append('g')
      .attr('transform', `translate(0, ${barHeight - barMargin.top - barMargin.bottom})`)
      .call(d3.axisBottom(barX))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#000');

    ageGroup.append('g')
      .call(d3.axisLeft(barY))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#000');

    ageGroup.append('text')
      .attr('x', (barWidth - barMargin.left - barMargin.right) / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .attr('fill', '#000')
      .text('年代ごとの避難者数');

    // 3. 安否確認の比率（円グラフ）
    const safetyCounts = [
      { label: '安全', count: evacuees.filter(d => d.is_safety).length },
      { label: '危険', count: evacuees.filter(d => !d.is_safety).length }
    ];

    const safetyPie = d3.pie<{ label: string; count: number }>().value(d => d.count);
    const safetyArc = d3.arc<d3.PieArcDatum<{ label: string; count: number }>>()
      .innerRadius(0)
      .outerRadius(safetyRadius);

    const safetyGroup = safetySvg.append('g')
      .attr('transform', `translate(${safetyWidth / 2}, ${safetyHeight / 2})`);

    safetyGroup.selectAll('path')
      .data(safetyPie(safetyCounts))
      .enter()
      .append('path')
      .attr('d', safetyArc)
      .attr('fill', (_, i) => colors[i % colors.length])
      .transition()
      .duration(1000)
      .attrTween('d', function(d) {
        const i = d3.interpolate(d.startAngle, d.endAngle);
        return function(t) {
          d.endAngle = i(t);
          return safetyArc(d);
        };
      });

    safetyGroup.selectAll('text')
      .data(safetyPie(safetyCounts))
      .enter()
      .append('text')
      .attr('transform', d => `translate(${safetyArc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#000')
      .text(d => `${d.data.label} (${d.data.count})`);

    // タイトルの追加
    safetySvg.append('text')
      .attr('x', safetyWidth / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .attr('fill', '#333')
      .text('安否確認の比率');

    // 4. 避難所ごとの物資総量（棒グラフ）
    const materialCounts = d3.rollups(
      materials,
      v => d3.sum(v, d => d.quantity),
      d => d.shelter_name
    );

    const materialBarX = d3.scaleBand()
      .range([0, materialBarWidth - barMargin.left - barMargin.right])
      .domain(materialCounts.map(d => d[0]))
      .padding(0.3);

    const materialBarY = d3.scaleLinear()
      .range([materialBarHeight - barMargin.top - barMargin.bottom, 0])
      .domain([0, d3.max(materialCounts, d => d[1]) || 0]);

    const materialGroup = materialBarSvg.append('g')
      .attr('transform', `translate(${barMargin.left}, ${barMargin.top})`);

    materialGroup.selectAll('.bar')
      .data(materialCounts)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => materialBarX(d[0]) || 0)
      .attr('width', materialBarX.bandwidth())
      .attr('y', materialBarHeight - barMargin.top - barMargin.bottom)
      .attr('height', 0)
      .attr('fill', colors[1])
      .transition()
      .duration(1000)
      .attr('y', d => materialBarY(d[1]))
      .attr('height', d => materialBarHeight - barMargin.top - barMargin.bottom - materialBarY(d[1]));

    materialGroup.append('g')
      .attr('transform', `translate(0, ${materialBarHeight - barMargin.top - barMargin.bottom})`)
      .call(d3.axisBottom(materialBarX))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#000');

    materialGroup.append('g')
      .call(d3.axisLeft(materialBarY))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#000');

    materialGroup.append('text')
      .attr('x', (materialBarWidth - barMargin.left - barMargin.right) / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .attr('fill', '#000')
      .text('避難所ごとの物資総量');

    // 5. 各避難所ごとの物資数量（名称付き）（棒グラフ）
    const materialNameCounts = d3.rollups(
      materials,
      v => d3.sum(v, d => d.quantity),
      d => d.material_name  // Use only the material_name without the shelter_name
    );

    const materialNameBarX = d3.scaleBand()
      .range([0, materialNameBarWidth - barMargin.left - barMargin.right])
      .domain(materialNameCounts.map(d => d[0]))
      .padding(0.3);

    const materialNameBarY = d3.scaleLinear()
      .range([materialNameBarHeight - barMargin.top - barMargin.bottom, 0])
      .domain([0, d3.max(materialNameCounts, d => d[1]) || 0]);

    const materialNameGroup = materialNameBarSvg.append('g')
      .attr('transform', `translate(${barMargin.left}, ${barMargin.top})`);

    materialNameGroup.selectAll('.bar')
      .data(materialNameCounts)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => materialNameBarX(d[0]) || 0)
      .attr('width', materialNameBarX.bandwidth())
      .attr('y', materialNameBarHeight - barMargin.top - barMargin.bottom)
      .attr('height', 0)
      .attr('fill', colors[2])
      .transition()
      .duration(1000)
      .attr('y', d => materialNameBarY(d[1]))
      .attr('height', d => materialNameBarHeight - barMargin.top - barMargin.bottom - materialNameBarY(d[1]));

    materialNameGroup.append('g')
      .attr('transform', `translate(0, ${materialNameBarHeight - barMargin.top - barMargin.bottom})`)
      .call(d3.axisBottom(materialNameBarX))
      .selectAll('text')
      .style('font-size', '8px')
      .style('fill', '#000');

    materialNameGroup.append('g')
      .call(d3.axisLeft(materialNameBarY))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#000');

    materialNameGroup.append('text')
      .attr('x', (materialNameBarWidth - barMargin.left - barMargin.right) / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .attr('fill', '#000')
      .text('各避難所ごとの物資数量');
  }, [evacuees, materials]);

  return (
    <div className="container mx-auto p-8 bg-gray-100">
      <div className="mb-8"> {/* 避難者情報と物資情報の間にスペースを追加 */}
        <h2 className="text-2xl font-bold mb-6 text-gray-700">避難者情報</h2>
        <div className="grid grid-cols-3 gap-8">
          <svg ref={pieRef}></svg>
          <svg ref={barRef}></svg>
          <svg ref={safetyRef}></svg>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-700">物資情報</h2>
        <div className="grid grid-cols-2 gap-8">
          <svg ref={materialBarRef}></svg>
          <svg ref={materialNameBarRef}></svg>
        </div>
      </div>
    </div>
  );
};

export default Charts;
