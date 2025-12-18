import { useEffect, useState } from "react";
import type { Conference } from "../../types/types.ts";
import { getAllConferences } from "../../api/conferenceApi.ts";
import { downloadProgram } from "../../api/pdfApi.ts";
import {
    AdminPage,
    AdminHeader,
    AdminList,
    AdminCard,
    AdminEmpty,
    AdminButton,
} from "../../components/admin/ui";

const ProgramPage = () => {
    const [conferences, setConferences] = useState<Conference[]>([]);

    useEffect(() => {
        getAllConferences().then(setConferences);
    }, []);

    return (
        <AdminPage>
            <AdminHeader
                title="Program"
                subtitle="Download conference program (PDF)"
            />

            {conferences.length === 0 ? (
                <AdminEmpty>No conferences available</AdminEmpty>
            ) : (
                <AdminList>
                    {conferences.map(conf => (
                        <AdminCard
                            key={conf.id}
                            title={conf.name}
                            subtitle={`${conf.startDate} → ${conf.endDate}`}
                            actions={
                                <AdminButton
                                    onClick={() => downloadProgram(conf.id)}
                                >
                                    Download program
                                </AdminButton>
                            }
                        />
                    ))}
                </AdminList>
            )}
        </AdminPage>
    );
};

export default ProgramPage;