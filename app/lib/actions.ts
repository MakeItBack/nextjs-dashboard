'use server';
/*
By adding the 'use server', you mark all the exported functions within the file as server functions.
These server functions can then be imported into Client and Server components, making them extremely versatile.

(You can also write 'Server Actions' directly inside Server Components by adding "use server" inside the action.
But for this course, we'll keep them all organized in a separate file.)
*/

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache'; // Use to trigger new request to server to download fresh data
import { redirect } from 'next/navigation'; // Use to redirect to a new route (page)

import { z as zod } from 'zod';
/* To handle type validation, there are a few options. While you can manually validate types,
using a type validation library can save you time and effort.
Zod is a TypeScript-first validation library. */

/* define a schema that matches the shape of your form object.
This schema will validate the formData before saving it to a database. */
const FormSchema = zod.object({
  id: zod.string(),
  customerId: zod.string(),
  amount: zod.coerce.number(),
  status: zod.enum(['pending', 'paid']),
  date: zod.string(),
});
/* The amount field is specifically set to coerce (change) from a string to a number while also validating its type.
You can then pass your rawFormData to CreateInvoice to validate the types: */

// Use Zod to update the expected types
const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  /* It's usually good practice to store monetary values in cents in your database
    to eliminate JavaScript floating-point errors: */
  const amountInCents = amount * 100;

  // Freate a new date with the format "YYYY-MM-DD" for the invoice's creation date:
  const date = new Date().toISOString().split('T')[0];

  // Insert data into database
  try {
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  /* Next.js has a Client-side Router Cache that stores the route segments in the user's browser for a time.
    Along with prefetching, this cache ensures that users can quickly navigate between routes while reducing the number of server requests.
    As we're updating the data displayed in the invoices route, we need to clear this cache and trigger a new request to the server.
    You can do this with the revalidatePath function. */
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;

  try {
    await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  // throw new Error('Failed to Delete Invoice');

  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
  } catch (error) {
    return { meassage: 'Database Error: Failed to delete invoice' };
  }

  revalidatePath('/dashboard/invoices');
}
