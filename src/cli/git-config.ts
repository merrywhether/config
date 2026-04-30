import { execSync } from 'node:child_process';

export function getGitUserName(): string {
  try {
    return execSync('git config user.name', { encoding: 'utf-8' }).trim();
  } catch {
    // git not available or not configured
    return '';
  }
}
