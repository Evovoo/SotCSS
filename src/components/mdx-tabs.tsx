"use client";

import { Children, ReactElement, ReactNode, isValidElement, useState } from "react";

type TabProps = {
  label: string;
  children: ReactNode;
};

type TabsProps = {
  children: ReactNode;
};

function isTabElement(child: ReactNode): child is ReactElement<TabProps> {
  return isValidElement<TabProps>(child) && typeof child.props.label === "string";
}

export function Tab({ children }: TabProps) {
  return <>{children}</>;
}

export function Tabs({ children }: TabsProps) {
  const tabs = Children.toArray(children).filter(isTabElement);
  const [activeIndex, setActiveIndex] = useState(0);

  if (tabs.length === 0) {
    return null;
  }

  const safeIndex = Math.min(activeIndex, tabs.length - 1);

  return (
    <div className="my-8 overflow-hidden rounded-[1.5rem] border border-ink/10 bg-white shadow-panel">
      <div className="flex flex-wrap gap-2 border-b border-ink/10 bg-mist/80 px-4 py-3">
        {tabs.map((tab, index) => {
          const isActive = index === safeIndex;
          return (
            <button
              key={`${tab.props.label}-${index}`}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive ? "bg-ink text-sand" : "bg-white text-moss hover:bg-ink/5"
              }`}
              onClick={() => setActiveIndex(index)}
              type="button"
            >
              {tab.props.label}
            </button>
          );
        })}
      </div>
      <div className="px-5 py-5">{tabs[safeIndex]}</div>
    </div>
  );
}
