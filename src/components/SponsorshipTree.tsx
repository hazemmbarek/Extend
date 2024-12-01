import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface TreeNode {
  id: number;
  name: string;
  children: TreeNode[];
  level: number;
  isActive: boolean;
}

interface SponsorshipTreeProps {
  data: TreeNode;
}

export default function SponsorshipTree({ data }: SponsorshipTreeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    // Ajuster les marges pour mieux aligner
    const margin = { top: 100, right: 120, bottom: 20, left: 120 };
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

    // Calculer la largeur de chaque niveau
    const levelSpacing = width / 5; // 5 espaces pour 6 niveaux
    const levels = [
      { level: 0, title: "Vous", description: "Racine", commission: "" },
      { level: 1, title: "Niveau 1", description: "Parrainages directs", commission: "20% commission" },
      { level: 2, title: "Niveau 2", description: "Parrainages indirects", commission: "15% commission" },
      { level: 3, title: "Niveau 3", description: "Réseau étendu", commission: "10% commission" },
      { level: 4, title: "Niveau 4", description: "Réseau élargi", commission: "5% commission" },
      { level: 5, title: "Niveau 5", description: "Réseau global", commission: "2.5% commission" }
    ];

    // Creates a tree layout with fixed node positions
    const treeLayout = d3.tree<TreeNode>()
      .size([height - 100, width])
      .nodeSize([60, levelSpacing]); // Ajuster la taille des nœuds

    // Creates a hierarchy from the data
    const root = d3.hierarchy(data);

    // Assigns x,y positions to nodes
    const treeData = treeLayout(root);

    // Ajuster les positions des nœuds pour aligner avec les séparateurs
    treeData.descendants().forEach(d => {
      d.y = d.depth * levelSpacing;
    });

    // Add vertical separators and level information
    levels.forEach((levelInfo, i) => {
      const x = i * levelSpacing;

      // Add separator line
      g.append("line")
        .attr("x1", x)
        .attr("x2", x)
        .attr("y1", -80)
        .attr("y2", height)
        .style("stroke", "#e0e0e0")
        .style("stroke-dasharray", "5,5");

      // Add level title
      g.append("text")
        .attr("x", x + levelSpacing / 2)
        .attr("y", -60)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .style("fill", getNodeColor(levelInfo.level))
        .text(levelInfo.title);

      // Add level description
      g.append("text")
        .attr("x", x + levelSpacing / 2)
        .attr("y", -40)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("fill", "#666")
        .text(levelInfo.description);

      // Add commission info
      if (levelInfo.commission) {
        g.append("text")
          .attr("x", x + levelSpacing / 2)
          .attr("y", -20)
          .attr("text-anchor", "middle")
          .style("font-size", "12px")
          .style("fill", "#4CAF50")
          .text(levelInfo.commission);
      }
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

    // Add node backgrounds
    nodes.append("circle")
      .attr("r", 25)
      .style("fill", d => getNodeColor(d.data.level))
      .style("stroke", d => d.data.isActive ? "#4CAF50" : "#ff0000")
      .style("stroke-width", "3px")
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 30);
      })
      .on("mouseout", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 25);
      });

    // Add user names
    nodes.append("text")
      .attr("dy", -30)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text(d => d.data.name);

    // Add level numbers
    nodes.append("text")
      .attr("dy", 5)
      .attr("text-anchor", "middle")
      .style("fill", "#fff")
      .style("font-size", "14px")
      .text(d => `N${d.data.level}`);

    // Add status indicator
    nodes.append("text")
      .attr("dy", 35)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", d => d.data.isActive ? "#4CAF50" : "#ff0000")
      .text(d => d.data.isActive ? "Actif" : "Inactif");

  }, [data, selectedLevel]);

  const getNodeColor = (level: number): string => {
    const colors = {
      0: '#2E7D32', // Dark Green
      1: '#1976D2', // Dark Blue
      2: '#7B1FA2', // Dark Purple
      3: '#F57C00', // Dark Orange
      4: '#D32F2F', // Dark Red
      5: '#5D4037'  // Dark Brown
    };
    return colors[level as keyof typeof colors] || colors[0];
  };

  return (
    <div className="sponsorship-tree">
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
      `}</style>
    </div>
  );
} 