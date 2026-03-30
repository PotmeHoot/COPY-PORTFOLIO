export interface ZipEntry {
  name: string;
  data: Uint8Array;
}

const LOCAL_FILE_HEADER = 0x04034b50;
const MAX_UNCOMPRESSED_BYTES = 25 * 1024 * 1024;

function readUint16(view: DataView, offset: number): number {
  return view.getUint16(offset, true);
}

function readUint32(view: DataView, offset: number): number {
  return view.getUint32(offset, true);
}

async function inflateDeflateRaw(data: Uint8Array): Promise<Uint8Array> {
  if (typeof DecompressionStream === "undefined") {
    throw new Error("Your browser does not support DecompressionStream for ZIP deflate entries.");
  }

  const stream = new Blob([data]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  const buffer = await new Response(stream).arrayBuffer();
  return new Uint8Array(buffer);
}

export async function readZipEntries(file: File): Promise<ZipEntry[]> {
  const buffer = await file.arrayBuffer();
  const view = new DataView(buffer);
  const decoder = new TextDecoder();
  const entries: ZipEntry[] = [];

  let offset = 0;
  while (offset + 30 <= view.byteLength) {
    const signature = readUint32(view, offset);
    if (signature !== LOCAL_FILE_HEADER) {
      break;
    }

    const flags = readUint16(view, offset + 6);
    const compressionMethod = readUint16(view, offset + 8);
    const compressedSize = readUint32(view, offset + 18);
    const uncompressedSize = readUint32(view, offset + 22);
    const fileNameLength = readUint16(view, offset + 26);
    const extraFieldLength = readUint16(view, offset + 28);

    if (flags & 0x01) {
      throw new Error("Encrypted ZIP entries are not supported.");
    }

    if (flags & 0x08) {
      throw new Error("ZIP entries with data descriptors are not supported. Please create a standard ZIP archive.");
    }

    const nameStart = offset + 30;
    const nameEnd = nameStart + fileNameLength;
    const extraEnd = nameEnd + extraFieldLength;
    const dataEnd = extraEnd + compressedSize;

    if (dataEnd > view.byteLength) {
      throw new Error("ZIP entry appears truncated or invalid.");
    }

    const rawName = new Uint8Array(buffer, nameStart, fileNameLength);
    const name = decoder.decode(rawName).replace(/\\/g, "/");

    const compressed = new Uint8Array(buffer, extraEnd, compressedSize);
    let data: Uint8Array;

    if (compressionMethod === 0) {
      data = compressed;
    } else if (compressionMethod === 8) {
      data = await inflateDeflateRaw(compressed);
    } else {
      throw new Error(`Unsupported ZIP compression method (${compressionMethod}) in ${name}.`);
    }

    if (uncompressedSize && data.byteLength !== uncompressedSize) {
      throw new Error(`ZIP entry size mismatch in ${name}.`);
    }

    if (data.byteLength > MAX_UNCOMPRESSED_BYTES) {
      throw new Error(`ZIP entry ${name} exceeds max allowed size.`);
    }

    // Skip directory markers
    if (!name.endsWith("/")) {
      entries.push({ name, data });
    }

    offset = dataEnd;
  }

  if (!entries.length) {
    throw new Error("No readable files were found in the ZIP archive.");
  }

  return entries;
}

export function decodeTextFile(data: Uint8Array): string {
  return new TextDecoder().decode(data);
}
