import { NextResponse } from 'next/server';
import { initDB } from '@/lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

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

    // Modified query to get all sponsored users where current user is sponsor
    const [rows] = await pool.query(`
      WITH RECURSIVE user_tree AS (
        -- Base: get all direct sponsored users
        SELECT 
          u.id,
          u.username,
          u.referral_code,
          u.created_at,
          st.sponsor_id,
          st.level,
          CASE WHEN u.status = 'active' THEN true ELSE false END as isActive,
          (SELECT COUNT(*) FROM sponsorship_tree WHERE sponsor_id = u.id) as total_sponsored
        FROM users u
        JOIN sponsorship_tree st ON u.id = st.user_id
        WHERE st.sponsor_id = ?

        UNION ALL

        -- Get their sponsored users recursively
        SELECT 
          u.id,
          u.username,
          u.referral_code,
          u.created_at,
          st.sponsor_id,
          st.level,
          CASE WHEN u.status = 'active' THEN true ELSE false END as isActive,
          (SELECT COUNT(*) FROM sponsorship_tree WHERE sponsor_id = u.id) as total_sponsored
        FROM users u
        JOIN sponsorship_tree st ON u.id = st.user_id
        JOIN user_tree ut ON st.sponsor_id = ut.id
      )
      SELECT 
        u.id,
        u.username,
        u.referral_code,
        u.created_at,
        st.sponsor_id,
        st.level,
        CASE WHEN u.status = 'active' THEN true ELSE false END as isActive,
        (SELECT COUNT(*) FROM sponsorship_tree WHERE sponsor_id = u.id) as total_sponsored
      FROM users u
      JOIN sponsorship_tree st ON u.id = st.user_id
      WHERE st.sponsor_id = ?
      ORDER BY st.level, u.id;
    `, [decoded.userId, decoded.userId]);

    // Get the current user's info for the root node
    const [rootUser] = await pool.query(`
      SELECT 
        id,
        username,
        referral_code,
        created_at,
        CASE WHEN status = 'active' THEN true ELSE false END as isActive,
        (SELECT COUNT(*) FROM sponsorship_tree WHERE sponsor_id = id) as total_sponsored
      FROM users 
      WHERE id = ?
    `, [decoded.userId]);

    // Build tree structure
    const buildTree = (nodes: any[], parentId: number | null = null): TreeNode[] => {
      return nodes
        .filter(node => node.sponsor_id === parentId)
        .map(node => ({
          id: node.id,
          name: node.username,
          level: node.level,
          isActive: node.isActive,
          referralCode: node.referral_code,
          totalSponsored: node.total_sponsored,
          joinedDate: new Date(node.created_at).toLocaleDateString('fr-FR'),
          children: buildTree(nodes, node.id)
        }));
    };

    // Create root node with all sponsored users as children
    const rootNode: TreeNode = {
      id: (rootUser as any[])[0].id,
      name: (rootUser as any[])[0].username,
      level: 0,
      isActive: (rootUser as any[])[0].isActive,
      referralCode: (rootUser as any[])[0].referral_code,
      totalSponsored: (rootUser as any[])[0].total_sponsored,
      joinedDate: new Date((rootUser as any[])[0].created_at).toLocaleDateString('fr-FR'),
      children: buildTree(rows as any[], decoded.userId)
    };

    return NextResponse.json(rootNode);

  } catch (error) {
    console.error('Sponsorship tree error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
} 