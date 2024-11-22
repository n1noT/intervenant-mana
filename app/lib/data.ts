"use server";

import { formatCurrency } from './utils';
import { db } from '@/app/lib/db';
import { Intervenant } from '@/app/lib/definitions';

export async function fetchIntervenants(): Promise<Intervenant[]> {
  try {
    const client = await db.connect();
    const result = await client.query('SELECT * FROM intervenant');
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
    return Math.ceil(Number(result.rows[0].count) / 10);
  } catch (error) {
    throw new Error(`Failed to fetch intervenants pages: ${error}`);
  }
}
