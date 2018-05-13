const { GraphQLClient } = require('graphql-request')
const faker = require('faker')

// CONFIG
const GRAPHQL_ENDPOINT = 'http://localhost:8080/graphql'
const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZXJzb24iOiJhZTAzNTY4MmI1OGY0ZjA3ODExNzFlYjRiMTBkMTY5OSIsImlhdCI6MTUxNjM0MjY2OCwiZXhwIjoxNTQ3OTAwMjY4fQ.Q730B3zieidh7Zd8poQlrZMa0qVAoBKnUDyhBZZTjX0'
const NUMBER_TO_CREATE = 300
const client = new GraphQLClient(GRAPHQL_ENDPOINT, {
  headers: {
    Authorization: JWT,
  },
})

// SETUP
const rand = (min, max) => Math.floor(Math.random() * ((max - min) + 1)) + min
const generateStatus = {
  0: 'Active',
  1: 'Inactive',
  2: 'Suspended',
  3: 'Banned',
  4: 'Active',
  5: 'Active',
}
const generateMemberType = {
  0: 'Free',
  1: 'Tier 1',
  2: 'Tier 2',
  3: 'Tier 3',
  4: 'Free',
  5: 'Free',
  6: 'Free',
}
const generateAreaCode = {
  0: 250,
  1: 604,
  2: 778,
}
const generateGender = {
  0: 'Male',
  1: 'Female',
  2: 'LBGT',
  3: 'Male',
  4: 'Female',
  5: 'Male',
  6: 'Female',
}
const generateBirthday = {
  0: '01',
  1: '02',
  2: '03',
  3: '04',
  4: '05',
  5: '06',
  6: '07',
  7: '08',
  8: '09',
  9: '10',
  10: '11',
  11: '12',
}

const generatePerson = (cursor) => {
  console.log(`Generating Person #${cursor + 1}`)
  const mutation = `mutation {
    addPerson(
      person_status: "${generateStatus[rand(0, 5)]}",
      person_memberType: "${generateMemberType[rand(0, 6)]}",
      person_canBeEmailed: true,
      person_avatar: "${faker.internet.avatar()}",
      person_givenName: "${faker.name.firstName()}",
      person_familyName: "${faker.name.lastName()}",
      person_email: "${faker.internet.email()}",
      person_tel: "${generateAreaCode[rand(0, 2)]}${rand(1000000, 9999999)}",
      person_gender: "${generateGender[rand(0, 6)]}",
      person_birthday: "${generateBirthday[rand(0, 11)]}/${rand(10, 30)}/${rand(1930, 1999)}",
      person_location: "${faker.address.city()}, ${faker.address.state()}, ${faker.address.countryCode()}",
      person_bio: "${faker.lorem.paragraph()}",
      person_password: "testing123",
    ) {
      person_status,
      person_memberType,
      person_canBeEmailed,
      person_avatar,
      person_givenName,
      person_familyName,
      person_email,
      person_tel,
      person_gender,
      person_birthday,
      person_location,
      person_bio,
    }
  }`
  return client.request(mutation).then(data => console.log(data))
}

// EXECUTE TEST
let cursor = 0
while (cursor < NUMBER_TO_CREATE) {
  generatePerson(cursor)
  cursor += 1
}
console.log('Bulk Person create process complete.')
