import { useState } from "react";

export const useDiscloser = (
  defaultValue: boolean = false
): [boolean, () => void, () => void, () => void] => {
  const [isOpen, setIsOpen] = useState(defaultValue);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const onToggle = () => setIsOpen(!isOpen);

  return [isOpen, onClose, onOpen, onToggle];
};
