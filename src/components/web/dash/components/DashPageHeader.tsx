import { Skeleton } from '@/components/ui/skeleton';
import { BreadcrumbControl } from '@/components/web/dash/components/BreadcrumbControl';

interface Props {
  title?: string | null;
}

export function DashPageHeader({ title }: Props) {
  return (
    <header className="flex flex-col w-full min-h-[calc(3rem+0.275rem)] justify-center rounded-xl gap-1.5 p-3 mb-3 border bg-zinc-100 border-zinc-200">
      {title ? (
        <h1 className="text-xl font-bold leading-none text-gray-700">
          {title}
        </h1>
      ) : (
        <Skeleton className="w-full max-w-48 h-7" />
      )}

      <BreadcrumbControl title={title} />
    </header>
  );
}
