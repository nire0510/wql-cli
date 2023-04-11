import Response from './src/models/response';
import run from './src/modules/main';

export default function wql(query: string, options: Options): Promise<Response[]> {
  return run(query, options);
}
