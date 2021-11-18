import { FC } from "react";

export const SpeakerUnmute: FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      width="11"
      height="16"
      viewBox="0 0 11 16"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.77778 16C10.3764 16 10.8027 15.5737 10.8027 14.9841V1.07029C10.8027 0.480726 10.3764 0 9.75964 0C9.3424 0 9.05215 0.181406 8.58957 0.62585L4.72562 4.25397C4.66213 4.30839 4.58957 4.3356 4.49887 4.3356H1.89569C0.671202 4.3356 0 5.01587 0 6.322V9.69615C0 11.0113 0.671202 11.6825 1.89569 11.6825H4.49887C4.58957 11.6825 4.66213 11.7098 4.72562 11.7642L8.58957 15.4286C9.0068 15.8277 9.36054 16 9.77778 16Z"
        fill="white"
      />
    </svg>
  );
};
