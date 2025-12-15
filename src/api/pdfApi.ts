import { BASE_URL } from "./baseApi";

export const downloadProgram = async (conferenceId: number) => {
    const response = await fetch(
        `${BASE_URL}/api/pdf/create-program/${conferenceId}`,
        {
            method: "POST"
        }
    );

    if (!response.ok) {
        throw new Error("Failed to download program PDF");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "program.pdf";
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
};