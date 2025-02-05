import { AuthorizedFetcher } from '@/app/lib/authorized-fetch-lib';
import { ErrorResponseDto } from '@/app/lib/global-backend-api-response';

export interface LoginResponseDTO {
  accessToken: string;
  refreshToken: string;
}

export async function POST(req: Request) {
  const { email, password, rememberMe } = await req.json();

  const response = await fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      remote_addr: '100.250.240.160',
    },
    body: JSON.stringify({
      email,
      password,
      rememberMe,
    }),
  });
  const result = (await response.json()) as LoginResponseDTO | ErrorResponseDto;

  if (!('error' in result)) {
    await AuthorizedFetcher.assignTokens(result);
  }

  return new Response(JSON.stringify(result), { status: response.status });
}
