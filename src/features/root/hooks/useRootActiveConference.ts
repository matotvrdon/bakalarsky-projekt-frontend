import { useRoutedConference } from "../../conference/hooks/useRoutedConference.ts";

export function useRootActiveConference() {
    const {
        conference,
    } = useRoutedConference();

    return conference;
}