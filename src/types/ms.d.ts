declare module 'ms' {
  declare function ms(value: number | string, options?: { long?: boolean }): string
  export = ms
}
