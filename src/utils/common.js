import { servers as serverConfigs } from 'configs';

export function getServer(servers = serverConfigs) {
  return servers[process.env.NODE_ENV || localStorage.getItem('NODE_ENV') || 'dev'];
};
