'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { useRouter } from 'next/router';

export function SmoothTabs({
  itemClassName,
  orientation = 'horizontal',
  selected = null,
  tabs = [],
  id = 'default',
}: any) {
  // console.log('🚀 ~ tabs:', tabs);
  console.log('🚀 ~ selected:', selected);
  // console.log('🚀 ~ id:', id);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<any>(null);

  useEffect(() => {
    if (typeof selected === 'number') {
      const selectedTabName = tabs.find((t: any) => t.props.id === selected);
      setActiveTab(selectedTabName.props.name);
    }
  }, [selected]);

  // useEffect(() => {}, [])

  return (
    <div className={`flex ${orientation === 'vertical' ? 'flex-col' : ''}`}>
      {tabs.map(
        (tab: any, tabIdx: number) => {
          return React.cloneElement(
            tab,
            {
              className: clsx(
                'relative cursor-pointer px-2 py-1 text-sm outline-none transition-colors list-none w-full',
                activeTab === tab.props.name
                  ? 'text-gray-800'
                  : 'text-gray-700',
                itemClassName,
                tab.props.className
              ),
              layout: 'true',
              tabIndex: tabIdx,
              onFocus: () => setActiveTab(tab.props.name),
              onMouseOver: () => setActiveTab(tab.props.name),
              onMouseLeave: () =>
                setActiveTab(
                  isNaN(selected) ? null : tabs[selected]?.props.name ?? null
                ),
            },
            <>
              {tab.props.children}
              {activeTab === tab.props.name ? (
                <motion.div
                  layoutId={`tab-indicator-${id}`}
                  className="absolute inset-0 rounded-lg bg-black/5"
                />
              ) : null}
            </>
          );
        }
        // (
        //   <motion.li
        //     layout
        //     className={clsx(
        //       'relative cursor-pointer text-sm outline-none transition-colors list-none z-10',
        //       activeTab === tab.props.name ? 'text-gray-800' : 'text-gray-700',
        //       itemClassName
        //     )}
        //     tabIndex={0}
        //     // key={tab.props.name}
        //     onFocus={() => setActiveTab(tab.props.name)}
        //     onMouseOver={() => setActiveTab(tab.props.name)}
        //     onMouseLeave={() =>
        //       setActiveTab(
        //         isNaN(selected) ? null : tabs[selected]?.props.name ?? null
        //       )
        //     }
        //     onClick={(e) => e.stopPropagation()}
        //   >

        //     {/* <button className="relative text-inherit bg-red-500"></button> */}
        //     {tab}
        //   </motion.li>
        // )
      )}
    </div>
  );
}
