export type OptionalParamObjectType = Record<string, unknown> & {context?: string};

export type LogMethod = (
    message: unknown | Error,
    ...optionalParams: (unknown | Error | OptionalParamObjectType)[]
) => void;

export type ContextCompatible =
    | string
    | {name: string; [key: string | number | symbol]: unknown};

export interface LoggerPort {
    loggerContext: string;
    context: Map<string, unknown>;

    setContext: (context: ContextCompatible) => void;
    child: (child?: ContextCompatible) => LoggerPort;

    log: LogMethod;
    error: LogMethod;
    warn: LogMethod;
    debug: LogMethod;
    info: LogMethod;
    verbose: LogMethod;
}
