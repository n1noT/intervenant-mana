'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/app/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

const FormSchema = z.object({
  id: z.string(),
  email: z.string().email('Email invalide'),
  firstname: z.string(),
  lastname: z.string(),
});

export type State = {
  errors?: {
    email?: string[];
    firstname?: string[];
    lastname?: string[];
    enddate?: string[];
  };
  message: string;
};

const CreateIntervenant = FormSchema.omit({ id: true });
 
export async function createIntervenant(
  state: State,
  formData: FormData
): Promise<State> {
  // Validate form using Zod
  const validatedFields = CreateIntervenant.safeParse({
    email: formData.get('email'),
    firstname: formData.get('firstname'),
    lastname: formData.get('lastname'),
  });
 
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Champs manquants.',
    };
  }
 
  // Prepare data for insertion into the database
  const { email, firstname, lastname } = validatedFields.data;
  const key = uuidv4();
  const creationdate = new Date().toISOString();
  const enddate = new Date();
  enddate.setMonth(enddate.getMonth() + 2);
 
  // Insert data into the database
  try {
    const client = await db.connect();
    await client.query(`
      INSERT INTO intervenant(
        email,
        firstname,
        lastname,
        key,
        creationdate,
        enddate,
        availability
      )
      VALUES ($1, $2, $3, $4, $5, $6, '{}')`, [email, firstname, lastname, key, creationdate, enddate.toISOString()]);
    client.release();
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Intervenant : ' + error,
    };
  }
 
  // Revalidate the cache for the intervenants page and redirect the user.
  revalidatePath('/dashboard/intervenants');
  redirect('/dashboard/intervenants');
}

const FormEditSchema = z.object({
  id: z.string(),
  email: z.string().email('Email invalide'),
  firstname: z.string(),
  lastname: z.string(),
  enddate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date invalide')
});

const UpdateIntervenant = FormEditSchema.omit({ id: true});

export async function updateIntervenant(id: string, prevState: State, formData: FormData) {
  // Validate form using Zod
  const validatedFields = UpdateIntervenant.safeParse({
    email: formData.get('email'),
    firstname: formData.get('firstname'),
    lastname: formData.get('lastname'),
    enddate: formData.get('enddate'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Champs manquants ou invalides.',
    };
  }

  // Prepare data for insertion into the database
  const { email, firstname, lastname, enddate } = validatedFields.data;

  // Insert data into the database
  try {
    const client = await db.connect();
    await client.query(`
      UPDATE intervenant
      SET email = $1, firstname = $2, lastname = $3, enddate = $4
      WHERE id = $5
    `, [email, firstname, lastname, enddate, id]);
    client.release();
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Update Intervenant: ' + error,
    };
  }

  revalidatePath('/dashboard/intervenants');
  redirect('/dashboard/intervenants');
}

export async function deleteIntervenant(id: string) {
  try {
    const client = await db.connect();
    await client.query(`DELETE FROM intervenant WHERE id = ${id}`);
    client.release();
    revalidatePath('/dashboard/intervenants');
    return { message: 'Deleted intervenant.' };
  } catch (error) {
    console.error('Failed to fetch intervenants:', error);
    return { message: 'Database Error: Failed to Delete intervenant.' };
  }
}

export async function generateIntervenantKey(id: string) {
  try {
    const key = uuidv4();
    const creationdate = new Date().toISOString();
    const enddate = new Date();
    enddate.setMonth(enddate.getMonth() + 2);
    const client = await db.connect();
    await client.query(`UPDATE intervenant SET key = $1, creationdate = $2, enddate = $3 WHERE id = $4`, [key, creationdate, enddate, id]);
    client.release();
    revalidatePath('/dashboard/intervenants');
    return { message: 'Generated new key.' };
  } catch (error) {
    console.error('Failed to fetch intervenants:', error);
    return { message: 'Database Error: Failed to generate new key.' };
  }
}

export async function regenerateAllKeys() {
  try {
    const client = await db.connect();
    const result = await client.query(`SELECT id FROM intervenant`);
    const intervenants = result.rows;

    for (const intervenant of intervenants) {
      const key = uuidv4();
      const creationdate = new Date().toISOString();
      const enddate = new Date();
      enddate.setMonth(enddate.getMonth() + 2);

      await client.query(`UPDATE intervenant SET key = $1, creationdate = $2, enddate = $3 WHERE id = $4`, [key, creationdate, enddate, intervenant.id]);
    }

    client.release();
    revalidatePath('/dashboard/intervenants');
    return { message: 'Generated new keys for all intervenants.' };
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to generate new keys for all intervenants.' };
  }
}

export async function findIntervenantByKey(key: string) {
  try {
    const client = await db.connect();
    const result = await client.query(`SELECT * FROM intervenant WHERE key = $1`, [key]);
    client.release();

    if (result.rows.length > 0) {
      const intervenant = result.rows[0];

      if (intervenant.enddate < new Date()) {
        throw new Error('key expired.');
      } else {
        return intervenant;
      }
    } else {
      throw new Error('Intervenant not found.');
    }
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'expired') { 
      throw new Error('expired');
    }
    throw new Error('Database Error: Failed to find intervenant by key.');
  }
}