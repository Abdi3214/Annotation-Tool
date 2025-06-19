// app/home/users/updateUser/page.js

import UpdateUserClient from "./";

export default function Page({ searchParams }) {
  // Destructure with defaults
  const {
    id = "",
    name: initialName = "",
    email: initialEmail = "",
    password: initialPassword = "",
    type: initialType = "",
  } = searchParams;

  return (
    <UpdateUserClient
      id={id}
      initialName={initialName}
      initialEmail={initialEmail}
      initialPassword={initialPassword}
      initialType={initialType}
    />
  );
}
