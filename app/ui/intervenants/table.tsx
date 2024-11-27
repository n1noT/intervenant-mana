import { UpdateIntervenant, DeleteIntervenant , GenerateIntervenantKey } from '@/app/ui/intervenants/buttons';
import { formatDateToLocal } from '@/app/lib/utils';
import { fetchFilteredIntervenants } from '@/app/lib/data';

export default async function IntervenantsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const intervenants = await fetchFilteredIntervenants(query, currentPage);;

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {intervenants?.map((intervenant) => (
              <div
                key={intervenant.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{intervenant.firstname} {intervenant.lastname}</p>
                    </div>
                    <p className="text-sm text-gray-500">{intervenant.email}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <p>{formatDateToLocal(intervenant.creationdate)}</p>
                </div>
                <div className="flex justify-end gap-2">
                  <UpdateIntervenant id={intervenant.id} />
                  <DeleteIntervenant id={intervenant.id} />
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  ID
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Prénom
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Nom
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Clé
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date de création
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date de fin
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {intervenants?.map((intervenant) => (
                <tr
                  key={intervenant.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className={`flex rounded-full items-center justify-center w-6 h-6 `}>
                      {intervenant.id}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {intervenant.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {intervenant.firstname}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {intervenant.lastname}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {intervenant.key}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(intervenant.creationdate)}
                  </td>
                  <td className={`whitespace-nowrap px-3 py-3 ${intervenant.enddate < new Date() ? "text-red-500 line-through" : "text-green-500 "}`}>
                    {formatDateToLocal(intervenant.enddate)}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <GenerateIntervenantKey id={intervenant.id} />
                      <UpdateIntervenant id={intervenant.id} />
                      <DeleteIntervenant id={intervenant.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
