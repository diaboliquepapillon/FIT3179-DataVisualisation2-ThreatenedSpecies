import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal, SankeyNode, SankeyLink } from 'd3-sankey';

interface ThreatData {
  threats: Array<{
    name: string;
    description: string;
    color: string;
    flows: Array<{ target: string; value: number; percentage: number }>;
  }>;
}

export const ThreatFlowChart = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAndRender = async () => {
      if (!svgRef.current) return;

      try {
        const baseUrl = import.meta.env.BASE_URL;
        const response = await fetch(`${baseUrl}threat_causes.json`);
        const data: ThreatData = await response.json();

        renderSankey(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load threat data:', error);
        setLoading(false);
      }
    };

    loadAndRender();
  }, []);

  const renderSankey = (data: ThreatData) => {
    if (!svgRef.current) return;

    const width = 900;
    const height = 500;
    const margin = { top: 20, right: 120, bottom: 20, left: 120 };

    // Clear existing
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3
      .select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Prepare nodes and links
    const nodes: Array<{ name: string; color?: string }> = [];
    const links: Array<{ source: number; target: number; value: number; percentage: number }> = [];

    // Add threat nodes
    data.threats.forEach((threat) => {
      nodes.push({ name: threat.name, color: threat.color });
    });

    // Add species group nodes
    const speciesGroups = ['Mammals', 'Birds', 'Reptiles', 'Amphibians', 'Fish'];
    speciesGroups.forEach((group) => {
      nodes.push({ name: group, color: '#568567' });
    });

    // Create links
    data.threats.forEach((threat, threatIndex) => {
      threat.flows.forEach((flow) => {
        const targetIndex = nodes.findIndex((n) => n.name === flow.target);
        if (targetIndex !== -1) {
          links.push({
            source: threatIndex,
            target: targetIndex,
            value: flow.value,
            percentage: flow.percentage,
          });
        }
      });
    });

    // Create sankey generator
    const sankeyGenerator = sankey<any, any>()
      .nodeWidth(20)
      .nodePadding(20)
      .extent([
        [0, 0],
        [width - margin.left - margin.right, height - margin.top - margin.bottom],
      ]);

    const { nodes: sankeyNodes, links: sankeyLinks } = sankeyGenerator({
      nodes: nodes.map((d) => ({ ...d })),
      links: links.map((d) => ({ ...d })),
    });

    // Draw links
    svg
      .append('g')
      .selectAll('.link')
      .data(sankeyLinks)
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', (d: any) => d.source.color || '#ccc')
      .attr('stroke-width', (d: any) => Math.max(1, d.width))
      .attr('fill', 'none')
      .attr('opacity', 0.4)
      .on('mouseover', function (event, d: any) {
        d3.select(this).attr('opacity', 0.7).attr('stroke-width', d.width + 2);
        
        const tooltip = d3.select('body').append('div')
          .attr('class', 'absolute bg-card border border-border rounded-lg shadow-lg p-3 z-50 pointer-events-none')
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 10}px`)
          .html(`
            <div class="text-sm font-semibold">${d.source.name} → ${d.target.name}</div>
            <div class="text-lg font-bold text-primary">${d.value} species</div>
            <div class="text-xs text-muted-foreground">${d.percentage}% of ${d.target.name} threats</div>
          `);
      })
      .on('mouseout', function (event, d: any) {
        d3.select(this).attr('opacity', 0.4).attr('stroke-width', Math.max(1, d.width));
        d3.selectAll('body > div').filter(function() {
          return d3.select(this).attr('class')?.includes('absolute bg-card');
        }).remove();
      });

    // Draw nodes
    const node = svg
      .append('g')
      .selectAll('.node')
      .data(sankeyNodes)
      .enter()
      .append('g')
      .attr('class', 'node');

    node
      .append('rect')
      .attr('x', (d: any) => d.x0)
      .attr('y', (d: any) => d.y0)
      .attr('height', (d: any) => d.y1 - d.y0)
      .attr('width', (d: any) => d.x1 - d.x0)
      .attr('fill', (d: any) => d.color || '#568567')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function () {
        d3.select(this).attr('opacity', 0.8);
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 1);
      });

    // Add node labels
    node
      .append('text')
      .attr('x', (d: any) => (d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6))
      .attr('y', (d: any) => (d.y1 + d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', (d: any) => (d.x0 < width / 2 ? 'start' : 'end'))
      .text((d: any) => d.name)
      .style('font-size', '0.875rem')
      .style('font-weight', '600')
      .style('fill', 'hsl(25 40% 20%)');
  };

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="skeleton w-full h-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <svg ref={svgRef} className="w-full max-w-5xl h-auto" />
      <div className="mt-4 text-center max-w-2xl">
        <p className="text-sm text-muted-foreground">
          💡 <strong>Hover</strong> over the flow paths to see how threats impact different animal groups.
          Thicker flows indicate greater impact.
        </p>
      </div>
    </div>
  );
};

