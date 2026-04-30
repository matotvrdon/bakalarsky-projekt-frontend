import { useRoutedConference } from "../../conference/hooks/useRoutedConference.ts";

export function useActiveConference() {
    const {
        conference,
    } = useRoutedConference();

    return conference;
}