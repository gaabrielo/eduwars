import { Skeleton } from '@/components/ui/skeleton';
import { dashTabs, DashTabKey } from '@/utils/consts';
import { useRouter } from 'next/router';
import { BreadcrumbContainer } from '@/components/web/dash/components/BreadcrumbContainer';

export function BreadcrumbControl({ title }: any) {
  const router = useRouter();
  console.log('🚀 ~ BreadcrumbControl ~ router:', router);

  let tabList: any = [];
  if (router?.query) {
    if (!title) {
      title = router?.query?.tab;
    }
    console.log('🚀 ~ BreadcrumbControl ~ title:', title);

    switch (router?.query?.tab) {
      case 'journey':
        if (!isNaN(Number(router?.query?.levelId))) {
          tabList = [
            dashTabs.home,
            dashTabs.journey,
            {
              path: `/dash/journey/${router?.query?.levelId}`,
              label: 'Seq. Didática',
            },
          ];
        } else {
          tabList = [dashTabs.home, dashTabs.journey];
        }
        break;
      case 'home':
        tabList = [];
        break;
      default:
        tabList = [dashTabs.home];

        if (dashTabs[title as DashTabKey]) {
          tabList.push(dashTabs[title as DashTabKey]);
        } else if (!dashTabs[title as DashTabKey]) {
          tabList.push({
            label: title,
            path: router.asPath,
          });
        } else if (dashTabs[router.query.tab as DashTabKey]) {
          tabList.push(dashTabs[router.query.tab as DashTabKey]);
        } else {
          tabList.push({
            label: 'Nenhum resultado encontrado',
            path: '/dash/home',
          });
        }
        break;
    }
  }
  console.log('🚀 ~ BreadcrumbControl ~ tabList:', tabList);

  return <>{tabList.length > 0 && <BreadcrumbContainer tabs={tabList} />}</>;
}
