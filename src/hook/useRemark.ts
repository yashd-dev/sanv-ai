import { useCallback, useState } from "react";
import rehypeReact, { type Options as RehypeReactOptions } from "rehype-react";
import remarkParse, { type Options as RemarkParseOptions } from "remark-parse";
import remarkRehype, {
  type Options as RemarkRehypeOptions,
} from "remark-rehype";
import { unified, type PluggableList } from "unified";

export interface UseRemarkOptions {
  remarkParseOptions?: RemarkParseOptions;
  remarkPlugins?: PluggableList;
  remarkRehypeOptions?: RemarkRehypeOptions;
  rehypePlugins?: PluggableList;
  rehypeReactOptions?: Pick<RehypeReactOptions, "components">;
  onError?: (err: Error) => void;
}

export default function useRemark({
  remarkParseOptions,
  remarkPlugins = [],
  remarkRehypeOptions,
  rehypePlugins = [],
  rehypeReactOptions,
  onError = () => {},
}: UseRemarkOptions = {}): [
  React.ReactElement | null,
  (source: string) => void
] {
  const [content, setContent] = useState<React.ReactElement | null>(null);

  const process = useCallback(
    (value: string) => {
      try {
        const file = unified()
          .use(remarkParse, remarkParseOptions)
          .use(remarkPlugins)
          .use(remarkRehype, remarkRehypeOptions)
          .use(rehypePlugins)
          .use(rehypeReact, rehypeReactOptions)
          .processSync(value);

        return file.result;
      } catch (error) {
        onError?.(error instanceof Error ? error : new Error(String(error)));
        return null;
      }
    },
    [
      onError,
      rehypePlugins,
      rehypeReactOptions,
      remarkParseOptions,
      remarkPlugins,
      remarkRehypeOptions,
    ]
  );

  const setMarkdown = useCallback(
    (source: string) => {
      setContent(process(source));
    },
    [process]
  );

  return [content, setMarkdown];
}
