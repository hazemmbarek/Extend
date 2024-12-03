import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface TreeNode {
  id: number;
  name: string;
  children: TreeNode[];
  level: number;
  isActive: boolean;
  referralCode: string;
  totalSponsored: number;
  joinedDate: string;
}

interface Props {
  data: TreeNode;
}

interface FilterOption {
  label: string;
  value: string;
}

export default function SponsorshipTree({ data }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filterOptions: FilterOption[] = [
    { label: 'Tous', value: 'all' },
    { label: 'Actifs', value: 'active' },
    { label: 'Inactifs', value: 'inactive' }
  ];

  const filterData = (node: TreeNode): TreeNode | null => {
    // For root node
    if (node.level === 0) {
      return {
        ...node,
        children: node.children.reduce<TreeNode[]>((acc, child) => {
          // For inactive nodes, directly add their filtered children to the accumulator
          if (filterStatus === 'active' && !child.isActive) {
            const validGrandChildren = child.children
              .filter(grandChild => grandChild.isActive)
              .map(grandChild => ({
                ...grandChild,
                level: grandChild.level
              }));
            
            acc.push(...validGrandChildren);
            return acc;
          }

          // For active or all nodes, process normally
          if (filterStatus === 'inactive' && child.isActive) return acc;

          const filteredChildren = child.children.reduce<TreeNode[]>((childAcc, grandChild) => {
            if (filterStatus === 'active' && !grandChild.isActive) return childAcc;
            if (filterStatus === 'inactive' && grandChild.isActive) return childAcc;
            
            childAcc.push({
              ...grandChild,
              level: grandChild.level,
              children: grandChild.children
            });
            return childAcc;
          }, []);

          acc.push({
            ...child,
            level: child.level,
            children: filteredChildren
          });
          return acc;
        }, [])
      };
    }

    // For non-root nodes
    if (filterStatus === 'active' && !node.isActive) {
      // If node is inactive, return its active children directly
      return {
        ...node,
        children: node.children
          .filter(child => child.isActive)
          .map(child => ({
            ...child,
            level: child.level
          }))
      };
    }

    if (filterStatus === 'inactive' && node.isActive) return null;

    return {
      ...node,
      children: node.children
        .filter(child => {
          if (filterStatus === 'active') return child.isActive;
          if (filterStatus === 'inactive') return !child.isActive;
          return true;
        })
        .map(child => ({
          ...child,
          level: child.level
        }))
    };
  };

  useEffect(() => {
    if (!data || !svgRef.current) return;

    // Apply filters while keeping root node
    const filteredData = filterData(data);

    // Only proceed if we have data to show
    if (!filteredData || filteredData.children.length === 0) {
      // Clear the visualization
      d3.select(svgRef.current).selectAll("*").remove();
      return;
    }

    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { 
      top: 400,
      right: 120,
      bottom: 20,
      left: 300
    };
    const width = 1500 - margin.left - margin.right;
    const height = 800 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 2])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const levelSpacing = width / 5;
    const nodeOffset = levelSpacing / 2;
    const levels = [
      { level: 0, title: "Vous", description: "Racine", commission: "" },
      { level: 1, title: "Niveau 1", description: "Parrainages directs", commission: "20% commission" },
      { level: 2, title: "Niveau 2", description: "Parrainages indirects", commission: "15% commission" },
      { level: 3, title: "Niveau 3", description: "Réseau étendu", commission: "10% commission" },
      { level: 4, title: "Niveau 4", description: "Réseau élargi", commission: "5% commission" },
      { level: 5, title: "Niveau 5", description: "Réseau global", commission: "2.5% commission" }
    ];

    const treeLayout = d3.tree<TreeNode>()
      .size([height - 100, width])
      .nodeSize([100, levelSpacing * 1.2]);

    const root = d3.hierarchy(filteredData);

    const treeData = treeLayout(root);

    treeData.descendants().forEach(d => {
      d.y = (d.data.level * levelSpacing) + nodeOffset;
    });

    levels.forEach((levelInfo, i) => {
      const x = i * levelSpacing;

      g.append("line")
        .attr("x1", x)
        .attr("x2", x)
        .attr("y1", -280)
        .attr("y2", height)
        .style("stroke", "#e0e0e0")
        .style("stroke-dasharray", "5,5");

      const textX = x + nodeOffset;

      g.append("text")
        .attr("x", textX)
        .attr("y", -260)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .style("fill", getNodeColor(levelInfo.level))
        .text(levelInfo.title);

      g.append("text")
        .attr("x", textX)
        .attr("y", -240)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("fill", "#666")
        .text(levelInfo.description);

      if (levelInfo.commission) {
        g.append("text")
          .attr("x", textX)
          .attr("y", -220)
          .attr("text-anchor", "middle")
          .style("font-size", "12px")
          .style("fill", "#4CAF50")
          .text(levelInfo.commission);
      }
    });

    const links = g.selectAll(".link")
      .data(treeData.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", d3.linkHorizontal<any, any>()
        .x(d => d.y)
        .y(d => d.x))
      .style("fill", "none")
      .style("stroke", "#ccc")
      .style("stroke-width", "2px");

    const nodes = g.selectAll(".node")
      .data(treeData.descendants())
      .enter()
      .append("g")
      .attr("class", d => `node level-${d.data.level}`)
      .attr("transform", d => `translate(${d.y},${d.x})`);

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

    nodes.append("text")
      .attr("dy", -30)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text(d => d.data.name);

    nodes.append("text")
      .attr("dy", 5)
      .attr("text-anchor", "middle")
      .style("fill", "#fff")
      .style("font-size", "14px")
      .text(d => `N${d.data.level}`);

    nodes.append("text")
      .attr("dy", 35)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", d => d.data.isActive ? "#4CAF50" : "#ff0000")
      .text(d => d.data.isActive ? "Actif" : "Inactif");

  }, [data, selectedLevel, filterStatus]);

  const getNodeColor = (level: number): string => {
    const colors = {
      0: '#2E7D32',
      1: '#1976D2',
      2: '#7B1FA2',
      3: '#F57C00',
      4: '#D32F2F',
      5: '#5D4037'
    };
    return colors[level as keyof typeof colors] || colors[0];
  };

  return (
    <div className="sponsorship-tree-container">
      <div className="tree-filters">
        <div className="filter-buttons">
          {filterOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setFilterStatus(option.value)}
              className={`filter-button ${filterStatus === option.value ? 'active' : ''}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div className="sponsorship-tree">
        <svg ref={svgRef}></svg>
      </div>
      <style jsx>{`
        .sponsorship-tree-container {
          width: 100%;
        }

        .tree-filters {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 2rem;
          padding: 1rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .filter-buttons {
          display: flex;
          gap: 1rem;
        }

        .filter-button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          background: #f5f5f5;
          color: #666;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .filter-button:hover {
          background: #e0e0e0;
        }

        .filter-button.active {
          background: #6A1B9A;
          color: white;
        }

        .sponsorship-tree {
          width: 100%;
          overflow: auto;
          background: white;
          padding: 5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-top: 5rem;
        }
      `}</style>
    </div>
  );
} 