import { Suspense, useEffect, useState, type ComponentType } from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import { Panel } from "@/components/layout/Layout";
import type { ToolDefinition } from "@/tools/_types";
import { getToolBySlug } from "@/tools/_registry";

interface ToolWrapperProps {
  tool: ToolDefinition;
}

// Loading skeleton
function ToolLoading({ name }: { name: string }) {
  return (
    <Panel className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="w-8 h-8 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text(--text-secondary)">Loading {name}...</p>
    </Panel>
  );
}

// Lazy component loader
function LazyToolComponent({ tool }: { tool: ToolDefinition }) {
  const [Component, setComponent] = useState<ComponentType | null>(null);

  useEffect(() => {
    let mounted = true;
    
    // On the client, tool.component might be undefined because it was serialized by Astro.
    // We recover the "real" tool definition from the registry.
    const actualTool = typeof tool.component === 'function' ? tool : getToolBySlug(tool.slug);
    
    if (actualTool && typeof actualTool.component === 'function') {
      actualTool.component().then((mod) => {
        if (mounted) setComponent(() => mod.default);
      });
    } else {
      console.error(`[ToolWrapper] Could not find component for tool: ${tool.slug}`);
    }

    return () => { mounted = false; };
  }, [tool]);

  if (!Component) return <ToolLoading name={tool.name} />;
  return <Component />;
}

export function ToolWrapper({ tool }: ToolWrapperProps) {

  useEffect(() => {
    // Recover functions lost during serialization
    const actualTool = typeof tool.component === 'function' ? tool : getToolBySlug(tool.slug);
    
    actualTool?.onMount?.();
    return () => { actualTool?.onUnmount?.(); };
  }, [tool]);

  return (
    <ErrorBoundary toolName={tool.name}>
      <Suspense fallback={<ToolLoading name={tool.name} />}>
        <div className="tool-container">
          <LazyToolComponent tool={tool} />
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}
