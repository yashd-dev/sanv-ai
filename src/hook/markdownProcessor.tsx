// src/hooks/use-markdown-processor.tsx

// Custom Dialog component rendered with Radix.
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
// highlight.js syntax highlighting theme for the code blocks.
// Import all of the necessary packages.
import mermaid from "mermaid";
import React, {
  createElement,
  Fragment,
  useEffect,
  useState,
  ComponentPropsWithoutRef,
} from "react";
import rehypeShiki from "@shikijs/rehype";
import rehypeReact from "rehype-react";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import * as jsxRuntime from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { VFile } from "vfile";

export const useMarkdownProcessor = (content: string) => {
  const [mermaidInitialized, setMermaidInitialized] = useState(false);
  const [processedContent, setProcessedContent] =
    useState<React.ReactElement | null>(null);

  useEffect(() => {
    if (!mermaidInitialized) {
      mermaid.initialize({ startOnLoad: false, theme: "forest" });
      setMermaidInitialized(true);
    }
  }, [mermaidInitialized]);

  useEffect(() => {
    unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeShiki, {
        theme: "github-light",
      })
      .use(rehypeReact, {
        createElement,
        Fragment,
        jsx: jsxRuntime.jsx,
        jsxs: jsxRuntime.jsxs,
        components: {
          a: ({ href, children }: ComponentPropsWithoutRef<"a">) => (
            <a href={href} target="_blank" rel="noreferrer" className="...">
              {children}
            </a>
          ),
          h1: ({ children, id }: ComponentPropsWithoutRef<"h1">) => (
            <h1 className="..." id={id}>
              {children}
            </h1>
          ),
          h2: ({ children, id }: ComponentPropsWithoutRef<"h2">) => (
            <h2 className="..." id={id}>
              {children}
            </h2>
          ),
          h3: ({ children, id }: ComponentPropsWithoutRef<"h3">) => (
            <h3 className="..." id={id}>
              {children}
            </h3>
          ),
          h4: ({ children, id }: ComponentPropsWithoutRef<"h4">) => (
            <h4 className="..." id={id}>
              {children}
            </h4>
          ),
          h5: ({ children, id }: ComponentPropsWithoutRef<"h5">) => (
            <h5 className="..." id={id}>
              {children}
            </h5>
          ),
          h6: ({ children, id }: ComponentPropsWithoutRef<"h6">) => (
            <h6 className="..." id={id}>
              {children}
            </h6>
          ),
          p: ({ children }: ComponentPropsWithoutRef<"p">) => {
            return <p className="...">{children}</p>;
          },
          strong: ({ children }: ComponentPropsWithoutRef<"strong">) => (
            <strong className="...">{children}</strong>
          ),
          em: ({ children }: ComponentPropsWithoutRef<"em">) => (
            <em>{children}</em>
          ),
          pre: Pre,
          ul: ({ children }: ComponentPropsWithoutRef<"ul">) => (
            <ul className="...">{children}</ul>
          ),
          ol: ({ children }: ComponentPropsWithoutRef<"ol">) => (
            <ol className="...">{children}</ol>
          ),
          li: ({ children }: ComponentPropsWithoutRef<"li">) => (
            <li className="...">{children}</li>
          ),
          table: ({ children }: ComponentPropsWithoutRef<"table">) => (
            <div className="...">
              <table className="...">{children}</table>
            </div>
          ),
          thead: ({ children }: ComponentPropsWithoutRef<"thead">) => (
            <thead className="...">{children}</thead>
          ),
          th: ({ children }: ComponentPropsWithoutRef<"th">) => (
            <th className="...">{children}</th>
          ),
          td: ({ children }: ComponentPropsWithoutRef<"td">) => (
            <td className="...">{children}</td>
          ),
          blockquote: ({
            children,
          }: ComponentPropsWithoutRef<"blockquote">) => (
            <blockquote className="...">{children}</blockquote>
          ),
          code: CodeBlock,
        },
      })
      .process(content)
      .then((file: VFile) => {
        setProcessedContent(file.result as React.ReactElement);
      })
      .catch((error: Error) => {
        console.error("Error processing markdown:", error);
      });
  }, [content]);

  return processedContent;
};

const CodeBlock = ({
  children,
  className,
}: ComponentPropsWithoutRef<"code">) => {
  const [showMermaidPreview, setShowMermaidPreview] = useState(false);

  if (className) {
    const isMermaid = className.includes("language-mermaid");

    return (
      <>
        <code className={className}>{children}</code>
        {isMermaid && (
          <>
            <div className="mt-2">
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs bg-white/80 hover:bg-white"
                onClick={() => setShowMermaidPreview(true)}
              >
                Preview Diagram
              </Button>
            </div>
            <Dialog
              open={showMermaidPreview}
              onOpenChange={setShowMermaidPreview}
            >
              <DialogContent className="max-w-3xl">
                <DialogTitle>Mermaid diagram preview</DialogTitle>
                <Mermaid content={children?.toString() ?? ""} />
              </DialogContent>
            </Dialog>
          </>
        )}
      </>
    );
  }

  return (
    <code className="rounded px-1.5 py-0.5 text-sm text-black">{children}</code>
  );
};

// A custom component to render a Mermaid diagram given the string.
const Mermaid = ({ content }: { content: string }) => {
  const [diagram, setDiagram] = useState<string | boolean>(true);

  useEffect(() => {
    const render = async () => {
      // Generate a random ID for Mermaid to use.
      const id = `mermaid-svg-${Math.round(Math.random() * 10000000)}`;

      // Confirm the diagram is valid before rendering since it could be invalid
      // while streaming, or if the LLM "hallucinates" an invalid diagram.
      if (await mermaid.parse(content, { suppressErrors: true })) {
        const { svg } = await mermaid.render(id, content);
        setDiagram(svg);
      } else {
        setDiagram(false);
      }
    };
    render();
  }, [content]);

  if (diagram === true) {
    return <p className="...">Rendering diagram...</p>;
  } else if (diagram === false) {
    return <p className="...">Unable to render this diagram.</p>;
  } else {
    return <div dangerouslySetInnerHTML={{ __html: diagram ?? "" }} />;
  }
};

// Convert pre to a proper React component
const Pre: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (typeof children === "string") {
      navigator.clipboard.writeText(children);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <pre className="relative">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 rounded bg-gray-700 text-white hover:bg-gray-600"
      >
        {isCopied ? "Copied!" : "Copy"}
      </button>
      {children}
    </pre>
  );
};
