export const parseInnerText = (element: HTMLElement): string => {
    // clone the element
    const clone = element.cloneNode(true) as HTMLElement;
    // remove all <aside> elements, along with their children
    const asides = clone.querySelectorAll('aside');
    asides.forEach(aside => aside.remove());
    
    // add a newline character between each block-level element
    const blockElements = clone.querySelectorAll('p, div, pre, blockquote, h1, h2, h3, h4, h5, h6, li, ol, ul');
    blockElements.forEach(blockElement => {
        if(blockElement.innerHTML) blockElement.innerHTML = blockElement.innerHTML + "\n\n";
    });

    // add a newline character after each list item
    const listItems = clone.querySelectorAll('li');
    listItems.forEach(listItem => {
        if(listItem.innerHTML) listItem.innerHTML = listItem.innerHTML + "\n";
    });

    const pItems = clone.querySelectorAll('p');
    pItems.forEach(p => {
        if(p.innerHTML) p.innerHTML = p.innerHTML + "\n";
    });

    return cleanNewlines(clone.innerText);
}

export const cleanNewlines = (text: string): string => {
    return text.replace(/(```[\s\S]*?```)|\n{3,}/g, (match, p1) => {
        if (p1) return match;
        return '\n\n';
    });
}