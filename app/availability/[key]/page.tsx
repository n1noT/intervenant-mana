import { notFound } from 'next/navigation';
import { findIntervenantByKey } from "@/app/lib/actions";

export default async function Page({ params }: { params: { key: string } }) {
    const { key } = params;
    let intervenant;

    try{
        intervenant = await findIntervenantByKey(key);
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