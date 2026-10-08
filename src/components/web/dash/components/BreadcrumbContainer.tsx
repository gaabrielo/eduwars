import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export function BreadcrumbContainer({ tabs }: any) {
  if (tabs && tabs.length > 0) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          {tabs.map((tab: any, tabKey: number) => (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink href={tab.path}>{tab.label}</BreadcrumbLink>
              </BreadcrumbItem>
              {tabKey !== tabs.length - 1 && <BreadcrumbSeparator />}
            </>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return <></>;
}
