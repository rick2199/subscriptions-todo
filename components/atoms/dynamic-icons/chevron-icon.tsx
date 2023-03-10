interface Props {
  color?: string;
}

const ChevronIcon: React.FC<Props> = ({ color = "#000" }) => {
  return (
    <svg
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.41421 10.4142L12.0711 4.75736L17.7279 10.4142L19.1421 9L12.0711 1.92893L5 9L6.41421 10.4142Z"
        fill={color}
      />
      <path
        d="M17.7279 13.6569L12.0711 19.3137L6.41423 13.6569L5.00002 15.0711L12.0711 22.1421L19.1422 15.0711L17.7279 13.6569Z"
        fill={color}
      />
    </svg>
  );
};

export default ChevronIcon;
