import { PencilIcon, PlusIcon, TrashIcon, KeyIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteIntervenant, generateIntervenantKey, regenerateAllKeys } from '@/app/lib/actions';

export function CreateIntervenant() {
  return (
    <Link
      href="/dashboard/intervenants/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
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
  const deleteIntervenantWithId = deleteIntervenant.bind(null, id);

  return (
    <form action={deleteIntervenantWithId}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}

export function GenerateIntervenantKey({ id }: { id: string }) {
  const generateIntervenantKeyWithId = generateIntervenantKey.bind(null, id);

  return (
    <form action={generateIntervenantKeyWithId}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Key</span>
        <KeyIcon className="w-5" />
      </button>
    </form>
  );
}

export function RegenerateAllKeys() {
  const generateAllIntervenantsKeys= regenerateAllKeys.bind(null);

  return (
    <form action={generateAllIntervenantsKeys}>
      <button className="rounded-md border p-2 hover:bg-blue-300 bg-blue-200">
        <span className="sr-only">Key</span>
        <KeyIcon className="w-5" />
      </button>
    </form>
  );
}
