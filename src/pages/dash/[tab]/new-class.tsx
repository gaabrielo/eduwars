import DashLayout from '@/components/web/dash/DashLayout';
import NewClassModal from '@/components/web/dash/components/NewClassModal';
import type { ReactElement, ReactNode } from 'react';

export default function NewClassPage() {
  // return <NewClassModal />;
  return <></>;
}

NewClassPage.getLayout = function getLayout(page: ReactElement): ReactNode {
  return <DashLayout>{page}</DashLayout>;
};
