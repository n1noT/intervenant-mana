import Form from '@/app/ui/intervenants/create-form';
import Breadcrumbs from '@/app/ui/intervenants/breadcrumbs';
 
export default async function Page() {
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Intervenants', href: '/dashboard/intervenants' },
          {
            label: 'Ajouter un intervenant',
            href: '/dashboard/intervenants/create',
            active: true,
          },
        ]}
      />
      <Form/>
    </main>
  );
}