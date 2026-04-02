export function downloadBlob(blob: Blob, filename: string) {
    const a = document.createElement("a");
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

export function download(content: string, filename: string) {
    const blob = new Blob([content]);
    downloadBlob(blob, filename);
}

export function downloadAsDataURL(dataURL: string, filename: string) {
    const a = document.createElement("a");
    a.href = dataURL;
    a.download = filename;
    a.click();
}

export function normalizeFileName(filename: string, extension: string) {
    let name = filename.trim();
    if (!name.endsWith(extension)) name += extension;
    return name;
}

export function getRawFileSize(content: string) {
    const blob = new Blob([content]);
    return blob.size;
}

export function getFileSize(content: string) {
    return normalizeFileSize(getRawFileSize(content));
}

export function normalizeFileSize(size: number) {
    if (size < 1024) return `${size} bytes`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}