import { useRoutedConference } from "../../conference/hooks/useRoutedConference.ts";

export function useActiveConference() {
    const {
        conference,
        loading,
        error,
        isPreview,
    } = useRoutedConference();

    return {
        activeConference: conference,
        loading,
        error,
        isPreview,
    };
}