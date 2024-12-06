"use client";

import { notFound } from 'next/navigation';
import { fetchIntervenantByKey } from "@/app/lib/data";
import Calendar from "@/app/ui/calendar";
import { useEffect, useState } from "react";
import Loader from '@/app/ui/loader';

export default function Page({ params }: { params: { key: string } }) {
    const { key } = params;
    const [intervenant, setIntervenant] = useState(null);
    const [error, setError] = useState(null);
    const [notFoundAlert, setNotFoundAlert] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await fetchIntervenantByKey(key);
                setIntervenant(data);
            } catch (error) {
                if (error.message === 'expired') {
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
            <Calendar availability={intervenant.availability}/>
        </div>
    );
}