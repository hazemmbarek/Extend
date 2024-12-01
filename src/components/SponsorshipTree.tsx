import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface TreeNode {
  id: number;
  name: string;
  children: TreeNode[];
  level: number;
}

interface SponsorshipTreeProps {
  data: TreeNode;
}

export default function SponsorshipTree({ data }: SponsorshipTreeProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { top: 20, right: 120, bottom: 20, left: 120 };
    const width = 1200 - margin.left - margin.right;
    const height = 800 - margin.top - margin.bottom;

    // Create the SVG container with zoom support
    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 2])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Create a group for the tree
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Creates a tree layout with modified orientation
    const treeLayout = d3.tree<TreeNode>()
      .size([height, width])
      .nodeSize([50, 150]); // Adjust node spacing

    // Creates a hierarchy from the data
    const root = d3.hierarchy(data);

    // Move the root node to the left
    root.x0 = height / 2;
    root.y0 = 0;

    // Assigns x,y positions to nodes and shift everything right
    const treeData = treeLayout(root);
    
    // Shift all nodes to the right
    treeData.descendants().forEach(d => {
      d.y = d.depth * 180 + 200; // Increase the multiplier and add base offset
    });

    // Create level lines
    const levels = Array.from({ length: 6 }, (_, i) => i);
    
    // Add level indicators with adjusted positions
    levels.forEach(level => {
      const xPos = level * 180 + 200; // Match the node positioning
      g.append("line")
        .attr("class", "level-line")
        .attr("x1", xPos)
        .attr("x2", xPos)
        .attr("y1", 0)
        .attr("y2", height)
        .style("stroke", "#e0e0e0")
        .style("stroke-dasharray", "5,5");

      g.append("text")
        .attr("class", "level-text")
        .attr("x", xPos)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .text(`Niveau ${level}`);
    });

    // Add links between nodes
    const links = g.selectAll(".link")
      .data(treeData.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", d3.linkHorizontal<any, any>()
        .x((d: any) => d.y)
        .y((d: any) => d.x))
      .style("fill", "none")
      .style("stroke", "#ccc")
      .style("stroke-width", "2px");

    // Create node groups
    const nodes = g.selectAll(".node")
      .data(treeData.descendants())
      .enter()
      .append("g")
      .attr("class", d => `node level-${d.data.level}`)
      .attr("transform", d => `translate(${d.y},${d.x})`);

    // Rest of the node styling remains the same
    nodes.append("circle")
      .attr("r", 20)
      .style("fill", d => getNodeColor(d.data.level))
      .style("stroke", "#fff")
      .style("stroke-width", "2px")
      .on("mouseover", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 25);
      })
      .on("mouseout", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 20);
      });

    // Add user names
    nodes.append("text")
      .attr("dy", -25)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .text(d => d.data.name);

    // Add level numbers
    nodes.append("text")
      .attr("dy", 5)
      .attr("text-anchor", "middle")
      .style("fill", "#fff")
      .style("font-size", "12px")
      .text(d => d.data.level);

  }, [data]);

  // Function to get node color based on level
  const getNodeColor = (level: number): string => {
    const colors = [
      '#4CAF50', // Level 0 - Green
      '#2196F3', // Level 1 - Blue
      '#9C27B0', // Level 2 - Purple
      '#FF9800', // Level 3 - Orange
      '#F44336', // Level 4 - Red
      '#795548'  // Level 5 - Brown
    ];
    return colors[level] || colors[0];
  };

  return (
    <div className="sponsorship-tree">
      <div className="controls">
        <button onClick={() => {
          const svg = d3.select(svgRef.current);
          svg
            .transition()
            .duration(750)
            .call(
              (d3.zoom<SVGSVGElement, unknown>() as any)
              .transform,
              d3.zoomIdentity.translate(0, 0).scale(1)
            );
        }}>Reset Zoom</button>
      </div>
      <svg ref={svgRef}></svg>
      <style jsx>{`
        .sponsorship-tree {
          width: 100%;
          overflow: hidden;
          background: white;
          padding: 1rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .controls {
          margin-bottom: 1rem;
          margin-left: 200px; // Align with the tree
        }
        .controls button {
          padding: 0.5rem 1rem;
          background: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .controls button:hover {
          background: #45a049;
        }
      `}</style>
    </div>
  );
} 