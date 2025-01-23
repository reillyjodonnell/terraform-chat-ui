import MonacoEditor from "@monaco-editor/react";
import React, { useEffect, useRef, useState } from "react";

import { darkTheme } from "./themes";
import "./styles.css";

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  setEditorInstance: any;
  language?: string;
  theme?: "dark" | "light";
  highlightPattern?: RegExp;
  height?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  setEditorInstance,
  language = "hcl",
  theme = "dark",
  highlightPattern,
  height = "90vh",
}) => {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const [decorations, setDecorations] = useState<string[]>([]);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    monaco.editor.defineTheme("darkTheme", darkTheme);
    monaco.editor.setTheme("darkTheme");
    editorRef.current = editor;
    monacoRef.current = monaco;
    setEditorInstance(editor);

    if (highlightPattern) {
      highlightCode(editor, highlightPattern);
    }
  };

  useEffect(() => {
    if (monacoRef.current) {
      monacoRef.current.editor.setTheme(
        theme === "dark" ? "darkTheme" : "lightTheme",
      );
    }
  }, [theme]);

  useEffect(() => {
    if (editorRef.current && highlightPattern) {
      highlightCode(editorRef.current, highlightPattern);
    }
  }, [highlightPattern]);

  const highlightCode = (editor: any, pattern: RegExp) => {
    const model = editor.getModel();
    if (!model) return;

    // Clear existing decorations
    editor.deltaDecorations(decorations, []);

    const matches = model.findMatches(
      pattern.source,
      true,
      true,
      false,
      null,
      true,
    );
    const newDecorations = matches.map((match: any) => ({
      range: match.range,
      options: { linesDecorationsClassName: "highlight-line-number" },
    }));

    // Apply new decorations
    const newDecorationIds = editor.deltaDecorations([], newDecorations);
    setDecorations(newDecorationIds);
  };

  return (
    <>
      <MonacoEditor
        height={height}
        language={language}
        value={value}
        onChange={onChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: "off",
          wrappingIndent: "same",
          wrappingStrategy: "advanced",
          automaticLayout: true,
          fontSize: 14,
          fontFamily: "Fira Code",
          lineNumbers: "on",
          lineNumbersMinChars: 3,
          glyphMargin: true,
          contextmenu: true,
          renderLineHighlight: "none",
          scrollbar: {
            vertical: "auto",
            horizontal: "auto",
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
            useShadows: false,
            verticalHasArrows: false,
            horizontalHasArrows: false,
            arrowSize: 30,
          },
        }}
      />
    </>
  );
};

export { CodeEditor };
