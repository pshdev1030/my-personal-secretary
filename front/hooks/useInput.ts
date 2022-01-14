import React, { useState, useCallback } from "react";

type UseInputTypes = [
  string,
  (e: React.ChangeEvent<HTMLInputElement>) => void,
  React.Dispatch<React.SetStateAction<string>>
];
const useInput = (initialValue: string): UseInputTypes => {
  const [value, setValue] = useState<string>(initialValue);

  const onChangeValue = useCallback((e) => {
    setValue(e.target.value);
  }, []);
  return [value, onChangeValue, setValue];
};

export default useInput;
