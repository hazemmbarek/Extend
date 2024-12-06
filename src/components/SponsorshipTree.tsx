import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { ZoomBehavior } from 'd3';

interface TreeNode {
  id: number;
  name: string;
  children: TreeNode[];
  level: number;
  isActive: boolean;
  referralCode: string;
  totalSponsored: number;
  joinedDate: string;
  isVisible?: boolean;
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
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });

  const margin = { 
    top: 100,
    right: 120,
    bottom: 20,
    left: 300
  };

  const filterOptions: FilterOption[] = [
    { label: 'Tous', value: 'all' },
    { label: 'Actifs', value: 'active' },
    { label: 'Inactifs', value: 'inactive' }
  ];

  const levelOptions: FilterOption[] = [
    { label: 'Tous les niveaux', value: 'all' },
    { label: 'Niveau 1', value: '1' },
    { label: 'Niveau 2', value: '2' },
    { label: 'Niveau 3', value: '3' },
    { label: 'Niveau 4', value: '4' },
    { label: 'Niveau 5', value: '5' },
  ];

  const filterData = (node: TreeNode): TreeNode | null => {
    // Pour le nœud racine (niveau 0)
    if (node.level === 0) {
      // Si niveau 1 est sélectionné, traitement spécial
      if (selectedLevel === '1') {
        return {
          ...node,
          children: node.children
            .filter(child => {
              // Appliquer uniquement le filtre de statut pour le niveau 1
              if (filterStatus === 'active') return child.isActive;
              if (filterStatus === 'inactive') return !child.isActive;
              return true;
            })
            .map(child => ({
              ...child,
              children: [] // Forcer les enfants à être vides pour le niveau 1
            }))
        };
      }

      // Pour les autres niveaux
      if (selectedLevel !== 'all' && selectedLevel !== '1') {
        const targetLevel = parseInt(selectedLevel);
        
        return {
          ...node,
          children: node.children.map(child => ({
            ...child,
            children: child.children.map(grandChild => {
              if (targetLevel === 2) {
                return {
                  ...grandChild,
                  children: [],
                  isVisible: filterStatus === 'all' || 
                            (filterStatus === 'active' && grandChild.isActive) ||
                            (filterStatus === 'inactive' && !grandChild.isActive)
                };
              }
              
              const processChildren = (nodes: TreeNode[], currentLevel: number): TreeNode[] => {
                return nodes.map(node => ({
                  ...node,
                  children: currentLevel === targetLevel ? [] : processChildren(node.children, currentLevel + 1),
                  isVisible: filterStatus === 'all' || 
                            (filterStatus === 'active' && node.isActive) ||
                            (filterStatus === 'inactive' && !node.isActive)
                })).filter(node => node.isVisible !== false);
              };

              return {
                ...grandChild,
                children: processChildren(grandChild.children, 3)
              };
            }).filter(child => {
              if (targetLevel === 2) return child.isVisible !== false;
              return true;
            })
          }))
        };
      }

      // Si aucun niveau spécifique n'est sélectionné (all)
      const applyStatusFilter = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.filter(node => {
          if (filterStatus === 'active') return node.isActive;
          if (filterStatus === 'inactive') return !node.isActive;
          return true;
        }).map(node => ({
          ...node,
          children: applyStatusFilter(node.children)
        }));
      };

      return {
        ...node,
        children: applyStatusFilter(node.children)
      };
    }

    // Pour les nœuds non-racine
    return {
      ...node,
      children: node.children.filter(child => {
        if (filterStatus === 'active') return child.isActive;
        if (filterStatus === 'inactive') return !child.isActive;
        return true;
      })
    };
  };

  const height = 500 - margin.top - margin.bottom;

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

    const width = 1500 - margin.left - margin.right;

    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 2])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);
    zoomRef.current = zoom;

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const levelSpacing = width / 5;
    const nodeOffset = levelSpacing / 2;

    const treeLayout = d3.tree<TreeNode>()
      .size([height - 100, width])
      .nodeSize([100, levelSpacing * 1.2]);

    const root = d3.hierarchy(filteredData);

    const treeData = treeLayout(root);

    treeData.descendants().forEach(d => {
      d.y = (d.data.level * levelSpacing) + nodeOffset;
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
      .style("stroke", "#e5e7eb")
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

    const levels = [
      { level: 0, title: "Vous", description: "Racine", commission: "" },
      { level: 1, title: "Niveau 1", description: "Parrainages directs", commission: "20% commission" },
      { level: 2, title: "Niveau 2", description: "Parrainages indirects", commission: "15% commission" },
      { level: 3, title: "Niveau 3", description: "Réseau étendu", commission: "10% commission" },
      { level: 4, title: "Niveau 4", description: "Réseau élargi", commission: "5% commission" },
      { level: 5, title: "Niveau 5", description: "Réseau global", commission: "2.5% commission" }
    ];

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

  const resetView = () => {
    if (!svgRef.current || !zoomRef.current) return;
    
    // Get the root node position
    const rootNode = d3.select(svgRef.current)
      .select('.node.level-0');
    
    if (!rootNode.empty()) {
      const transform = d3.zoomIdentity
        .translate(
          margin.left + 100, // Add some offset for better visibility
          height / 2
        )
        .scale(1);

      d3.select(svgRef.current)
        .transition()
        .duration(750)
        .call(zoomRef.current.transform, transform);
    }
  };

  return (
    <div className="sponsorship-tree-container">
      <div className="content-wrapper">
        <div className="tree-header">
          <div className="tree-controls">
            <button
              onClick={resetView}
              className="reset-button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
              </svg>
              Retour à la racine
            </button>
            <div className="filter-groups">
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
              <div className="filter-buttons">
                {levelOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedLevel(option.value)}
                    className={`filter-button ${selectedLevel === option.value ? 'active' : ''}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="sponsorship-tree">
          <svg ref={svgRef}></svg>
        </div>
      </div>
      <style jsx>{`
        .sponsorship-tree-container {
          width: 100%;
          min-height: calc(100vh - 300px);
          background: linear-gradient(135deg, #f6f4ff 0%, #f1f1f9 100%);
          padding: 2rem;
        }

        .content-wrapper {
          max-width: 1800px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(106, 27, 154, 0.08);
          overflow: hidden;
          border: 1px solid rgba(106, 27, 154, 0.1);
        }

        .tree-header {
          background: #fcfaff;
          border-bottom: 1px solid rgba(106, 27, 154, 0.1);
          padding: 1.5rem 2rem;
        }

        .tree-controls {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .reset-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          color: #6A1B9A;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 1px 2px rgba(106, 27, 154, 0.05);
        }

        .reset-button:hover {
          background: #f9f5ff;
          border-color: #6A1B9A;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(106, 27, 154, 0.1);
        }

        .reset-button svg {
          stroke: #6A1B9A;
        }

        .filter-groups {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .filter-buttons {
          display: flex;
          gap: 0.75rem;
        }

        .filter-button {
          padding: 0.75rem 1.25rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          color: #374151;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 1px 2px rgba(106, 27, 154, 0.05);
        }

        .filter-button:hover {
          background: #f9f5ff;
          border-color: #6A1B9A;
          color: #6A1B9A;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(106, 27, 154, 0.1);
        }

        .filter-button.active {
          background: #6A1B9A;
          border-color: #6A1B9A;
          color: white;
          box-shadow: 0 2px 4px rgba(106, 27, 154, 0.2);
        }

        .sponsorship-tree {
          width: 100%;
          overflow: auto;
          padding: 2rem;
          background: white;
          min-height: 500px;
        }

        @media (max-width: 768px) {
          .sponsorship-tree-container {
            padding: 1rem;
          }

          .tree-header {
            padding: 1rem;
          }

          .tree-controls {
            flex-direction: column;
            gap: 1rem;
          }

          .reset-button,
          .filter-buttons {
            width: 100%;
          }

          .reset-button {
            justify-content: center;
          }

          .filter-buttons {
            flex-wrap: wrap;
          }

          .filter-button {
            flex: 1;
            text-align: center;
            min-width: 100px;
          }

          .filter-groups {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
} 