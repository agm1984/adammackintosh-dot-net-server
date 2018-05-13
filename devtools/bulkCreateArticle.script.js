const { GraphQLClient } = require('graphql-request')
const faker = require('faker')

// CONFIG
const GRAPHQL_ENDPOINT = 'http://localhost:8080/graphql'
const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZXJzb24iOiJhZTAzNTY4MmI1OGY0ZjA3ODExNzFlYjRiMTBkMTY5OSIsImlhdCI6MTUxNjM0MjY2OCwiZXhwIjoxNTQ3OTAwMjY4fQ.Q730B3zieidh7Zd8poQlrZMa0qVAoBKnUDyhBZZTjX0'
const NUMBER_TO_CREATE = 50
const authors = [
  '7cc9d4e8e1dd4ff9a770acd5cbba418b',
  '07de908cd05a4ffa9c77e8f3a8aede9a',
  'cdcb85eabec14cd48c7579e8ab1feeb7',
  '58f1c711ce6445dbb799398dab885940',
  'dee6d3c12c0a4f61bcf214e6eb3e070e',
  'a6bbdf950ebd4fbd88c0db9273d52d7b',
  'fe4b5cfd4a304ab5b92b25bc29f7b274',
  '5a3bdd9834ad4b4d800fb57456531f3b',
  '03323810e11e413e98b936bb62d7d1ac',
  'cc361c7d1b7441f3970979c461c4c44a',
  '552353cf4df34ea1b8f1085cbd6dad7c',
  'b1c1ce6898ff405a91a21f9bce599342',
  'b435c3cbf7714e0c8395f295e03cf94b',
  '9e6f56e01cdb4d428317b3cacb49c556',
  '747e87dcb8b742a285df1ac927ed6782',
  '7ed5efab4e2a44069cfeedfd18e6996e',
  '894717c271054d0c9038b97529056dd6',
]
const client = new GraphQLClient(GRAPHQL_ENDPOINT, {
  headers: {
    Authorization: JWT,
  },
})
const rand = (min, max) => Math.floor(Math.random() * ((max - min) + 1)) + min
const generateStatus = {
  0: 'Active',
  1: 'Inactive',
  2: 'Draft',
  3: 'Active',
  4: 'Active',
}
const pickAuthorFromList = authorList => authorList[rand(0, authorList.length)]
const generateTag = () => {
  const tag = {
    0: faker.hacker.adjective(),
    1: faker.hacker.noun(),
    2: faker.hacker.verb(),
    3: faker.hacker.ingverb(),
    4: faker.hacker.abbreviation(),
  }
  return tag[rand(0, 4)]
}
const generateArticle = (cursor) => {
  console.log(`Generating Article #${cursor + 1}`)
  const mutation = `mutation {
    addArticle(
      article_status: "${generateStatus[rand(0, 4)]}",
      article_authorSerialNumber: "${pickAuthorFromList(authors)}",
      article_title: "${faker.hacker.phrase()}",
      article_content: "<p>A test article is a version of space craft or related vehicle or equipment, built as a platform to perform testing. Test articles are built to the same specifications to replicate conditions and behaviors of flight ready versions. Test article version are also built without the certification and quality control steps taken with the versions intended for flight. Test articles are more complete than a boilerplate.Test articles can sometimes be upgraded to flight ready status. Of the 136 Space Shuttle external fuel tanks produced, one was retained as a test article. The contractor producing the tanks commented that that tank could be refurbished for flight use if necessary. The static test article for the Dream Chaser lifting-body spaceplane will become the atmospheric flight test vehicle in 2012 for drop tests. Test articles are often displayed in museums because of their accuracy. Museums may refurbish test articles to match more modern configurations. This was completed on the Hubble Space Telescope Structural Dynamic Test Vehicle on display at the National Air and Space Museum where this 1976 version of the vehicle was removed from display and upgraded in 1996 by the Smithsonian, Lockheed, and NASA to incorporate changes made on the on-mission version of the Hubble Space Telescope over several servicing missions.</p>",
      article_plainText: "A test article is a version of space craft or related vehicle or equipment, built as a platform to perform testing. Test articles are built to the same specifications to replicate conditions and behaviors of flight ready versions. Test article version are also built without the certification and quality control steps taken with the versions intended for flight. Test articles are more complete than a boilerplate.Test articles can sometimes be upgraded to flight ready status. Of the 136 Space Shuttle external fuel tanks produced, one was retained as a test article. The contractor producing the tanks commented that that tank could be refurbished for flight use if necessary. The static test article for the Dream Chaser lifting-body spaceplane will become the atmospheric flight test vehicle in 2012 for drop tests. Test articles are often displayed in museums because of their accuracy. Museums may refurbish test articles to match more modern configurations. This was completed on the Hubble Space Telescope Structural Dynamic Test Vehicle on display at the National Air and Space Museum where this 1976 version of the vehicle was removed from display and upgraded in 1996 by the Smithsonian, Lockheed, and NASA to incorporate changes made on the on-mission version of the Hubble Space Telescope over several servicing missions.",
      article_tags: "${generateTag()},${generateTag()},${generateTag()}"
    ) {
      article_title
      article_content
      article_plainText
      article_created
      article_status
      article_author {
        person_email
      }
      article_tags {
        tag_name
      }
    }
  }`
  return client.request(mutation).then(data => console.log(data))
}

// EXECUTE TEST
let cursor = 0
while (cursor < NUMBER_TO_CREATE) {
  generateArticle(cursor)
  cursor += 1
}
console.log('DONE.')
