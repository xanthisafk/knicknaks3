import { useState, useCallback } from "react";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer-continued";
import { Badge, CopyButton, Label, ExpectContent, Textarea, WaitForContent } from "@/components/ui";
import { Panel } from "@/components/layout";
import { Container, Box } from "@/components/layout/Primitive";
import { useTheme } from "@/hooks/useTheme";

// Moved outside component — stable reference, no re-creation on render
function buildCopyText(left: string, right: string): string {
  const lines = left.split("\n");
  const rLines = right.split("\n");
  // delegate to the viewer's output isn't possible, so we just copy both sides
  return `--- Original\n${left}\n+++ Modified\n${right}`;
}

export default function TextDiffTool() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");

  // useCallback avoids new function refs on every render
  const handleLeft = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => setLeft(e.target.value), []);
  const handleRight = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => setRight(e.target.value), []);

  const { theme } = useTheme();

  const hasContent = left || right;

  return (
    <Container>
      <Container cols={2}>
        <Panel>
          <Textarea
            label="Original"
            value={left}
            onChange={handleLeft}
            handlePaste={setLeft}
            placeholder="Paste original text here..."
          />
        </Panel>
        <Panel>
          <Textarea
            label="Modified"
            value={right}
            onChange={handleRight}
            handlePaste={setRight}
            placeholder="Paste modified text here..."
          />
        </Panel>
      </Container>

      {hasContent ? (
        <Box>
          <Panel>
            {hasContent && (
              <div className="flex flex-row flex-wrap justify-between items-center mb-2">
                <Label>Diff</Label>
                <CopyButton text={buildCopyText(left, right)} />
              </div>
            )}
            <div className="w-full min-w-0 max-h-96 overflow-auto">
              <ReactDiffViewer
                oldValue={left}
                newValue={right}
                splitView={true}
                compareMethod={DiffMethod.WORDS}
                showDiffOnly={false}
                useDarkTheme={theme === "dark"}
              />
            </div>
          </Panel>
        </Box>
      ) : (
        <Box>
          <Panel>
            <ExpectContent text="Paste text in both panels to see the diff" emoji="✍️" />
          </Panel>
        </Box>
      )}
    </Container>
  );
}