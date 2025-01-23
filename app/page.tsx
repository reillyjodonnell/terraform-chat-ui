"use client";

import { useState, useEffect } from "react";
import {
  ChevronRight,
  FileCode,
  ThumbsDown,
  Paperclip,
  File,
  ChevronDown,
  RefreshCcw,
  ThumbsUp,
  ArrowUp,
  Copy,
  Check,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { CodeEditor } from "@/components/code-editor/code-editor";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";

interface TreeItemProps {
  name: string;
  children?: TreeItemProps[];
}

const TreeItem: React.FC<{
  item: TreeItemProps;
  depth?: number;
  parentPath?: string;
  onSelect: (path: string) => void;
}> = ({ item, depth = 0, parentPath = "", onSelect }) => {
  const [isOpen, setIsOpen] = useState(depth === 0);
  const hasChildren = item.children && item.children.length > 0;
  const fullPath = parentPath ? `${parentPath}/${item.name}` : item.name;

  return (
    <li className="my-1">
      <div
        className={cn(
          "flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-800 cursor-pointer",
          depth > 0 && "ml-4",
        )}
        onClick={() => {
          if (hasChildren) {
            setIsOpen(!isOpen);
          } else {
            onSelect(fullPath);
          }
        }}
      >
        {hasChildren ? (
          isOpen ? (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-500" />
          )
        ) : (
          <File className="h-4 w-4 text-gray-500" />
        )}
        <span className="text-sm">{item.name}</span>
      </div>
      {hasChildren && isOpen && (
        <ul>
          {item.children.map((child, index) => (
            <TreeItem
              key={index}
              item={child}
              depth={depth + 1}
              parentPath={fullPath}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default function ChatInterface() {
  const [activeFile, setActiveFile] = useState("/app/page.tsx");
  const [messages, setMessages] = useState([
    { role: "user", content: "Can you create a React component for a button?" },
    {
      role: "assistant",
      content: "Here's a simple React component for a button:",
    },
  ]);

  const handleFileSelect = (fileName: string) => {
    setActiveFile(fileName);
  };

  const renderFileTree = (items: TreeItemProps[]) => (
    <ul className="space-y-1">
      {items.map((item, index) => (
        <TreeItem key={index} item={item} onSelect={handleFileSelect} />
      ))}
    </ul>
  );

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white">
      <ResizablePanelGroup direction="horizontal">
        {/* Middle Chat Panel */}
        <ResizablePanel defaultSize={55} minSize={30}>
          <div className="flex h-full flex-col border-r border-[#1F1F1F]">
            <div className="flex items-center h-[48px] px-4 border-b border-[#1F1F1F]">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <span className="text-sm">/dashboard</span>
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-6">
                {messages.map((message, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div
                      className={cn(
                        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                        message.role === "user"
                          ? "bg-gradient-to-b from-purple-400 to-purple-500"
                          : "bg-blue-600",
                      )}
                    >
                      {message.role === "user" ? "U" : "v0"}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="prose prose-invert max-w-none">
                        <p className="text-sm leading-relaxed text-gray-300">
                          {message.content}
                        </p>
                      </div>
                      {message.role === "assistant" && (
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost" className="h-8">
                            <FileCode className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8">
                            <RefreshCcw className="h-4 w-4 mr-2" />
                            Retry
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8">
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8">
                            <ThumbsDown className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-4 border-t border-[#1F1F1F]">
              <div className="relative">
                <Input
                  placeholder="Ask a follow up..."
                  className="pr-20 bg-[#18181B] border-0"
                />
                <div className="absolute right-2 inset-y-0 flex items-center gap-2">
                  <Button size="icon" variant="ghost" className="h-6 w-6">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-6 w-6">
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500 text-center">
                v0 may make mistakes. Please use with discretion.
              </div>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle />

        {/* Right Panel */}
        <ResizablePanel defaultSize={25}>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={25}>
              <ScrollArea className="h-[calc(100vh-96px)]">
                <div className="p-2">{renderFileTree(fileTree)}</div>
              </ScrollArea>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={75}>
              <div className="flex items-center justify-between h-[48px] px-4 border-b border-[#1F1F1F]">
                <Breadcrumb path={activeFile} />
                <div className="flex items-center gap-2">
                  <CopyButton text={findCode(fileTree, activeFile) || ""} />
                  <Button size="sm" variant="ghost">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
              <ScrollArea className="h-[calc(100vh-96px)]">
                <CodeEditorWrapper
                  code={findCode(fileTree, activeFile) || ""}
                />
              </ScrollArea>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

function CodeEditorWrapper({ code }: { code: string }) {
  const [editorValue, setEditorValue] = useState(code);
  const [editorInstance, setEditorInstance] =
    useState<monacoEditor.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    setEditorValue(code);
  }, [code]);

  const handleEditorChange = (value: string | undefined) => {
    setEditorValue(value ?? "");
  };

  const handleUndo = () => {
    editorInstance?.trigger("custom-undo", "undo", null);
  };

  const handleRedo = () => {
    editorInstance?.trigger("custom-redo", "redo", null);
  };

  return (
    <CodeEditor
      value={editorValue}
      onChange={handleEditorChange}
      setEditorInstance={setEditorInstance}
    />
  );
}

const findCode = (items: TreeItemProps[], path: string): string | undefined => {
  const pathParts = path.split("/");
  let current = items;
  let currentPath = "";

  for (const part of pathParts) {
    currentPath = currentPath ? `${currentPath}/${part}` : part;
    const item = current.find((i) => i.name === part);

    if (!item) return undefined;
    if ("code" in item && currentPath === path) return item.code;
    if (item.children) current = item.children;
  }

  return undefined;
};

const fileTree: TreeItemProps[] = [
  {
    name: "environments",
    children: [
      {
        name: "dev",
        children: [
          {
            name: "main.tf",
            code: `module "vpc" {
  source = "../../modules/vpc"
  environment = "dev"
  cidr_block = "10.0.0.0/16"
}`,
          },
          {
            name: "variables.tf",
            code: `variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-west-2"
}`,
          },
        ],
      },
      {
        name: "prod",
        children: [
          {
            name: "main.tf",
            code: `module "vpc" {
  source = "../../modules/vpc"
  environment = "prod"
  cidr_block = "172.16.0.0/16"
}`,
          },
        ],
      },
    ],
  },
  {
    name: "modules",
    children: [
      {
        name: "vpc",
        children: [
          {
            name: "main.tf",
            code: `resource "aws_vpc" "main" {
  cidr_block = var.cidr_block
  tags = {
    Name = "\${var.environment}-vpc"
  }
}`,
          },
          {
            name: "variables.tf",
            code: `variable "environment" {
  type = string
}

variable "cidr_block" {
  type = string
}`,
          },
          {
            name: "outputs.tf",
            code: `output "vpc_id" {
  value = aws_vpc.main.id
}`,
          },
        ],
      },
    ],
  },
  {
    name: "provider.tf",
    code: `provider "aws" {
  region = var.aws_region
}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}`,
  },
];

function CopyButton({ text }: { text: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Button size="sm" variant="ghost" onClick={handleCopy}>
      {isCopied ? (
        <Check className="h-4 w-4 mr-2 text-green-500" />
      ) : (
        <Copy className="h-4 w-4 mr-2" />
      )}
      {isCopied ? "Copied!" : "Copy"}
    </Button>
  );
}
