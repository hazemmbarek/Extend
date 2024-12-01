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

    const margin = { top: 20, right: 90, bottom: 30, left: 90 };
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Create the SVG container
    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Creates a tree layout
    const treeLayout = d3.tree<TreeNode>()
      .size([height, width]);

    // Creates a hierarchy from the data
    const root = d3.hierarchy(data);

    // Assigns x,y positions to nodes
    const treeData = treeLayout(root);

    // Add links between nodes
    const links = svg.selectAll(".link")
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

    // Add nodes
    const nodes = svg.selectAll(".node")
      .data(treeData.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.y},${d.x})`);

    // Add circles for nodes
    nodes.append("circle")
      .attr("r", 10)
      .style("fill", "#fff")
      .style("stroke", "#4CAF50")
      .style("stroke-width", "2px");

    // Add labels
    nodes.append("text")
      .attr("dy", ".35em")
      .attr("x", d => d.children ? -13 : 13)
      .style("text-anchor", d => d.children ? "end" : "start")
      .text(d => d.data.name);

  }, [data]);

  return (
    <div className="sponsorship-tree">
      <svg ref={svgRef}></svg>
      <style jsx>{`
        .sponsorship-tree {
          width: 100%;
          overflow-x: auto;
          background: white;
          padding: 1rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
} 