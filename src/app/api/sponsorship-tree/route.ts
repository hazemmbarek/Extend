import { NextResponse } from 'next/server';
import { initDB } from '@/lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

interface TreeNode {
  id: number;
  name: string;
  children: TreeNode[];
  level: number;
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(authToken, process.env.JWT_SECRET!) as { userId: number };
    const pool = initDB();

    // Get 5 levels of sponsorship tree
    const [rows] = await pool.query(`
      WITH RECURSIVE sponsorship_cte AS (
        -- Base case: start with the current user
        SELECT 
          u.id,
          u.username,
          st.sponsor_id,
          0 as level
        FROM users u
        LEFT JOIN sponsorship_tree st ON u.id = st.user_id
        WHERE u.id = ?

        UNION ALL

        -- Recursive case: get sponsored users up to 5 levels
        SELECT 
          u.id,
          u.username,
          st.sponsor_id,
          sc.level + 1
        FROM users u
        JOIN sponsorship_tree st ON u.id = st.user_id
        JOIN sponsorship_cte sc ON st.sponsor_id = sc.id
        WHERE sc.level < 5
      )
      SELECT * FROM sponsorship_cte
      ORDER BY level, id;
    `, [decoded.userId]);

    // Convert flat data to hierarchical structure
    const buildTree = (nodes: any[], parentId: number | null = null, level: number = 0): TreeNode[] => {
      return nodes
        .filter(node => node.sponsor_id === parentId && node.level === level)
        .map(node => ({
          id: node.id,
          name: node.username,
          level: node.level,
          children: buildTree(nodes, node.id, level + 1)
        }));
    };

    const treeData = buildTree(rows as any[])[0];

    return NextResponse.json(treeData);

  } catch (error) {
    console.error('Sponsorship tree error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
} 