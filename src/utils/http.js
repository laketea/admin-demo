import { Http } from 'carno';
import { getServer } from 'utils/common';

const { domain, headerToken, content } = Http.middlewares;

const domainMiddleware = domain(getServer());
const contentMiddleware = content();
const headerMiddleware = headerToken(() => {
  return {
    'Content-Type': 'application/json'
  };
});

export default Http.create([domainMiddleware, contentMiddleware, headerMiddleware]);
