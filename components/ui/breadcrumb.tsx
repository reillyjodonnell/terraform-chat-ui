import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  path: string;
}

export function Breadcrumb({ path }: BreadcrumbProps) {
  const parts = path.split("/").filter(Boolean);

  return (
    <div className="flex items-center text-sm text-gray-400">
      {parts.map((part, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
          <span>{part}</span>
        </div>
      ))}
    </div>
  );
}
