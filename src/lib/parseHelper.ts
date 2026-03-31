// CSV ///////////////////////////
export interface CsvParseOptions {
    header: boolean;
    dynamicTyping: boolean;
    skipEmptyLines: boolean;
    metadata: boolean;
    delimiter: string;
}

export const DEFAULT_CSV_PARSE_OPTIONS: CsvParseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    metadata: false,
    delimiter: ",",
};

// YAML ///////////////////////////
export interface YamlParseOptions {

}

export const DEFAULT_YAML_PARSE_OPTIONS: YamlParseOptions = {

};