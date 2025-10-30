// lib/isSuperAdmin.js
export const isSuperAdmin = (user) =>
  !!user?.publicMetadata?.is_super_admin;
