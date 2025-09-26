//@ts-nocheck

import { LucideIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { useEffect, useState } from "react";

export interface TabItem {
  value: string;
  label: string;
  icon: LucideIcon;
  content: React.ReactNode;
}

interface IconTabsProps {
  tabs: TabItem[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
  value?: string;
}

export function IconTabs({ tabs, defaultValue='', onChange, className = "" }: IconTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue || tabs[0].value);

  useEffect(() => {
    const handleDirtyChange = (e: any) => {};
    window.addEventListener("ssoTabDirtyChange", handleDirtyChange);
    return () => window.removeEventListener("ssoTabDirtyChange", handleDirtyChange);
  }, [activeTab]);

  useEffect(() => {
    setActiveTab(defaultValue)
  },[defaultValue])

  // Function to format label with conditional wrapping
  const formatLabel = (label: string) => {
    const words = label.split(' ');
    
       const getMediumScreenLayout = (words: string[]) => {
       
      if (words.length === 3 && words[0] === "General") {
        return (
          <>
            <span className="block leading-none mb-1">{words[0]}</span>
            <span className="block leading-none mb-1">{words[1]}</span>
            <span className="block leading-none">{words[2]}</span>
          </>
        );
      }
      // For other 3-word combinations
      if (words.length === 3) {
        return (
          <>
            <span className="block leading-none mb-1">{`${words[0]} ${words[1]}`}</span>
            <span className="block leading-none">{words[2]}</span>
          </>
        );
      }
      // For 2 words
      if (words.length === 2) {
        return (
          <>
            <span className="block leading-none mb-1">{words[0]}</span>
            <span className="block leading-none">{words[1]}</span>
          </>
        );
      }
      // For single word
      return <span className="block leading-none">{words.join(' ')}</span>;
    };

    return (
      <>
        {/* For screens larger than 1300px */}
        <span className="hidden xl:inline whitespace-nowrap">{label}</span>
        
        {/* For screens between 1100px and 1300px */}
        <span className="hidden lg:flex xl:hidden flex-col items-center justify-center text-center w-full">
          {getMediumScreenLayout(words)}
        </span>
        
        {/* For screens smaller than 1100px */}
        <span className="inline lg:hidden whitespace-nowrap">{label}</span>
      </>
    );
  };

  return (
    <Tabs className={`w-full ${className}`} value={activeTab}>
      <div className="px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 md:py-4">
        <TabsList
          className="h-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 rounded-lg bg-blue-100 p-2 gap-2"
          aria-label="Configuration sections"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isCurrentTab = tab.value === activeTab;
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="group relative w-full min-h-[48px] lg:min-h-[100px] xl:min-h-[48px] data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md data-[state=active]:font-bold
                         data-[state=active]:ring-1 data-[state=active]:ring-blue-200 data-[state=active]:ring-offset-0
                         bg-white/80 hover:bg-white hover:text-blue-900 hover:shadow-sm
                         text-blue-800 rounded-md px-3 py-2 transition-all"
                onClick={(e) => {
                  e.preventDefault();
                  if (isCurrentTab) return;
                  setActiveTab(tab.value);
                  if (onChange) onChange(tab.value);
                }}
              >
                <div className="flex items-center lg:flex-col xl:flex-row gap-2.5 h-full w-full justify-center">
                  <div className="flex-shrink-0 p-1.5 bg-blue-50 rounded data-[state=active]:bg-blue-100">
                    <Icon className="h-4 w-4 text-blue-600 data-[state=active]:text-blue-700" />
                  </div>
                  <div className="flex-1 text-left lg:text-center xl:text-left text-sm font-medium">
                    {formatLabel(tab.label)}
                  </div>
                </div>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </div>

      <div className="px-2 sm:px-4 md:px-6 pb-4 sm:pb-6">
        {tabs
          .filter((tab) => tab.value === activeTab)
          .map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-0">
              {tab.content}
            </TabsContent>
          ))}
      </div>
    </Tabs>
  );
}