import React, { ReactNode } from "react";
import * as Select from "@radix-ui/react-select";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";

type SelectItem = {
  children: ReactNode;
  value: string;
};

type Dropdown = {
  groups: {
    group_label: string;
    items: {
      name: string;
      value: string;
    }[];
  }[];
  ariaLabel: string;
  placeholder: string;
  value?: string;
  onValueChange?: (value: string) => void;
};

const SelectItem = ({ children, value }: SelectItem) => {
  return (
    <Select.Item
      value={value}
      className="text-xs leading-none rounded-sm flex items-center h-6 relative select-none px-6 text-primary-11"
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="absolute left-0 w-6 inline-flex items-center justify-center">
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  );
};

const Dropdown = ({ placeholder, ariaLabel, groups, value, onValueChange }: Dropdown) => {
  

  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger
        aria-label={ariaLabel}
        className="bg-neutral-1 inline-flex items-center justify-between rounded text-xs leading-none h-8 w-full px-4 gap-1 border shadow-neutral-6 hover:bg-neutral-3"
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon className="text-primary-11 justify-self-end">
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="overflow-hidden bg-primary-1 rounded-md shadow-md">
          <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-primary-1 cursor-default text-primary-11">
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport className="p-1">
            {groups.map((group, group_index: number) => (
              <>
                <Select.Group>
                  <Select.Label className="text-xs leading-6 px-6 text-neutral-11">
                    {group.group_label}
                  </Select.Label>
                  {group.items.map((item, item_index: number) => (
                    <SelectItem key={item_index} value={item.value}>
                      {item.name}
                    </SelectItem>
                  ))}
                </Select.Group>
                {group_index != groups.length - 1 && (
                  <Select.Separator className="h-px m-1 bg-primary-6" />
                )}
              </>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton>
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

export default Dropdown;
