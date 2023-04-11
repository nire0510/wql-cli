export default function limit(data: KeyValue[], limit: number): KeyValue[] {
  if (limit > 0 && data.length > limit) {
    return data.slice(0, limit);
  }

  return data;
}
