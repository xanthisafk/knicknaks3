/** Encode Float32 PCM audio into a 16-bit WAV ArrayBuffer. */
export function encodeWAV(samples: Float32Array, sampleRate: number): ArrayBuffer {
    const buf = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buf);

    const writeStr = (offset: number, str: string) => {
        for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
    };

    writeStr(0, "RIFF");
    view.setUint32(4, 36 + samples.length * 2, true);
    writeStr(8, "WAVE");
    writeStr(12, "fmt ");
    view.setUint32(16, 16, true);     // chunk size
    view.setUint16(20, 1, true);      // PCM
    view.setUint16(22, 1, true);      // mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeStr(36, "data");
    view.setUint32(40, samples.length * 2, true);

    for (let i = 0, offset = 44; i < samples.length; i++, offset += 2) {
        const clamped = Math.max(-1, Math.min(1, samples[i]));
        view.setInt16(offset, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true);
    }

    return buf;
}

/** Decode an audio blob URL into normalised RMS peak values for waveform display. */
export async function decodeWaveformPeaks(src: string, barCount: number): Promise<number[]> {
    const res = await fetch(src);
    const arrayBuf = await res.arrayBuffer();
    const ctx = new AudioContext();
    const audioBuf = await ctx.decodeAudioData(arrayBuf);
    await ctx.close();

    const raw = audioBuf.getChannelData(0);
    const blockSize = Math.floor(raw.length / barCount);
    const peaks: number[] = [];

    for (let i = 0; i < barCount; i++) {
        let sum = 0;
        const start = i * blockSize;
        for (let j = 0; j < blockSize; j++) sum += raw[start + j] ** 2;
        peaks.push(Math.sqrt(sum / blockSize));
    }

    const max = Math.max(...peaks, 1e-6);
    return peaks.map(p => Math.max(0.05, p / max));
}