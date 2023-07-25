function convertHtmlToPlainText(html) {
    const parser = new DOMParser();
    const parsedDoc = parser.parseFromString(html, 'text/html');
    const body = parsedDoc.querySelector('body');

    return body.textContent;
}


export default convertHtmlToPlainText