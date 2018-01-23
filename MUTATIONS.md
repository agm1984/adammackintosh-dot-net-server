# Available Mutations

## Person
```
mutation Register {
  register(
    person_status: "Active",
    person_memberType: "Tier 1",
    person_canBeEmailed: true,
    person_avatar: "https://media.licdn.com/mpr/mpr/shrinknp_200_200/p/8/005/06b/140/18c2c94.jpg",
    person_givenName: "Adam",
    person_familyName: "Testaccount",
    person_email: "agm1984@adamtest.com",
    person_tel: "2507343455",
    person_gender: "Male",
    person_birthday: "08/14/1984",
    person_location: "Nanaimo, BC, Canada",
    person_bio: "testing bio asdfsdfsdfsdf",
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
}

mutation Login {
  login(
    person_email: "adamtest@test.com",
    person_password: "testing123"
  )
}

mutation addPerson {
  addPerson(
    person_status: "Active",
    person_memberType: "Tier 2",
    person_canBeEmailed: true,
    person_avatar: "https://media.licdn.com/mpr/mpr/shrinknp_200_200/p/8/005/06b/140/18c2c94.jpg",
    person_givenName: "Donald",
    person_familyName: "Samsko",
    person_email: "asfasdf@gmail.com",
    person_tel: "2504563746",
    person_gender: "Male",
    person_birthday: "08/14/1984",
    person_location: "Nanaimo, BC, Canada",
    person_bio: "testing bio asdfsdfsdfsdf",
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
}

mutation editPerson {
  editPerson(
    person_serialNumber: "81b8ed4634a7414aac7d495f5b4e7c0d",
    person_givenName: "Donald",
    person_familyName: "Samsko",
  ) {
    person_status
    person_memberType
    person_canBeEmailed
    person_avatar
    person_givenName
    person_familyName
    person_email
    person_tel
    person_gender
    person_birthday
    person_location
    person_bio
    person_lastModified
  }
}
```

## Article
Note: Serial Number is of the Person that created the Article.
```
mutation addArticle {
  addArticle(
    article_status: "Active"
    article_authorSerialNumber: "81b8ed4634a7414aac7d495f5b4e7c0d",
    article_title: "New Salmon 222",
    article_content: "We ate that and it was good",
    article_plainText: "We need some plain text also",
    article_tags: "test,good,bad,javascript"
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
}

mutation editArticle {
  editArticle(
    article_editorSerialNumber: "81b8ed4634a7414aac7d495f5b4e7c0d"
    article_oldSlug: "How-to-Eat-Onions-Properly"
    article_newStatus: "Inactive"
    article_newTitle: "How to Cabbage & Rice"
    article_newPlainText: "testing new content"
    article_newContent: "<p>testing new content</p>"
    article_newTags: "test,one,two,three"
  ) {
    article_title
    article_slug
    article_content
    article_plainText
    article_created
    article_status
    article_author {
      person_avatar
      person_serialNumber
      person_givenName,
      person_familyName,
      person_status
      person_created
    }
    article_tags {
      tag_name
    }
  }
}

mutation deactivateArticle {
  deactivateArticle(
    article_editorSerialNumber: "81b8ed4634a7414aac7d495f5b4e7c0d",
    article_slug: "test-slug"
  )
}
```
