import { PencilIcon, PlusIcon, TrashIcon, KeyIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteIntervenant, generateIntervenantKey, regenerateAllKeys } from '@/app/lib/actions';
import React from 'react';

export function CreateIntervenant() {
  return (
    <Link
      href="/dashboard/intervenants/create"
      className="flex h-10 items-center rounded-lg bg-purple-600 px-4 text-sm font-medium text-white transition-colors hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
    >
      <span className="hidden md:block">Ajouter un intervenant</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateIntervenant({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/intervenants/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteIntervenant({ id }: { id: string }) {
  const deleteIntervenantWithId = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const res = await deleteIntervenant(id);
      console.log(res.message);
    } catch (error) {
      console.error('Error deleting intervenant:', error);
    }
  };

  return (
    <form onSubmit={deleteIntervenantWithId}>
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}

export function GenerateIntervenantKey({ id }: { id: string }) {
  const generateIntervenantKeyWithId = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const res = await generateIntervenantKey(id);
      console.log(res.message);
    } catch (error) {
      console.error('Error generating key:', error);
    }
  };

  return (
    <form onSubmit={generateIntervenantKeyWithId}>
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Key</span>
        <KeyIcon className="w-5" />
      </button>
    </form>
  );
}

export function RegenerateAllKeys() {
  const generateAllIntervenantsKeys = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const res = await regenerateAllKeys();
      console.log(res.message);
    } catch (error) {
      console.error('Error regenerating keys:', error);
    }
  };

  return (
    <form onSubmit={generateAllIntervenantsKeys}>
      <button type="submit" className="rounded-md border p-2 hover:bg-purple-300 bg-purple-200">
        <span className="sr-only">Key</span>
        <KeyIcon className="w-5" />
      </button>
    </form>
  );
}