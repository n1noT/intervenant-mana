import { notFound } from 'next/navigation';
import { fetchIntervenantByKey } from "@/app/lib/data";

export default async function Page({ params }: { params: { key: string } }) {
    const { key } = params;
    let intervenant;

    try{
        intervenant = await fetchIntervenantByKey(key);
    } catch (error) {
        if (error.message === 'expired') {
            return <p>The key is expired.</p>;
        }
       notFound();
    }

    return(
        <p>Bienvenue {intervenant.firstname} {intervenant.lastname}</p>
    );
}