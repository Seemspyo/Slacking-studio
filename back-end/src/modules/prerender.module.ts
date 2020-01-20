import prerender from 'prerender-node';

prerender.set('prerenderToken', process.env.PRERENDER_TOKEN);
prerender.crawlerUserAgents = [ ...prerender.crawlerUserAgents, 'yeti', 'daum', 'daumoa', 'duckduckbot', 'nateon' ]

export default prerender;