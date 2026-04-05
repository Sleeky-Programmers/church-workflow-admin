import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';

type PasswordInputProps = Omit<React.ComponentProps<typeof Input>, 'type' | 'rightIcon'>;

export function PasswordInput(props: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <Input
      type={show ? 'text' : 'password'}
      rightIcon={
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setShow(!show)}
          className="" 
        >
          {show ? <EyeOff /> : <Eye />}
        </Button>
      }
      {...props}
    />
  );
}