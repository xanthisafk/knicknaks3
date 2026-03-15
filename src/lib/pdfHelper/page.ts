export async function renderPageToDataUrl(
    pdfDoc: Awaited<ReturnType<typeof import("pdfjs-dist")["getDocument"]>["promise"]>,
    pageIndex: number,
    scale = 1.5
): Promise<{ dataUrl: string; width: number; height: number }> {
    const page = await pdfDoc.getPage(pageIndex + 1);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d")!;
    await page.render({ canvasContext: ctx as CanvasRenderingContext2D, canvas, viewport }).promise;
    return {
        dataUrl: canvas.toDataURL("image/png"),
        width: viewport.width,
        height: viewport.height,
    };
}