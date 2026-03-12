export interface FileSignature {
    mime: string;
    ext: string;
    match: (b: Uint8Array) => boolean;
}

export const SIGNATURES: FileSignature[] = [
    {
        mime: "image/jpeg", ext: "jpg",
        match: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
    },
    {
        mime: "image/png", ext: "png",
        match: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
    },
    {
        mime: "image/gif", ext: "gif",
        match: (b) => b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46,
    },
    {
        mime: "image/webp", ext: "webp",
        match: (b) => b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46
            && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50,
    },
    {
        mime: "image/tiff", ext: "tif",
        match: (b) => (b[0] === 0x49 && b[1] === 0x49 && b[2] === 0x2a && b[3] === 0x00)
            || (b[0] === 0x4d && b[1] === 0x4d && b[2] === 0x00 && b[3] === 0x2a),
    },
    {
        mime: "image/bmp", ext: "bmp",
        match: (b) => b[0] === 0x42 && b[1] === 0x4d,
    },
    {
        mime: "image/heic", ext: "heic",
        match: (b) => {
            if (b.length < 12) return false;
            const ftyp = String.fromCharCode(b[4], b[5], b[6], b[7]);
            const brand = String.fromCharCode(b[8], b[9], b[10], b[11]);
            return ftyp === "ftyp" && ["heic", "heix", "mif1", "msf1", "hevc", "hevx"].includes(brand);
        },
    },
    {
        mime: "image/avif", ext: "avif",
        match: (b) => {
            if (b.length < 12) return false;
            const ftyp = String.fromCharCode(b[4], b[5], b[6], b[7]);
            const brand = String.fromCharCode(b[8], b[9], b[10], b[11]);
            return ftyp === "ftyp" && ["avif", "avis"].includes(brand);
        },
    },
];

export interface IntegrityResult {
    ok: boolean;
    detectedMime: string | null;
    detectedExt: string | null;
    claimedMime: string;
    claimedExt: string;
    issues: string[];
    notes: string[];
}

export const FIELD_SECTIONS: { section: string; icon: string; keys: string[] }[] = [
    {
        section: "File",
        icon: "📄",
        keys: [
            "FileSize", "FileType", "MIMEType",
            "ImageWidth", "ImageHeight",
            "BitDepth", "ColorType", "Compression", "Filter", "Interlace",
            "PixelsPerUnitX", "PixelsPerUnitY", "PixelUnits",
            "ColorComponents", "BitsPerSample", "EncodingProcess",
        ],
    },
    {
        section: "Camera",
        icon: "📷",
        keys: [
            "Make", "Model", "LensModel", "LensMake", "LensInfo",
            "BodySerialNumber", "SerialNumber", "CameraOwnerName", "Software",
        ],
    },
    {
        section: "Settings",
        icon: "⚙️",
        keys: [
            "ExposureTime", "FNumber", "ISO", "ISOSpeedRatings",
            "ExposureProgram", "ExposureMode", "ExposureBiasValue",
            "ShutterSpeedValue", "ApertureValue", "MaxApertureValue",
            "MeteringMode", "Flash", "FocalLength", "FocalLengthIn35mmFormat",
            "WhiteBalance", "DigitalZoomRatio", "SceneCaptureType",
            "Contrast", "Saturation", "Sharpness", "GainControl",
            "SensingMethod", "SubjectDistance", "SubjectDistanceRange",
            "BrightnessValue", "LightSource",
        ],
    },
    {
        section: "Date & Time",
        icon: "🕐",
        keys: [
            "DateTimeOriginal", "CreateDate", "ModifyDate", "DateTime",
            "OffsetTime", "OffsetTimeOriginal", "SubSecTimeOriginal",
            "GPSTimeStamp", "GPSDateStamp",
            "date", "DateCreated", "MetadataDate",
        ],
    },
    {
        section: "Image",
        icon: "🖼️",
        keys: [
            "ImageDescription", "Orientation", "XResolution", "YResolution", "ResolutionUnit",
            "ColorSpace", "YCbCrPositioning", "FlashpixVersion",
            "ExifImageWidth", "ExifImageHeight",
            "ComponentsConfiguration", "CompressedBitsPerPixel",
        ],
    },
    {
        section: "Creator & Rights",
        icon: "✍️",
        keys: [
            "Artist", "Copyright",
            "creator", "Creator", "rights", "Rights",
            "publisher", "Publisher", "title", "Title",
            "description", "Description", "subject", "Subject",
            "format", "Format", "identifier", "Identifier",
            "source", "Source", "language", "Language",
            "UsageTerms", "WebStatement", "Marked", "LicenseUrl",
            "CreatorTool", "Label", "Rating",
            "XMPToolkit",
            "ObjectName", "Caption", "CaptionAbstract",
            "Byline", "BylineTitle", "Credit",
            "CopyrightNotice", "Contact",
            "Keywords", "Category", "SupplementalCategories",
            "Headline", "SpecialInstructions",
            "City", "Province", "CountryName", "CountryCode",
        ],
    },
    {
        section: "GPS",
        icon: "📍",
        keys: [
            "GPSLatitude", "GPSLatitudeRef", "GPSLongitude", "GPSLongitudeRef",
            "GPSAltitude", "GPSAltitudeRef", "GPSSpeed", "GPSSpeedRef",
            "GPSTrack", "GPSTrackRef", "GPSImgDirection", "GPSImgDirectionRef",
            "GPSMapDatum", "GPSSatellites", "GPSDOP", "GPSMeasureMode",
            "GPSStatus", "GPSProcessingMethod",
            // exifr translated decimal keys
            "latitude", "longitude",
        ],
    },
    {
        section: "Advanced",
        icon: "🔬",
        keys: [
            "ExifVersion", "InteropIndex",
            "CFAPattern", "CustomRendered", "FileSource", "SceneType",
            "FocalPlaneXResolution", "FocalPlaneYResolution", "FocalPlaneResolutionUnit",
            "ExposureIndex", "SubjectArea", "UserComment", "ImageUniqueID",
        ],
    },
    { section: "Other", icon: "🗂️", keys: [] },
];

export const ALL_KNOWN_KEYS = new Set(FIELD_SECTIONS.flatMap((s) => s.keys));