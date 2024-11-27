"use server";

import { formatCurrency } from './utils';
import { db } from '@/app/lib/db';
import { Intervenant } from '@/app/lib/definitions';

const ITEMS_PER_PAGE = 5;

export async function fetchIntervenants(): Promise<Intervenant[]> {
  try {
    const client = await db.connect();
    const result = await client.query(`
      SELECT intervenant.id,
        intervenant.email,
        intervenant.firstname,
        intervenant.lastname,
        intervenant.key,
        intervenant.creationdate,
        intervenant.enddate,
      FROM intervenant`);
    client.release();
    return result.rows as Intervenant[];
  } catch (error) {
    throw new Error(`Failed to fetch intervenants: ${error}`);
  }
}

export async function fetchIntervenantsPages(query: string): Promise<number> {
  try {
    const client = await db.connect();
    const result = await client.query('SELECT COUNT(*) FROM intervenant');
    client.release();
    return Math.ceil(Number(result.rows[0].count) / ITEMS_PER_PAGE);
  } catch (error) {
    throw new Error(`Failed to fetch intervenants pages: ${error}`);
  }
}

export async function fetchFilteredIntervenants(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const client = await db.connect();
    const queryText = `
      SELECT
        intervenant.id,
        intervenant.email,
        intervenant.firstname,
        intervenant.lastname,
        intervenant.key,
        intervenant.creationdate,
        intervenant.enddate
      FROM intervenant
      WHERE
        intervenant.firstname ILIKE $1 OR
        intervenant.lastname ILIKE $1 OR
        intervenant.email ILIKE $1 OR
        intervenant.key ILIKE $1
      ORDER BY intervenant.firstname ASC
      LIMIT $2 OFFSET $3
    `;
    const queryValues = [`%${query}%`, ITEMS_PER_PAGE, offset];
    const result = await client.query(queryText, queryValues);

    client.release();
    return result.rows as Intervenant[];

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch intervenants.');
  }
}

export async function fetchIntervenantById (id: string) {
  try {
    const client = await db.connect();
    const result = await client.query(`
      SELECT intervenant.id,
        intervenant.email,
        intervenant.firstname,
        intervenant.lastname,
        intervenant.key,
        intervenant.enddate
      FROM intervenant
      WHERE intervenant.id = $1`, [id]);
    client.release();
    return result.rows[0] as Intervenant;
  } catch (error) {
    throw new Error(`Failed to fetch intervenant: ${error}`);
  }
}