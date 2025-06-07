export default function parseMarkup(markup: string): string {
    let html = markup;

    // It doesn't work if it's set directly to h1, h2 or h3 so this is a workaround
    html = html.replace(
      /^### (.+)$/gm,
      '<h3 style="font-size: 1.25rem; font-weight: 500; margin-bottom: 0.5rem;">$1</h3>'
    );
    html = html.replace(
      /^## (.+)$/gm,
      '<h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem;">$1</h2>'
    );
    html = html.replace(
      /^# (.+)$/gm,
      '<h1 style="font-size: 2rem; font-weight: 700; margin-bottom: 1rem;">$1</h1>'
    );

    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/__(.*?)__/g, "<em>$1</em>");
    html = html.replace(
      /\[(.*?)\]\((https?:\/\/[^\s]+)\)/g,
      '<a class="text-primary hover:text-primary-hover underline" href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );
    html = html.replace(/\n/g, "<br>");

    return html;
}