"use client";

import { notFound } from 'next/navigation';
import { fetchIntervenantByKey } from "@/app/lib/data";
import DefaultCalendar from '@/app/ui/defaultCalendar';
import { useEffect, useState } from "react";
import Loader from '@/app/ui/loader';
import Link  from 'next/link';
import { Button } from '@/app/ui/button';
import { Intervenant } from '@/app/lib/definitions';

export default function Page({ params }: { params: { key: string } }) {
    const { key } = params;
    const [intervenant, setIntervenant] = useState<Intervenant | null>(null);
    const [error, setError] = useState("");
    const [notFoundAlert, setNotFoundAlert] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await fetchIntervenantByKey(key);
                setIntervenant(data);
            } catch (error) {
                if (error instanceof Error && error.message === 'expired') {
                    setError('The key is expired.');
                } else {
                    setNotFoundAlert(true);
                }
            }
        }
        fetchData();
    }, [key]);

    if (notFoundAlert) {
        notFound();
        return null;
    }

    if (error) {
        return (
            <div className="h-screen flex justify-center items-center text-red-500">
                {error}
            </div> 
        )
    }

    if (!intervenant) {
        return (
        <div className="h-screen flex justify-center">
            <Loader />
        </div> 
        )
    }

    return (
        <div>
            <p>Bienvenue {intervenant.firstname} {intervenant.lastname}</p>
            <Link href={`/availability/${intervenant.key}`}>
                    <Button>Retour</Button>
            </Link>
            <DefaultCalendar availability={intervenant.availability} id={intervenant.id}/>
        </div>
    );
}