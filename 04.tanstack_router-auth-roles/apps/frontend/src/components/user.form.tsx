import { ROLE, type Role } from 'common/constants';
import { useState } from 'react';

type RoleValue = (typeof ROLE)[Role];

type CreateSubmit = { email: string; password: string };
type EditSubmit = { email: string; password: string; role: RoleValue };

type CreateProps<T = unknown> = {
  mode: 'create';
  initial: { email: string };
  onSubmit: (v: CreateSubmit) => Promise<T>;
  submitLabel: string;
};

type EditProps<T = unknown> = {
  mode: 'edit';
  initial: { email: string; role: RoleValue };
  onSubmit: (v: EditSubmit) => Promise<T>;
  submitLabel: string;
};

type Props<T = unknown> = CreateProps<T> | EditProps<T>;

export function UserForm<T>(props: Props<T>) {
  const isCreate = props.mode === 'create';
  const [email, setEmail] = useState(props.initial.email ?? '');
  const [role, setRole] = useState<RoleValue>(props.mode === 'edit' ? props.initial.role : ROLE.USER);
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreate) {
      await props.onSubmit({ email, password });
    } else {
      await props.onSubmit({ email, role, password });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <br />

      {isCreate ? (
        <p>
          Role: <strong>{role}</strong>
        </p>
      ) : (
        <label>
          Role
          <select value={role} onChange={(e) => setRole(e.target.value as RoleValue)} required>
            <option value={ROLE.ADMIN}>{ROLE.ADMIN}</option>
            <option value={ROLE.USER}>{ROLE.USER}</option>
          </select>
        </label>
      )}
      <br />

      <label>
        Password
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>
      <br />

      <button type="submit">{props.submitLabel}</button>
    </form>
  );
}
