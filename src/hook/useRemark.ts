import { useCallback, useState } from 'react'
import * as jsxRuntime from 'react/jsx-runtime'
import rehypeReact, { type Options as RehypeReactOptions } from 'rehype-react'
import remarkParse, { type Options as RemarkParseOptions } from 'remark-parse'
import remarkRehype, { type Options as RemarkRehypeOptions } from 'remark-rehype'
import { unified, type PluggableList } from 'unified'

export interface UseRemarkOptions {
    remarkParseOptions?: RemarkParseOptions
    remarkPlugins?: PluggableList
    remarkRehypeOptions?: RemarkRehypeOptions
    rehypePlugins?: PluggableList
    rehypeReactOptions?: Pick<RehypeReactOptions, 'components'>
    onError?: (err: Error) => void
}

export default function useRemark({
    remarkParseOptions,
    remarkPlugins = [],
    remarkRehypeOptions,
    rehypePlugins = [],
    rehypeReactOptions,
    onError = () => {},
}: UseRemarkOptions = {}): [React.ReactElement | null, (source: string) => void] {
    const [content, setContent] = useState<React.ReactElement | null>(null)

    const setMarkdown = useCallback((source: string) => {
        unified()
            .use(remarkParse, remarkParseOptions)        // parse markdown
            .use(remarkPlugins)
            .use(remarkRehype, remarkRehypeOptions)      // markdown to html
            .use(rehypePlugins)
            .use(rehypeReact, {                          // html to react elements
                ...rehypeReactOptions,
                Fragment: jsxRuntime.Fragment,
                jsx: jsxRuntime.jsx,
                jsxs: jsxRuntime.jsxs,
            } satisfies RehypeReactOptions)
            .process(source)
            .then(vfile => setContent(vfile.result))     // get react elements
            .catch(onError)
    }, [])

    return [content, setMarkdown]
}