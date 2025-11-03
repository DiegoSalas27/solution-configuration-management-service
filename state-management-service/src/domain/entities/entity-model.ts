/**
 * Utility class that is inherited by all domain models to map data coming from the database to entity models.
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Entity {
  private static toCamelCase(str: string) {
    return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
  }

  protected static toCamelCaseKeys<T = any>(obj: Record<string, any>): T {
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [this.toCamelCase(k), v])) as T
  }
}
