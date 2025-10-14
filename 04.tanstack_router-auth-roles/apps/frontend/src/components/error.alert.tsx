type Props = {
  error: unknown;
  className?: string;
};

export function ErrorMessage({ error, className }: Props) {
  if (!error) return null;

  let message = 'An unknown error occurred';

  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  } else if (typeof error === 'object' && error !== null) {
    const maybeMsg = (error as any).message || (error as any).error?.message || (error as any).data?.message;
    if (typeof maybeMsg === 'string') message = maybeMsg;
  }

  return <p className={className ?? 'error'}>Error: {message}</p>;
}
