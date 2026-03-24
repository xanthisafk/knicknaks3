import * as ort from "onnxruntime-web/wasm";

// Ensure WASM runs properly. 
// Uses JSDelivr for WASM files since providing them locally varies per build.
ort.env.wasm.wasmPaths = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.24.3/dist/";
ort.env.wasm.numThreads = 1;

const MODEL_URL = "https://huggingface.co/SmilingWolf/wd-v1-4-convnext-tagger-v2/resolve/main/model.onnx";
const TAGS_URL = "https://huggingface.co/SmilingWolf/wd-v1-4-convnext-tagger-v2/resolve/main/selected_tags.csv";
const CACHE_NAME = "knicknaks-ai-models";

let session: ort.InferenceSession | null = null;
let tagsData: { id: number; name: string; category: number }[] = [];

// Helper: Download with Progress and Cache
async function fetchWithProgress(url: string, onProgress: (pct: number) => void): Promise<ArrayBuffer> {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(url);
  if (cached) {
    onProgress(100);
    return cached.arrayBuffer();
  }

  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch: " + response.statusText);

  // Clone the response so we can put it in cache while we still read the original body
  const cacheResponse = response.clone();
  // We do NOT wait for the cache.put to finish, we do it asynchronously
  cache.put(url, cacheResponse).catch(console.error);

  const contentLength = response.headers.get('content-length');
  const total = contentLength ? parseInt(contentLength, 10) : 0;

  let loaded = 0;
  let chunks: Uint8Array[] = [];

  // Manual reading for progress tracking
  if (response.body) {
    const reader = response.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
        loaded += value.length;
        if (total > 0) {
          onProgress(Math.min(100, Math.round((loaded / total) * 100)));
        }
      }
    }
  }

  const blob = new Blob(chunks as BlobPart[]);
  return await blob.arrayBuffer();
}

// Parse CSV tags
function parseTags(csvText: string) {
  const lines = csvText.split("\n").filter(l => l.trim().length > 0);
  const parsed = [];
  // Skip header (tag_id,name,category,count)
  let idx = 0;
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i]!.split(",");
    if (parts.length >= 3) {
      parsed.push({
        id: idx++, // Actual index in the probabilities array
        name: parts[1]!,
        category: parseInt(parts[2]!, 10),
      });
    }
  }
  return parsed;
}

self.addEventListener("message", async (e) => {
  const { type, payload } = e.data;

  try {
    if (type === "CHECK_CACHE") {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(MODEL_URL);
      self.postMessage({ type: "CACHE_STATUS", cached: !!cached });
      return;
    }

    if (type === "INIT") {
      if (!session) {
        // Fetch Tags
        self.postMessage({ type: "PROGRESS", task: "Loading tags...", progress: 0 });
        const tagsBuf = await fetchWithProgress(TAGS_URL, (p) => {
          self.postMessage({ type: "PROGRESS", task: "Loading tags...", progress: p });
        });
        const tagsText = new TextDecoder().decode(tagsBuf);
        tagsData = parseTags(tagsText);

        // Fetch Model
        self.postMessage({ type: "PROGRESS", task: "Loading model (~388MB)...", progress: 0 });
        const modelBuf = await fetchWithProgress(MODEL_URL, (p) => {
          self.postMessage({ type: "PROGRESS", task: "Loading model (~388MB)...", progress: p });
        });

        self.postMessage({ type: "PROGRESS", task: "Initializing ONNX...", progress: 100 });
        session = await ort.InferenceSession.create(modelBuf, {
          executionProviders: ["wasm"], // WebAssembly ensures maximum compatibility
          graphOptimizationLevel: 'all'
        });
      }
      self.postMessage({ type: "READY" });
      return;
    }

    if (type === "RUN") {
      if (!session) throw new Error("Model not initialized");

      const { rgba, width, height } = payload;

      const floatData = new Float32Array(width * height * 3);
      for (let i = 0; i < width * height; i++) {
        // According to SmilingWolf repository, ConvNext V2 accepts BGR (standard OpenCV behavior in training script).
        floatData[i * 3 + 0] = rgba[i * 4 + 2]!; // B
        floatData[i * 3 + 1] = rgba[i * 4 + 1]!; // G
        floatData[i * 3 + 2] = rgba[i * 4 + 0]!; // R
      }

      const tensor = new ort.Tensor("float32", floatData, [1, height, width, 3]);

      const results = await session.run({ [session.inputNames[0]!]: tensor });
      const probs = results[session.outputNames[0]!]!.data as Float32Array;

      const resultsTags = [];
      for (let i = 0; i < tagsData.length; i++) {
        const prob = probs[i];
        if (prob && prob > 0.05) {
          resultsTags.push({
            name: tagsData[i]!.name,
            category: tagsData[i]!.category,
            prob: prob,
          });
        }
      }

      resultsTags.sort((a, b) => b.prob - a.prob);
      self.postMessage({ type: "RESULT", tags: resultsTags });
    }

  } catch (err: any) {
    self.postMessage({ type: "ERROR", error: err.message || err.toString() });
  }
});
