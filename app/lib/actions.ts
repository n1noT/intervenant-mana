'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/app/lib/db';
/*
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
 */
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

const CreateInvoice = FormSchema.omit({ id: true, date: true });
 
export async function createIntervenants(prevState: State, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateInvoice.safeParse({
    email: formData.get('email'),
    firstname: formData.get('firstname'),
    lastname: formData.get('lastname'),
    key: formData.get('key'),
    creationdate: formData.get('creationdate'),
    enddate: formData.get('enddate'),
    availability: formData.get('availability'),
  });
 
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
 
  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
 
  // Insert data into the database
  try {
    const client = await db.connect();
    const result = await client.query(`
      INSERT INTO intervenant(
        intervenant.email,
        intervenant.firstname,
        intervenant.lastname,
        intervenant.key,
        intervenant.creationdate,
        intervenant.enddate,
        intervenant.availability
      )
      VALUES (${email}, ${firstname}, ${lastname}, ${key}, ${creationdate}, ${enddate}, ${availability})`);
    client.release();
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }
 
  // Revalidate the cache for the intervernants page and redirect the user.
  revalidatePath('/dashboard/intervernants');
  redirect('/dashboard/intervernants');
}
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = UpdateInvoice.parse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });
   
    const amountInCents = amount * 100;
   
    try {
      await sql`
          UPDATE intervernant
          SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
          WHERE id = ${id}
        `;
    } catch (error) {
      return { message: 'Database Error: Failed to Update Invoice.' };
    }
   
    revalidatePath('/dashboard/intervernants');
    redirect('/dashboard/intervernants');
}


export async function deleteIntervenant(id: string) {
    try {
    const client = await db.connect();
    const result = await client.query(`DELETE FROM intervenant WHERE id = ${id}`)
    client.release();
    revalidatePath('/dashboard/intervenants');
    return { message: 'Deleted intervenant.' };
    } catch (error) {
      return { message: 'Database Error: Failed to Delete intervenant.' };
    }
}