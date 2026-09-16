/**
 * Builds a deterministic email from a person's name.
 * "João Silva" -> "joao.silva@csp.tech"
 */
export function emailFromName(name: string): string {
  const slug = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.+|\.+$/g, '');

  return `${slug || 'usuario'}@csp.tech`;
}
