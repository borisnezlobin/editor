export const parseInnerText = (element: HTMLElement): string => {
    // clone the element
    const clone = element.cloneNode(true) as HTMLElement;
    // remove all <aside> elements, along with their children
    const asides = clone.querySelectorAll('aside');
    asides.forEach(aside => aside.remove());
    clone.innerHTML = clone.innerHTML.replaceAll(/<span[^>]*>(.*?)<\/span>/g, '$1');
    
    clone.innerHTML = clone.innerHTML.replaceAll("</", "\n</");

    return cleanNewlines(clone.innerText);
}

export const cleanNewlines = (text: string): string => {
    return text.replace(/(```[\s\S]*?```)|\n{3,}/g, (match, p1) => {
        if (p1) return match;
        return '\n\n';
    });
}