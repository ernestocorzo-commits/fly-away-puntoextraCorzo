import type { ReactNode } from 'react';

interface AlertProps {
  type: 'error' | 'success';
  children: ReactNode;
}

export default function Alert({ type, children }: AlertProps) {
  return (
    <div className={`alert alert-${type}`} role={type === 'error' ? 'alert' : 'status'}>
      {children}
    </div>
  );
}