import { IoSearch } from "react-icons/io5";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { useEffect, useState } from "react";
import { useDebouncedValue } from "@/hooks/useDebounce";

type SearchInputProps = {
  onSearchChange?: (search: string) => void;
  rightAddon?: React.ReactNode;
};

export const SearchInput = ({ onSearchChange, rightAddon }: SearchInputProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { debouncedValue } = useDebouncedValue(searchTerm, 300);

  useEffect(() => {
    onSearchChange?.(debouncedValue);
  }, [debouncedValue]);

  return (
    <InputGroup>
      <InputGroupInput
        placeholder="Search posts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <InputGroupAddon>
        <IoSearch size={20} />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        {rightAddon}
      </InputGroupAddon>
    </InputGroup>
  );
};
