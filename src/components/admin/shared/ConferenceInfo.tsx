import type { Conference } from "../../../types/types";

type Props = {
  conference: Conference;
};

export default function ConferenceInfo({ conference }: Props) {
  return (
    <>
      Conference: <strong>{conference.name}</strong>
      <br />
      {conference.startDate} → {conference.endDate}
    </>
  );
}

