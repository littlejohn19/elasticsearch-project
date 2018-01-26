export default {
  port: 3000,
  es: {
    index: 'myindex',
    options: {
      host: 'http://localhost:9200'
    }
  },
  homePage: 'https://pl.wikipedia.org',
  crawlObject: {
    name: 'Religioznawstwo',
    url: 'https://pl.wikipedia.org/wiki/Kategoria:Religioznawstwo'
  }
}
