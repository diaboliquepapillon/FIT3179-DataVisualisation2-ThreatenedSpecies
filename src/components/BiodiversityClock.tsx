import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface ClockData {
  status: string;
  count: number;
  color: string;
}

interface BiodiversityClockProps {
  onAchievement?: () => void;
}

export const BiodiversityClock = ({ onAchievement }: BiodiversityClockProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hasViewed, setHasViewed] = useState(false);

  useEffect(() => {
    if (!svgRef.current) return;

    const data: ClockData[] = [
      { status: 'Critically Endangered', count: 225, color: '#d62828' },
      { status: 'Endangered', count: 795, color: '#f77f00' },
      { status: 'Vulnerable', count: 1110, color: '#fcbf49' },
    ];

    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2 - 20;

    // Clear existing
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3
      .select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Create arc generator
    const arc = d3
      .arc<d3.PieArcDatum<ClockData>>()
      .innerRadius(radius * 0.4)
      .outerRadius(radius);

    const pie = d3
      .pie<ClockData>()
      .value((d) => d.count)
      .sort(null);

    // Draw arcs
    const arcs = svg
      .selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs
      .append('path')
      .attr('d', arc)
      .attr('fill', (d) => d.data.color)
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('opacity', 0.9)
      .on('mouseover', function (event, d) {
        d3.select(this).style('opacity', 1).style('cursor', 'pointer');
        
        // Show tooltip
        const tooltip = d3.select('body').append('div')
          .attr('class', 'absolute bg-card border border-border rounded-lg shadow-lg p-3 z-50')
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 10}px`)
          .html(`
            <div class="font-semibold text-sm">${d.data.status}</div>
            <div class="text-2xl font-bold text-primary">${d.data.count}</div>
            <div class="text-xs text-muted-foreground">species</div>
          `);

        d3.select(this).attr('data-tooltip', 'true');
      })
      .on('mouseout', function () {
        d3.select(this).style('opacity', 0.9);
        d3.selectAll('body > div').filter(function() {
          return d3.select(this).attr('class')?.includes('absolute bg-card');
        }).remove();
      });

    // Add center text
    svg
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.5em')
      .style('font-size', '2.5rem')
      .style('font-weight', 'bold')
      .style('fill', 'hsl(140 25% 45%)')
      .text('2,130');

    svg
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1.5em')
      .style('font-size', '0.875rem')
      .style('fill', 'hsl(30 10% 40%)')
      .text('Threatened Species');

    // Add rotation animation
    const rotateGroup = svg.append('g').attr('class', 'rotate-group');
    
    rotateGroup
      .selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', 'none')
      .attr('stroke', (d) => d.data.color)
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '5,5')
      .style('opacity', 0.3);

    // Slow rotation animation
    function rotate() {
      rotateGroup
        .transition()
        .duration(60000)
        .ease(d3.easeLinear)
        .attrTween('transform', () => {
          return (t: number) => `rotate(${t * 360})`;
        })
        .on('end', rotate);
    }
    rotate();

    // Trigger achievement after user views clock for 8 seconds
    if (!hasViewed && onAchievement) {
      const timer = setTimeout(() => {
        setHasViewed(true);
        onAchievement();
      }, 8000);
      return () => clearTimeout(timer);
    }

  }, [hasViewed, onAchievement]);

  return (
    <div className="flex flex-col items-center justify-center py-6">
      <svg ref={svgRef} className="w-full max-w-md h-auto" />
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          ⏰ The biodiversity clock ticks... each rotation represents 60 seconds
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Hover over sections to see details
        </p>
      </div>
    </div>
  );
};

