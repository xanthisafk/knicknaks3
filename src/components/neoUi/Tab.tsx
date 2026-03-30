import { cn } from "@/lib";
import { useEffect, useRef, useState } from "react";
import { Label } from "../ui";

export interface SlidingTabBarProps {
    tabs: { label: string; value: string }[];
    activeTab?: number;
    label?: string;
    onValueChange?: (value: string) => void;
}

export const SlidingTabBar = ({ tabs, activeTab = 0, label, onValueChange }: SlidingTabBarProps) => {
    const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
    const [activeTabIndex, setActiveTabIndex] = useState<number>(activeTab);
    const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0);
    const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);

    useEffect(() => {
        setActiveTabIndex(activeTab);
    }, [activeTab]);

    useEffect(() => {
        const currentTab = tabsRef.current[activeTabIndex];
        if (!currentTab) return;

        setTabUnderlineLeft(currentTab.offsetLeft);
        setTabUnderlineWidth(currentTab.clientWidth);
    }, [activeTabIndex]);

    const handleTabClick = (index: number, value: string) => {
        setActiveTabIndex(index);
        onValueChange?.(value);
    };

    return (
        <>
            {label && <Label className="max-h-2">{label}</Label>}
            <div className="flew-row relative mx-auto flex h-12 rounded-md bg-(--surface-secondary) px-1 backdrop-blur-xs border border-(--border-default)">

                <span
                    className="absolute bottom-0 top-0 -z-10 flex overflow-hidden rounded-sm py-1 transition-all duration-300"
                    style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}
                >
                    <span className="h-full w-full rounded-sm bg-(--surface-elevated) shadow-sm" />
                </span>
                {tabs.map((tab, index) => {
                    const isActive = activeTabIndex === index;

                    return (
                        <button
                            key={tab.value}
                            ref={(el) => { tabsRef.current[index] = el }}
                            className={cn(
                                "my-auto flex-1 cursor-pointer select-none rounded-full px-2 text-center",
                                "text-sm font-medium truncate",
                                !isActive && "hover:text-(--text-primary)",
                                isActive && "text-primary-500"
                            )}
                            onClick={() => handleTabClick(index, tab.value)}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>
        </>
    );
};