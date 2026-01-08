interface Props {
  errors: string[];
}

function ValidationErrors({ errors }: Props) {
  return (
    <ul>
      {errors.map((error, index) => (
        <li key={index}>{error}</li>
      ))}
    </ul>
  );
}

export default ValidationErrors;
