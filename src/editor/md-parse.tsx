import { TokensList } from "Tokens";
import { marked } from "marked";
import TurndownService, { Node } from "turndown";

const headerSizes = ["4xl", "3xl", "2xl", "xl", "lg", "base"]

function escape(htmlStr: string) {
    return htmlStr.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}
 
export function deEscape(htmlStr: string) {
    return htmlStr.replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, "\"")
        .replace(/&#39;/g, "'");
}

const renderer = {
    heading(text: string, level: number) {
        return `
            <h${level} class="text-${headerSizes[level]} font-bold mb-4">
            ${text}
            </h${level}>
        `;
    },
    codespan(text: string) {
        return `<span class="code">${escape(text)}</span>`;
    },
    code(text: string, infostring: string | undefined, escaped: boolean) {
        return `<pre class="codeblock break-all">${escape(text)}</pre>`;
    },
};


marked.use({ renderer });

export function mdparse(content: string): string {
    return marked.parse(content);
};

export function mdArray(content: string): TokensList {
    return marked.lexer(content);
};

const unparser = new TurndownService({
    codeBlockStyle: "fenced",
    emDelimiter: "*",
    strongDelimiter: "**",
    headingStyle: "atx",
    linkStyle: "inlined",
});

unparser.addRule("code", {
    filter: ["pre"],
    replacement: function (content: string) {
        return "\n```\n" + content + "\n```\n";
    }
});

// links are rendered as spans, we want to check (for every span)
// if className contains "link", and convert it to a markdown link if it is
unparser.addRule("link", {
    filter: function (node: Node, options: any) {
        return (
            node.nodeName === "SPAN" &&
            // @ts-ignore
            node.className.includes("link")
        );
    },
    replacement: function (content: string, node: Node, options: any) {
        // @ts-ignore
        const href = node.getAttribute("href");
        // @ts-ignore
        const title = node.getAttribute("aria-description") || content.split("\n")[0];
        return `[${content}](${href}) `;
    }
});

unparser.addRule("heading", {
    filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
    replacement: function (content: string, node: Node, options: any) {
        const level = Number(node.nodeName.charAt(1));
        return "\n" + "#".repeat(level) + " " + content + "\n";
    }
});

// in any element has a <span> with a className that includes "revert", we want to split up that element into three parts:
// the part before the span, the span (as a paragraph or span, depending on the element), and the part after the span
unparser.addRule("revert", {
    filter: function (node: Node, options: any) {
        // check if children contain a span with className "revert"
        const children = node.childNodes;
        if(node.parentElement?.nodeName == "ASIDE") return false;
        if(node.nodeName == "ASIDE") return false;
        
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            // @ts-ignore
            if (child.nodeName == "SPAN" && child.className.includes("revert")) {
                return true;
            }
        }
        return false;
    },
    replacement: function (content: string, node: Node, options: any) {
        // figure out how to parse the children
        // go over each child, if we encounter a span with className "revert", we want to split the element into three parts
        // use tagname to figure out how to make it into md ig

        return "reverted text";
    }
});

unparser.addRule("code", {
    filter: ["pre"],
    replacement: function (content: string, node: Node, options: any) {
        // @ts-ignore
        const className = node.firstChild.className || "";
        // @ts-ignore
        const language = node.getAttribute("aria-details") || "";
        // @ts-ignore
        return "\n\n" + "```" + language + "\n" + node.firstChild.textContent + "\n" + "```\n\n";
    }
});

unparser.remove("aside");

// TurndownService.prototype.escape = function (str: string) {
//     // escape everything except *, -, _, ~, and `
//     return str.replace(/([\\<!\[])/g, "\\$1");
// }

export function unparse(content: string): string {
    return unparser.turndown(content);
}