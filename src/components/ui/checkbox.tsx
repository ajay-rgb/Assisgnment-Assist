import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, children, checked, ...props }, ref) => (
  <CheckboxPrimitive.Root
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    checked={checked}
    {...props}
    ref={ref}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

interface CheckboxGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  onValueChange?: (values: string[]) => void;
  defaultValue?: string[];
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  className,
  children,
  defaultValue = [],
  onValueChange,
  ...props
}) => {
  const [values, setValues] = React.useState<string[]>(defaultValue);

  React.useEffect(() => {
    if (onValueChange) {
      onValueChange(values);
    }
  }, [values, onValueChange]);

  const handleChange = (value: string) => {
    if (values.includes(value)) {
      setValues(values.filter((v) => v !== value));
    } else {
      setValues([...values, value]);
    }
  };

  const checkboxChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type === Checkbox) {
      return React.cloneElement(child, {
        checked: values.includes(child.props.value),
        onCheckedChange: (checked) => {
          if (checked) {
            handleChange(child.props.value);
          } else {
            handleChange(child.props.value);
          }
        },
      });
    }
    return child;
  });

  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      {checkboxChildren}
    </div>
  );
};

const CheckboxGroupItem = () => {
  return <></>;
};
CheckboxGroupItem.displayName = "CheckboxGroupItem";

export { Checkbox, CheckboxGroup, CheckboxGroupItem };
